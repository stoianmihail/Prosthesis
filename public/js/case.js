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
  
  button.onclick = function(e) {
    e.preventDefault();
    console.log(donation.value);
    const db = firebase.database().ref().child("patients/" + tmp.id);
    
    // Trigger this only once
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
      
      // The progress bar will be updated automatically
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }
});

