document.addEventListener('DOMContentLoaded', (event) => {
  var tmp = JSON.parse(currentData);
  var patientId = parseInt(tmp.id);
  console.log(tmp);
  
  var img = document.getElementById("case-img");
  var name = document.getElementById("case-name");
  var button = document.getElementById("button");
  var donation = document.getElementById("donation");
  var progressBar = document.getElementById("progressBar");
  var ratio = document.getElementById("ratio");
  var missing = document.getElementById("missing");
	
  function initProgressBar() {
    console.log("id=" + patientId);
    const db = firebase.database().ref().child('patients/' + patientId);
    db.on("value", function(snapshot) {
      img.src = snapshot.val().img;
      name.innerHTML = snapshot.val().name;
      var sum = snapshot.val().sum;
      var total = snapshot.val().total;
      var newRatio = (1.0 * sum / total);
      ratio.innerHTML = String((newRatio * 100).toFixed(2)) + '%';
			missing.innerHTML = '-' + String(total - sum) + '$';
      progressBar.style.width = ratio.innerHTML;
      progressBar.setAttribute('data-width', newRatio * 100);
    }, function (err) {
      console.log("Error: " + err.code);
    });
  }
  initProgressBar();
  
  function updatePatient(id, donationAmount) {
    // Fetch the database
    const db = firebase.database().ref().child("patients/" + patientId);
  
    // Trigger it only once
    db.once("value", function(snapshot) {
      // And write
      var sum = snapshot.val().sum + donationAmount;
      var total = snapshot.val().total;
			
			var diff = 0;
			if (sum > total) {
				diff = sum - total;
				sum = total;
			}
			
      db.update({
        sum: sum
      });
			console.log("diff=" + diff);
			if (diff > 0)
				alert("Your donation was more than it was needed.\nNo worries, we sent the rest back into your bank account.");
      // Note: the progress bar will be updated automatically
    }, function (err) {
      console.log("The read failed: " + err.code);
    });
  }
  
  function updateDonations(uid, pid, donationAmount) {
    const db = firebase.database().ref();
    db.child("users/" + uid + "/donations/" + pid).once("value", snapshot => {
      var curr = donationAmount;
      if (snapshot.exists())
        curr += snapshot.val().amount;
      db.child("users/" + uid + "/donations/" + pid).update({
        amount: curr
      });
    });
  }
  
  function updateUserWithDonation(pid, donationAmount) {
     const auth = firebase.auth();
     auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log("update donations for uid=" + firebaseUser.uid);
        updateDonations(firebaseUser.uid, pid, donationAmount);
      } else {
        // TODO: ask for sign-in
      }
    });
  }
  
  button.onclick = function(e) {
    e.preventDefault();
    if (donation.value == "") {
      console.log("Error: no donation found!")
    } else {
      console.log(donation.value);
      var donationAmount = parseInt(donation.value);
      updatePatient(patientId, donationAmount);
      updateUserWithDonation(patientId, donationAmount);
    }
  }
});

