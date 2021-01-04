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
	
	document.getElementById("submitter").addEventListener("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		if (!currentFiles.length) {
			alert("No file found");
			return;
		}
		
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
				const ref = firebase.database().ref('queue');
				ref.push().set({
					file: newName
				});
			}
		);
	});
});
