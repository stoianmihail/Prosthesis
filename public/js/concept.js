$(window).scroll(function(e){
  parallax();
});

document.addEventListener('DOMContentLoaded', (event) => {
	var src = document.getElementById("pins")
	console.log(src)

	function findPos(obj){
		var curleft = 0;
		var curtop = 0;

		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		return {X:curleft,Y:curtop};
	}
	
	var now = 85;
	var numFacilities = 0;
	function loadFacilities(ret) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log("now=" + this.responseText)
				var response = JSON.parse(this.responseText)
				console.log(response)
				console.log(response.length)
				numFacilities = response.length;
				
				var which = -1;
				var top = parseInt(ret[0]);
				var left = parseInt(ret[1]);
				var minDist = Infinity
				for (var i = 0; i !== response.length; ++i) {
					let currDist = Math.sqrt((top - response[i]["coordinates"]["top"])**2 + (left - response[i]["coordinates"]["left"])**2);
					console.log("currDist=" + currDist)
					if (currDist < minDist) {
						minDist = currDist;
						which = i;
					}
				}
				
				console.log("which=" + which);
				for (var i = 0, size = response.length; i !== size; i++) {
					if (i !== which)
						continue;
					var pin = response[i];
					console.log(pin)
					
					var curr = document.createElement("div");
					curr.setAttribute("id", "popup_" + i);
					curr.className = "popup";
					
					var img = document.createElement("img")
					img.src = 'images/facility_pin.png'
					img.className = 'pin'
					
					var tmp = document.getElementById("map").getBoundingClientRect();
					var doc = document.documentElement.getBoundingClientRect();
					img.style.top = (tmp.top + 1.0 * tmp.height * 40 * pin["coordinates"]["top"] / doc.height) + 'px'
					img.style.left = (tmp.left + 1.0 * tmp.width * pin["coordinates"]["left"] / doc.width) + 'px'
					img.setAttribute("id", "pin_" + i);
					img.setAttribute("onclick", "window.location = '/facility.ejs?id=" + which + "';");
  
					curr.appendChild(img)
					src.appendChild(curr)
				}
			}
		};
		xhttp.open("GET", "db/facility.json", true);
		xhttp.send();
	}  
	
	
	document.getElementById("submitter").onclick = function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		var addr = document.getElementById("addr");
		if (!addr.value)
			return;
		
		var ret = addr.value.split(",");
		loadFacilities(ret);
	}
});


function parallax(){
  var scrolled = $(window).scrollTop();
  $('.background').css('top',-(scrolled*0.15)+'px');
}
