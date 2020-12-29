document.addEventListener('DOMContentLoaded', (event) => {
  var config = {
    apiKey: "AIzaSyBmQVIwwGgud9N7OXx-IE7jLWwd02XGD6s",
    authDomain: "prosthesis-30783.firebaseapp.com",
    databaseURL: "https://prosthesis-30783-default-rtdb.firebaseio.com",
  };
  firebase.initializeApp(config);
  
  // Fetch the facility id from the html page
  var tmp = JSON.parse(currentData);
  var facilityId = parseInt(tmp.id);
  console.log(tmp);

  var facilityImg = document.getElementById("facility-img");
  var customTable = document.getElementById("custom-table");
  const overlay = document.querySelector(".overlay");
  const sidebar = document.querySelector(".sidebar");
  const closeOverlayBtn = document.querySelector(".button--close");

  // Ranking logic
  const sidebarClose = () => {
    sidebar.classList.remove("is-open");
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.classList.remove("is-open");
      overlay.style.opacity = 1;
    }, 300);
  };

  closeOverlayBtn.addEventListener("click", function () {
    sidebarClose();
  });

  overlay.addEventListener("click", function () {
    sidebarClose();
  });
  
  let gatherPatients = new Promise((resolve, reject) => {
    const db = firebase.database().ref();
    var gathered = []

    db.child('facilities').once('value', snapshot1 => {
      // If the facility doesn't exist
      if (facilityId >= snapshot1.val().length)
        return;
      
      // Update the image of the facility
      var facilities = snapshot1.val();
      facilityImg.src = facilities[facilityId].img;
      
      // Find clusters
      db.child('patients').once('value', snapshot2 => {
        var patients = snapshot2.val();
        snapshot2.forEach(patient => {
          var p = patient.val();
          var minDist = Number.POSITIVE_INFINITY, chosen = -1;
          for (var index = 0; index != facilities.length; ++index) {
            var facility = facilities[index];
            var dist = Math.sqrt(Math.pow(p["coordinates"]["top"] - facility["coordinates"]["top"], 2) + Math.pow(p["coordinates"]["left"] - facility["coordinates"]["left"], 2));
              
            // Take the minimum distance and update the cluster id
            if (dist < minDist) {
              minDist = dist;
              chosen = index;
            }
          }
          if (chosen === facilityId) {
            gathered.push(patient.key);
          }
        });
        resolve(gathered);
      }, function (err) {
        reject(err.code);
      });
    }, function (err) {
      reject(err.code);
    });
  });
  
  let initCustomTable = new Promise((resolve, reject) => {
    gatherPatients.then(gathered => {
      /*
        <tr class="list__row" data-image=<%=data[i].img%>>
          <td class="list__cell"><span class="list__value black"><%=(i+1)%></span></td>
          <td class="list__cell"><span class="list__value"><%=data[i].name%></span></td>
          <td class="list__cell"><span class="list__value green"><%=(data[i].sum/data[i].total).toFixed(2)%>%</td>
          <td class="list__cell"><span class="list__value red">- <%=data[i].total - data[i].sum%>$</span></td>
        </tr>
      */
      console.log(gathered);
      var customTable = document.getElementById("custom-table");
      for (var index = 0; index !== gathered.length; ++index) {
        // The image
        var tr = document.createElement("tr");
        tr.setAttribute("id", "tr_" + index);
        tr.className = "list__row";
        
        // The index
        var td1 = document.createElement("td");
        td1.className = "list__cell"
        var span1 = document.createElement("span");
        span1.setAttribute("id", "span1_" + index);
        span1.innerHTML = String(index + 1);
        span1.className = "list__value black";
        td1.appendChild(span1);
         
        // The name
        var td2 = document.createElement("td");
        td2.className = "list__cell"
        var span2 = document.createElement("span");
        span2.setAttribute("id", "span2_" + index);
        span2.className = "list__value";
        td2.appendChild(span2);
        
        // The ratio
        var td3 = document.createElement("td");
        td3.className = "list__cell"
        var span3 = document.createElement("span");
        span3.setAttribute("id", "span3_" + index);
        span3.className = "list__value green";
        td3.appendChild(span3);
        
        // The missing amount
        var td4 = document.createElement("td");
        td4.className = "list__cell"
        var span4 = document.createElement("span");
        span4.setAttribute("id", "span4_" + index);
        span4.className = "list__value red";
        td4.appendChild(span4);
        
        // And complete the row and the table
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        customTable.appendChild(tr);
        
        // Add the listener
        tr.addEventListener("click", function () {
          overlay.style.opacity = 0;
          overlay.classList.add("is-open");
          sidebar.classList.add("is-open");
          setTimeout(() => {
            overlay.style.opacity = 1;
          }, 100);

          // Sidebar content
          const sidebarBody = document.querySelector(".sidebar__body");
          sidebarBody.innerHTML = '';

          const driverName = this.querySelector(".list__cell:nth-of-type(2) .list__value").innerHTML;
          const driverTeam = this.querySelector(".list__cell:nth-of-type(4) .list__value").innerHTML;
          const driverPoints = this.querySelector(".list__cell:nth-of-type(4) .list__value").innerHTML;
          const driverImage = this.dataset.image;
          const driverNationality = this.dataset.nationality;
          const driverCountry = this.dataset.country;

          const newDriver = document.createElement('div');
          newDriver.classList = 'driver';

          const driverContent = document.createElement('div');
          driverContent.classList = 'driver__content';

          const profile = document.createElement('div');
          profile.classList = 'driver__image';
          profile.style.backgroundImage = `url('${driverImage}')`;
          newDriver.appendChild(profile);

          const driverTitle = document.createElement('div');
          driverTitle.classList = 'driver__title';
          driverTitle.innerHTML = driverName;
          driverContent.appendChild(driverTitle);

          const driverInfo = document.createElement('div');
          driverInfo.innerHTML = `
              <table class="driver__table">
                  <tbody>
                      <tr>
                          <td><small>Missing</small></td>
                          <td style="color: red;">${driverTeam}</td>
                      </tr>
                  </tbody>
              </table>`;
          driverContent.appendChild(driverInfo);

          newDriver.appendChild(driverContent);
          sidebarBody.appendChild(newDriver);
        });
      }
      resolve(gathered);
    });
  });
  
  let cluster = new Set();
  function initPage() {
    initCustomTable.then(gathered => {
      const db = firebase.database().ref();
      for (var index = 0; index !== gathered.length; ++index)
        cluster.add(gathered[index]);
      db.child("patients").on("value", snap => {
        var tmp = []
        snap.forEach(patient => {
          if (cluster.has(patient.key)) {
            tmp.push(patient.val());
          }
        });
        
        tmp.sort((l, r) => { return (l.sum * r.total) > (r.sum * l.total) ? 1 : -1});
      
        for (var index = 0; index !== tmp.length; ++index) {
          document.getElementById("tr_" + index).setAttribute("data-image", tmp[index].img);
          document.getElementById("span2_" + index).innerHTML = tmp[index].name;
          document.getElementById("span3_" + index).innerHTML = String(((1.0 * tmp[index].sum / tmp[index].total) * 100).toFixed(2)) + '%';
          document.getElementById("span4_" + index).innerHTML = '-' + (tmp[index].total - tmp[index].sum) + '$';
        }
      });
    });
  }
  
  initPage();
});

