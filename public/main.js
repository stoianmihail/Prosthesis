document.addEventListener('DOMContentLoaded', (event) => {
  var src = document.getElementById("pins")
  console.log(src)
  
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
})
