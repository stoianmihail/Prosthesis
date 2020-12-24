document.addEventListener('DOMContentLoaded', (event) => {
  // Set the configuration for the app
  var config = {
      apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
      authDomain: "prosthesis-30783.firebaseapp.com",
      databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
  };
  firebase.initializeApp(config);
  
  var tmp = JSON.parse(currentData);
  console.log(tmp);
  
  var button = document.getElementById("button");
  var donation = document.getElementById("donation");
  var progressBar = document.getElementById("progressBar");
  var ratio = document.getElementById("ratio");

  function initProgressBar() {
    const db = firebase.database().ref().child("patients");
    const child = db.child(tmp.id);
    var onlyOnce = 0;
    child.once("value", function(snapshot) {
      onlyOnce++;
      console.log("enters again");
      if (onlyOnce > 1)
        return;
      var sum = snapshot.val().sum;
      var total = snapshot.val().total;
      var newRatio = 1.0 * sum / total;
      
      console.log("newRatio=" + newRatio);
    
      ratio.innerHTML = String(parseInt(newRatio * 100)) + '%';
      progressBar.style.width = ratio.innerHTML;
      progressBar.setAttribute('data-width', parseInt(newRatio * 100));
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  initProgressBar();
  
  console.log(ratio.innerHTML);
  
  button.onclick = function(e) {
    e.preventDefault();
    console.log(donation.value);
    const db = firebase.database().ref().child("patients");
    const child = db.child(tmp.id);
    
    var onlyOnce = 0;
    child.once("value", function(snapshot) {
      onlyOnce++;
      console.log("enters again");
      if (onlyOnce > 1)
        return;
      var sum = snapshot.val().sum + parseInt(donation.value);
      var total = snapshot.val().total;
      child.update({
        sum: sum
      });
      
      var newRatio = 1.0 * sum / total;
      ratio.innerHTML = String(parseInt(newRatio * 100)) + '%';
      progressBar.style.width = ratio.innerHTML;
      progressBar.setAttribute('data-width', parseInt(newRatio * 100));
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }
  
  
  /*
  const auth = firebase.auth();
  var user = auth.currentUser;
  
  var login = document.getElementById("login-button"), logout = document.getElementById("logout-button");
  if (user) {
    console.log("ISSS")
    login.classList.add('hide');
    logout.classList.remove('hide');
  } else {
    console.log("NOT")
    logout.classList.add('hide');
    login.classList.remove('hide');
  }*/
});

