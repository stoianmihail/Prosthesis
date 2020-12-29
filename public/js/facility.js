document.addEventListener('DOMContentLoaded', (event) => {
  var config = {
    apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
    authDomain: "prosthesis-30783.firebaseapp.com",
    databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
  };
  firebase.initializeApp(config);
  
  var tmp = JSON.parse(currentData);
  var facilityId = parseInt(tmp.id);
  console.log(tmp);
  
  var customTable = document.getElementById("custom-table");

  function gatherPatients() {
    return new Promise(resolve => {
      const db = firebase.database().ref();
      var gathered = []
      db.child('facilities').on('value', function(snapshot1) {
        var facilities = snapshot1.val();
        db.child('patients').on('value', function(snapshot2) {
          var patients = snapshot2.val();
          
          // Determine its partition
          for (var i = 0; i !== patients.length; ++i) {
            var p = patients[i];
            var minDist = Number.POSITIVE_INFINITY, chosen = -1;
            for (var j = 0; j !== facilities.length; ++j) {
              var facility = facilities[j];
              var dist = Math.sqrt(Math.pow(p["coordinates"]["top"] - facility["coordinates"]["top"], 2) + Math.pow(p["coordinates"]["left"] - facility["coordinates"]["left"], 2));
              
              if (dist < minDist) {
                minDist = dist;
                chosen = j;
              }
            }
            if (chosen === facilityId) {
              gathered.push(i);
            }
          }
        }, function (errorObject2) {
          console.log("The read failed: " + errorObject2.code);
        });
      }, function (errorObject1) {
        console.log("The read failed: " + errorObject1.code);
      });
      resolve(gathered);
    });
  }
  
  function initCustomTable() {
    gatherPatients().then(gathered => {
      console.log(gathered);
    });
  }
  
  initCustomTable();
});

