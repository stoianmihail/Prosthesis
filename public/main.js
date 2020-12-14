document.addEventListener('DOMContentLoaded', (event) => {
  var src = document.getElementById("pins")
  console.log(src)
  var numPins = 0
  function loadPins() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("now=" + this.responseText)
        var response = JSON.parse(this.responseText)
        console.log(response)
        console.log(response.length)
        numPins = response.length
        for (var i = 0, size = response.length; i < size; i++) {
          var pin = response[i];
          console.log(pin)
          
          var curr = document.createElement("div");
          curr.setAttribute("id", "popup_" + i);
          curr.className = "popup";
          
          var span = document.createElement("span")
          span.setAttribute("id", "myPopup_" + i)
          span.className = "popuptext"
          
          var button = document.createElement("button")
          button.setAttribute("id", "button_" + i)
          button.className = 'view'
          button.textContent = 'test value';
          span.appendChild(button)
          
          var img = document.createElement("img")
          img.src = 'images/pin.png'
          img.className = 'pin'
          img.style.top = pin["top"] + 'px'
          img.style.left = pin["left"] + 'px'
          img.setAttribute("id", "pin_" + i);
          img.setAttribute("onmouseover", "mouseOver(this)");
          // img.setAttribute("onmouseout", "mouseOut(this)")
          
          curr.appendChild(span)
          curr.appendChild(img)
          src.appendChild(curr)
        }
      }
    };
    xhttp.open("GET", "pin.json", true);
    xhttp.send();
  }
  
  loadPins()

  console.log(src)
  
  var isActive = []
  for (var index = 0; index != numPins; ++index)
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
  
  mouseOut = function(elem) {
    /*
    console.log(elem.id)
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
*/
  }
})
