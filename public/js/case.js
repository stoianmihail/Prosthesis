document.addEventListener('DOMContentLoaded', (event) => {
  var tmp = JSON.parse(currentData);
  console.log(tmp);
  
  var button = document.getElementById("button");
  var donation = document.getElementById("donation");
  var progressBar = document.getElementById("progressBar");
  var ratio = document.getElementById("ratio");

  function initProgressBar() {
    console.log("id=" + tmp.id);
    const db = firebase.database().ref().child('patients/' + String(tmp.id));
    db.on("value", function(snapshot) {
      var sum = snapshot.val().sum;
      var total = snapshot.val().total;
      var newRatio = 1.0 * sum / total;
      ratio.innerHTML = String(parseInt(newRatio * 100)) + '%';
      progressBar.style.width = ratio.innerHTML;
      progressBar.setAttribute('data-width', parseInt(newRatio * 100));
    }, function (error) {
      console.log("Error: " + error.code);
    });
  }

  initProgressBar();
  
  function updatePatient(id) {
    // Fetch the database
    const db = firebase.database().ref().child("patients/" + tmp.id);
  
    // Trigger it only once
    var onlyOnce = 0;
    db.on("value", function(snapshot) {
      if (onlyOnce > 0)
        return;
      onlyOnce++;
      
      // And write
      var sum = snapshot.val().sum + parseInt(donation.value);
      var total = snapshot.val().total;
      db.update({
        sum: sum
      });
      // Note: the progress bar will be updated automatically
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }
  
  function updateDonations(uid, pid) {
    const db = firebase.database().ref();
    db.child("users/" + uid).once("value", snapshot => {
      if (snapshot.exists()){
        const userData = snapshot.val();
        var prev = userData.donations;
        if (prev == undefined) {
          db.child("users/" + uid).update({
            donations: [pid]
          });
        } else {
          // TODO: should we use a transaction instead?
          // TODO: the user could have opened 2 windows and "prev.includes" is not thread-safe
          if (!prev.includes(pid)) {
            db.child("users/" + uid).update({
              donations: prev
            });
          }
        } 
      } else {
        console.log("Error: the user does not exist!");
      }
    });
  }
  
  function updateUserWithDonation(pid) {
     const auth = firebase.auth();
     auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        console.log("update donations for uid=" + firebaseUser.uid);
        updateDonations(firebaseUser.uid, pid);
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
      
      updatePatient(tmp.id);
      updateUserWithDonation(tmp.id);
    }
  }
});

