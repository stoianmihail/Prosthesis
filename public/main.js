document.addEventListener('DOMContentLoaded', (event) => {
  var src = document.getElementById("pins")
  console.log(src)
  
  // Set the configuration for the app
  var config = {
      apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
      authDomain: "prosthesis-30783.firebaseapp.com",
      databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
  };
  firebase.initializeApp(config);

  
  //const preObject = document.getElementById("object");
  const db = firebase.database().ref();
  const auth = firebase.auth();
  
  /*
  // Sync object changes
  db.on('value', function(snap) {
    console.log(snap.val());
  });
*/
  // Get a reference to the database service
  //var database = firebase.database();
  
  var numFacilities = 0;
  function loadFacilities() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("now=" + this.responseText)
        var response = JSON.parse(this.responseText)
        console.log(response)
        console.log(response.length)
        numFacilities = response.length
        for (var i = 0, size = response.length; i < size; i++) {
          var pin = response[i];
          console.log(pin)
          
          var curr = document.createElement("div");
          curr.setAttribute("id", "popup_" + i);
          curr.className = "popup";
          
          var span = document.createElement("span")
          span.setAttribute("id", "myPopup_" + i)
          span.className = "popuptext"
          
          // View button
          var viewButton = document.createElement("button")
          viewButton.setAttribute("id", "button_" + i)
          viewButton.className = 'view'
          viewButton.setAttribute("onclick", "fetchFacilityId(this)");
          viewButton.textContent = 'View';
          span.appendChild(viewButton)
          
          // <a class="close" onclick="closePopup(this);">×</a></span>
          var closeButton = document.createElement("a")
          closeButton.setAttribute("id", "close_" + i)
          closeButton.className = 'close';
          closeButton.textContent = '×';
          closeButton.setAttribute("onclick", "closePopup(this)");
          span.appendChild(closeButton);
          
          var img = document.createElement("img")
          img.src = 'images/facility_pin.png'
          img.className = 'pin'
          img.style.top = pin["coordinates"]["top"] + 'px'
          img.style.left = pin["coordinates"]["left"] + 'px'
          img.setAttribute("id", "pin_" + i);
          img.setAttribute("onmouseover", "mouseOver(this)");
          img.setAttribute("onclick", "fetchFacilityId(this)");
          
          curr.appendChild(span)
          curr.appendChild(img)
          src.appendChild(curr)
        }
      }
    };
    xhttp.open("GET", "db/facility.json", true);
    xhttp.send();
  }  
  loadFacilities()

  
  function loadFacilityId(id) {
    window.location = '/facility.ejs?id=' + id;
  }
  
  var isActive = []
  for (var index = 0; index != numFacilities; ++index)
    isActive.push(true)
  
  mouseOver = function(elem) {
    console.log(elem.id)
    var index = elem.id.split("_")[1]
    
    if (isActive[parseInt(index)])
      return;
    isActive[parseInt(index)] = true
    var popup = document.getElementById("myPopup_" + index);
    /*
    popup.style.height = "100px"
    */
    const style = getComputedStyle(popup)
    
    popup.style.top = (parseInt(elem.style.top.replace(/px/,"")) - parseInt(style.height.replace(/px/,"")) - 25) + "px";
    popup.style.left = (parseInt(elem.style.left.replace(/px/,"")) - 71) + "px";
    popup.classList.toggle("show");
  }
  
  closePopup = function(elem) {
    console.log(elem.id)
    var index = elem.id.split("_")[1]
    isActive[parseInt(index)] = false;
    var popup = document.getElementById("myPopup_" + index);
    popup.classList.toggle("show");
  }
  
  fetchFacilityId = function(elem) {
    console.log("fetch " + elem.id);
    // window.location = 'http://localhost:8080/case.html'
    loadFacilityId(parseInt(elem.id.split("_")[1]));
  }
  
  var login = document.getElementById("login-button"),
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

  logout.classList.add('hide');
  
  function getAttributes(type) {
    var dict = {}
    dict["email"] = document.getElementById(type + "-email").value;
    if (type !== "reset") {
      dict["password"] = document.getElementById(type + "-password").value
    }
    if (type === "signup") {
      dict["username"] = document.getElementById(type + "-username").value;
    }
    return dict;
  }

  function handleForm(type) {
    var attr = getAttributes(type);
    if (type === "signup") {
      const promise = auth.createUserWithEmailAndPassword(attr["email"], attr["password"]);
      promise.catch(e => console.log(e.message));
    } else if (type == "signin") {
      const promise = auth.signInWithEmailAndPassword(attr["email"], attr["password"]);
      promise.catch(e => console.log(e.message));
    } else {
      console.log("not supported!")
    }
  }
  
  auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log(firebaseUser);
      login.classList.add('hide');
      logout.classList.remove('hide');
    } else {
      console.log("not logged in");
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
    
  //open modal
  login.onclick = function(event) {
    event.preventDefault();
    form_modal.classList.add('is-visible'); 
    //show the selected form
    ( $(event.target).is('.signup') ) ? signup_selected() : login_selected();
  }

  //open modal
  logout.onclick = function(event) {
    event.preventDefault();
    auth.signOut();
    login.classList.remove('hide');
    logout.classList.add('hide');
  }

  //close modal
  document.querySelector('.user-modal').onclick = function(event){
    if( $(event.target).is(form_modal) || $(event.target).is('.close-form') ) {
      form_modal.classList.remove('is-visible');
    } 
  }
  //close modal when clicking the esc keyboard button
  document.onkeyup = function(event){
      if(event.which == '27'){
        form_modal.classList.remove('is-visible');
      }
  };

  //switch from a tab to another
  form_modal_tab.onclick = function(event) {
    event.preventDefault();
    ( $(event.target).is( tab_login ) ) ? login_selected() : signup_selected();
  }

  //hide or show password
  var hidePassword = document.querySelectorAll(".hide-password")
  for (i = 0; i != hidePassword.length; i++) {
    hidePassword[i].onclick = function(event) {
      event.preventDefault();
      console.log("enter here");
      var $this= $(this),
        $password_field = $this.prev('input');
      
      ( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
      ( 'Show' == $this.text() ) ? $this.text('Hide') : $this.text('Show');
      //focus and move cursor to the end of input field
      //$password_field.putCursorAtEnd();
    }
  }

  //show forgot-password form 
  forgot_password_link.onclick = function(event){
    event.preventDefault();
    forgot_password_selected();
  }

  //back to login from the forgot-password form
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
})
