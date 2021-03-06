document.addEventListener('DOMContentLoaded', (event) => {
  var config = {
      apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
      authDomain: "prosthesis-30783.firebaseapp.com",
      databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
			storageBucket: "prosthesis-30783.appspot.com"  
  };
  firebase.initializeApp(config);

  const db = firebase.database().ref();
  const auth = firebase.auth();
  
  var login = document.getElementById("login-button"),
  menu = document.getElementById("umenu"),
  ubutton = document.getElementById("ubutton"),
	makeOrder = document.getElementById("makeOrder-button"),
	myDonations = document.getElementById("mydonations-button"),
  logout = document.getElementById("logout-button"),
  form_modal = document.querySelector('.user-modal'),
  form_login = document.getElementById('login'),
  form_signup = document.getElementById('signup'),
  form_forgot_password = form_modal.querySelector('#reset-password'),
  form_modal_tab = document.querySelector('.switcher'),
  tab_login = document.getElementById("tab-login"),
  tab_signup = document.getElementById("tab-new-account"),
  forgot_password_link = form_login.querySelector('.form-bottom-message a'),
  back_to_login_link = form_forgot_password.querySelector('.form-bottom-message a');

  function getAttributes(type) {
    var dict = {}
    dict["email"] = document.getElementById(type + "-email").value;
    if (type !== "reset") {
      dict["password"] = document.getElementById(type + "-password").value
    }
    if (type === "signup") {
			dict["isDoctor"] = (document.getElementById("accept-terms").value === "on");
      dict["username"] = document.getElementById(type + "-username").value;
    }
    return dict;
  }

  var username = null, isDoctor = null;
  function handleForm(type) {
    var attr = getAttributes(type);
    if (type === "signup") {
      username = attr["username"];
			isDoctor = attr["isDoctor"];
      const promise = auth.createUserWithEmailAndPassword(attr["email"], attr["password"]);
      promise.catch(e => console.log(e.message));
    } else if (type === "signin") {
      const promise = auth.signInWithEmailAndPassword(attr["email"], attr["password"]);
      promise.catch(e => console.log(e.message));
    } else {
      console.log("Not supported!")
    }
  }
  
  function fire(uid) {
    console.log("uid=" + uid)
    db.child("users/" + uid).once("value", snapshot => {
      if (snapshot.exists()) {
				// Does the user exist?
        const userData = snapshot.val();
        const n = userData.username;
        
				// Hide or show the orders
				const isDoctor = userData.isDoctor;
				makeOrder.style.display = isDoctor ? "block" : "none";
				ubutton.innerHTML = n;
      } else {
				// Sign up? Check for username
        if ((username === null) || (isDoctor === null)) {
          console.log("No 'username' or 'isDoctor' found!");
        } else {
          db.child("users/" + uid).set({
            username: username,
						isDoctor: isDoctor
          });
					makeOrder.style.display = isDoctor ? "block" : "none";
					ubutton.innerHTML = username;
        }
      }
    });
  }
  
  auth.onAuthStateChanged(firebaseUser => {
    console.log("inside!")
    if (firebaseUser) {
      console.log("uid" + firebaseUser.uid);
      login.classList.add('hide');
      menu.classList.remove('hide');
      fire(firebaseUser.uid);
    } else {
      menu.classList.add('hide');
      login.classList.remove('hide');
    }
  });
  
  document.getElementById("sign-in-final").onclick = function(e) {
    e.preventDefault();
    handleForm("signin");
    
    // And remove the modal
    form_modal.classList.remove('is-visible');
  }

  document.getElementById("sign-up-final").onclick = function(e) {
    e.preventDefault();
    handleForm("signup");

    // And remove the modal
    form_modal.classList.remove('is-visible');
  }
  
  document.getElementById("reset-final").onclick = function(e) {
    e.preventDefault();
    handleForm("reset");      
    
    // And remove the modal
    form_modal.classList.remove('is-visible');
  }
    
  // Open modal
  login.onclick = function(event) {
    event.preventDefault();
    form_modal.classList.add('is-visible'); 
    // Show the selected form
    ( $(event.target).is('.signup') ) ? signup_selected() : login_selected();
  }

  // Open modal
  logout.onclick = function(event) {
    event.preventDefault();
    auth.signOut();
    login.classList.remove('hide');
    menu.classList.add('hide');
    
    // Check if the user wants to logout on the 'mydonations'-webpage
    var url = document.createElement('a');
    url.href = window.name;
    if (url.pathname === "/mydonations.ejs")
      window.location = "/about.html"
  }

  // Close modal
  document.querySelector('.user-modal').onclick = function(event){
    if( $(event.target).is(form_modal) || $(event.target).is('.close-form') ) {
      form_modal.classList.remove('is-visible');
    } 
  }
  
  // Close modal when clicking the esc keyboard button
  document.onkeyup = function(event){
      if(event.which == '27'){
        form_modal.classList.remove('is-visible');
      }
  };

  // Switch from a tab to another
  form_modal_tab.onclick = function(event) {
    event.preventDefault();
    ( $(event.target).is( tab_login ) ) ? login_selected() : signup_selected();
  }

  // Hide or show password
  var hidePassword = document.querySelectorAll(".hide-password")
  for (i = 0; i != hidePassword.length; i++) {
    hidePassword[i].onclick = function(event) {
      event.preventDefault();
      console.log("enter here");
      var $this= $(this),
        $password_field = $this.prev('input');
      
      ( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
      ( 'Show' == $this.text() ) ? $this.text('Hide') : $this.text('Show');
      // focus and move cursor to the end of input field
      // $password_field.putCursorAtEnd();
    }
  }

  // Show forgot-password form 
  forgot_password_link.onclick = function(event){
    event.preventDefault();
    forgot_password_selected();
  }

  // Back to login from the forgot-password form
  back_to_login_link.onclick = function(event){
    event.preventDefault();
    login_selected();
  }

  function login_selected(){
    form_login.classList.add('is-selected');
    form_signup.classList.remove('is-selected');
    form_forgot_password.classList.remove('is-selected');
    tab_login.classList.add('selected');
    tab_signup.classList.remove('selected');
  }

  function signup_selected(){
    form_login.classList.remove('is-selected');
    form_signup.classList.add('is-selected');
    form_forgot_password.classList.remove('is-selected');
    tab_login.classList.remove('selected');
    tab_signup.classList.add('selected');
  }

  function forgot_password_selected(){
    form_login.classList.remove('is-selected');
    form_signup.classList.remove('is-selected');
    form_forgot_password.classList.add('is-selected');
  }
  
  myDonations.onclick = function(event) {
    event.preventDefault();
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser)
        window.location = '/mydonations.ejs?id=' + firebaseUser.uid;
    });
  }
  
  makeOrder.onclick = function(event) {
    event.preventDefault();
		window.location = '/order.html';
  }
});
