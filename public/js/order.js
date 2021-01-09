document.addEventListener('DOMContentLoaded', (event) => {
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
	
	const db = firebase.database().ref();
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
				
				db.child('facilities').once('value', snap => {
					var min = Infinity, chosen = -1;
					snap.forEach(facility => {
						let coords = facility.val().coordinates;
						let dist = Math.sqrt((coords["left"] - left)**2 + (coords["top"] - top)**2);
						if (dist < min) {
							min = dist;
							chosen = facility.key;
						}
					});
						
					// Update the patients
					var estimatedCost = 50 + min * 0.5;
					db.child('patients/').once('value', patSnap => {
						let newId = 0;
						if (patSnap.exists())
							newId = patSnap.val().length;
						db.child('patients/' + newId).set({
							name: name,
							coordinates: {left: left, top: top},
							img: newName,
							sum: 0,
							total: estimatedCost.toFixed(2)
						});
						
						// Update the cluster of the facility
						let facility = snap.val().facility;
						db.child('facilities/' + facility + '/cluster').once('value', facSnap => {
							let tmp = [];
							if (facSnap.exists())
								tmp = facSnap.val();
							tmp.push(newId);
							db.child('facilities/' + facility).update({
								cluster: tmp
							});
						}, err => {
							console.log("Err: " + err);
						});
					}, err => {
						console.log("Err: " + err);
					});
			}, err => {
				console.log("Err: " + err);
			});
		});
	});
});
