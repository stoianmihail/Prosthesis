document.addEventListener('DOMContentLoaded', (event) => {
	var amputationInput = document.querySelector("#amputation-input");
	var profileInput = document.querySelector("#profile-input");
	document.getElementById("amputation-selector").addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		console.log("clicked!");
		amputationInput.click();
	});
	document.getElementById("profile-selector").addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		console.log("clicked!");
		profileInput.click();
	});
	
	var nameInput = document.getElementById("name");
	var addressInput = document.getElementById("address");
	var uploader = document.getElementById("uploader");
	var fileButton = document.getElementById("fileButton");
	var amputationFiles = []
	var profileFiles = []
	
	function listener1(e) {
		e.preventDefault();
		e.stopPropagation();
		
		amputationFiles = []
		var fileObject = e.target.files[0];
		amputationFiles.push(fileObject);
		
		var fileReader = new FileReader();
		fileReader.readAsDataURL(fileObject);
		fileReader.onload = function () {
			var result = fileReader.result;
			var img = document.querySelector("#amputation-preview");
			img.setAttribute("src", result);
		};
	}
	
	function listener2(e) {
		e.preventDefault();
		e.stopPropagation();
		
		profileFiles = []
		var fileObject = e.target.files[0];
		profileFiles.push(fileObject);
		
		var fileReader = new FileReader();
		fileReader.readAsDataURL(fileObject);
		fileReader.onload = function () {
			var result = fileReader.result;
			var img = document.querySelector("#profile-preview");
			img.setAttribute("src", result);
		};
	}
	
	amputationInput.addEventListener("change", listener1);
	profileInput.addEventListener("change", listener2);
	
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
		
		// Optional: if (printError(name, "", "name")) return;
		if (printError(address, "", "address")) return;
		if (printError(amputationFiles.length, 0, "file")) return;
		if (printError(profileFiles.length, 0, "file")) return;
														 
		var amp = amputationFiles[0];
		var profile = profileFiles[0];
		var date = Date.now();
		var ampName = date + "_amp";
		var profileName = date + "_profile";
		
		// Compute the location
		var completed = 0;
		function finishTask() {
			if (completed < 2)
				return;
			
			var tmp = address.split(",");
			var left = parseInt(tmp[0]);
			var top = parseInt(tmp[1]);
			
			db.child('facilities').once('value', snap => {
				var min = Infinity, chosen = -1;
				snap.forEach(facility => {
					let coords = facility.val().coordinates;
					console.log("coords=")
					console.log(coords);
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
						img: ampName,
						profile: profileName,
						sum: 0,
						total: estimatedCost.toFixed(2)
					});
					
					// Notify the doctor
					alert("Order: #" + newId); 
					
					// Update the cluster of the facility
					let facility = chosen;
					console.log("chosen=" + chosen);
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
		}
		
		function uploadImageAsPromise(item) {
			return new Promise(function (resolve, reject) {
				var storageRef = firebase.storage().ref('photos/' + item.name);

				// Upload file
				var task = storageRef.put(item.obj, {contentType: item.obj.type });

				// Update progress bar
				task.on('state_changed',
					function progress(snapshot) {
						var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
						uploader.value = percentage;
					}, function error(err) {
					}, function complete(){
						console.log("complete!" + item.name);
						completed++;
						finishTask();
					}
				);
			});
		}

		myItems = [{name: ampName, obj: amp}, {name: profileName, obj: profile}]
		myItems.map(item => uploadImageAsPromise(item))
	});
});
