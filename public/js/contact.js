document.addEventListener('DOMContentLoaded', (event) => {
  const inputs = document.querySelectorAll(".input");

  function focusFunc() {
  let parent = this.parentNode;
    parent.classList.add("focus");
  }

  function blurFunc() {
    let parent = this.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);
  });

  // Set the configuration for the app
  var config = {
      apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
      authDomain: "prosthesis-30783.firebaseapp.com",
      databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
  };
  firebase.initializeApp(config);
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
  }
});

