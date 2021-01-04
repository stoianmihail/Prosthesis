document.addEventListener('DOMContentLoaded', (event) => {
	var config = {
		apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
		authDomain: "prosthesis-30783.firebaseapp.com",
		databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
		storageBucket: "prosthesis-30783.appspot.com"  
	};
	firebase.initializeApp(config);

	var input = document.querySelector("#file-input");
	document.getElementById("selector").addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		console.log("clicked!");
		input.click();
	});

	var nameInput = document.getElementById("name");
	var addressInput = document.getElementById("address");
	var uploader = document.getElementById("uploader");
	var fileButton = document.getElementById("fileButton");
	var currentFiles = []
	
	input.addEventListener("change", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		currentFiles = []
		var fileObject = e.target.files[0];
		currentFiles.push(fileObject);
		
		var fileReader = new FileReader();
		fileReader.readAsDataURL(fileObject);
		fileReader.onload = function () {
			var result = fileReader.result;
			var img = document.querySelector("#preview");
			img.setAttribute("src", result);
		};
	});
	
	var submitter = document.getElementById("submitter");
	submitter.addEventListener("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// Get inputs
		var name = nameInput.value;
		var address = addressInput.value;
		function printError(obj, val, debugName) {
			if (obj === val) {
				alert("No " + debugName + " found!");
				return true;
			}
			return false;
		}
		
		if (printError(name, "", "name")) return;
		if (printError(address, "", "address")) return;
		if (printError(currentFiles.length, 0, "file")) return;
		
		
																												
		var fileObject = currentFiles[0];
		console.log("inside=" + fileObject.name);
		
		console.log(fileObject.type);
		var metadata = {
			contentType: fileObject.type
		};

		var newName = Date.now();
		var storageRef = firebase.storage().ref('photos/' + newName);
		var task = storageRef.put(fileObject, metadata);
		
		task.on('state_changed',
			function progress(snap) {
				var p = (snap.bytesTransferred / snap.totalBytes) * 100;
				uploader.value = p;
			},
			function error(err) {
				console.log(err);
			},
			function complete() {
				// Compute the location
				var tmp = address.split(",");
				var left = parseInt(tmp[0]);
				var top = parseInt(tmp[1]);
				
				const db = firebase.database().ref();
				db.child('facilities').once("value", snap => {
					var min = Infinity, chosen = -1;
					snap.forEach(facility => {
						let fl = parseInt(facility.val().coordinates.left);
						let ft = parseInt(facility.val().coordinates.top);
						let dist = Math.sqrt((fl - left)**2 + (ft - top)**2);
						
						if (dist < min) {
							min = dist;
							chosen = facility.key;
						}
					});
					
					db.child('facilities/' + chosen + '/queue').push().set({
						name: name,
						coordinates: {left : left, top : top},
						file: newName
					});
					
					alert("The order has been processed!\nOne of our prosthetists will analyze it as soon as possible!\n");
				}, err => {
					console.log("Error: " + err);
				});
			}
		);
	});
});
