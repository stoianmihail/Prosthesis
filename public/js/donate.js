document.addEventListener('DOMContentLoaded', (event) => {
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
  
  // Build the table
  var customTable = document.getElementById("custom-table");
  const db = firebase.database().ref();
  db.child('patients').on('value', snap => {
    // Init the table
    customTable.innerHTML = `<tr><th>#</th><th>Name</th><th>Collected</th><th>Missing</th></tr>`;
    
    // Collect the cluster
    var tmp = []
    snap.forEach(patient => {
      tmp.push({key : parseInt(patient.key), val : patient.val()});
    });
      
    // And sort
    tmp.sort((l, r) => { return (l.val.sum * r.val.total) > (r.val.sum * l.val.total) ? 1 : -1});
  
    for (var index = 0; index !== tmp.length; ++index) {
      // The image
      var tr = document.createElement("tr");
      tr.setAttribute("data-id", tmp[index].key);
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
      tr.onclick = function (e) {
          e.preventDefault();
      
        // Fetch the id
        let currId = this.dataset.id;
        
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
        var tmpTable = document.createElement("table");
        tmpTable.className = 'driver__table';
        var tbody = document.createElement("tbody");
        var tr = document.createElement("tr");
        
        var td1 = document.createElement("td");
        var small = document.createElement("small");
        small.innerHTML = `Missing`;
        td1.appendChild(small);
        
        var td2 = document.createElement("td");
        td2.style.color = "red";
        td2.innerHTML = driverTeam;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
        
        var donateDiv = document.createElement("div");
        donateDiv.className = 'donate';
        
        var viewButton = document.createElement("btn");
        viewButton.setAttribute('id', 'view_' + currId);
        viewButton.className = 'btn';
        viewButton.style.backgroundColor = '#74d5dd';
        viewButton.innerHTML = `View`;
        
        var donateButton = document.createElement("btn");
        donateButton.setAttribute('id', 'donate_' + currId);
        donateButton.className = 'btn';
        donateButton.innerHTML = `Donate`;
        
        donateDiv.appendChild(viewButton);
        donateDiv.appendChild(document.createTextNode("\u00A0"));
        donateDiv.appendChild(document.createTextNode("\u00A0"));
        donateDiv.appendChild(document.createTextNode("\u00A0"));
        donateDiv.appendChild(document.createTextNode("\u00A0"));
        donateDiv.appendChild(donateButton);
        
        
        tmpTable.appendChild(tbody);
        tmpTable.appendChild(donateDiv);
        driverInfo.appendChild(tmpTable);
        
        // And add the listeners
        viewButton.onclick = function(e) {
          e.preventDefault();
          window.location = '/case.ejs?id=' + currId;
        }
        donateButton.onclick = function(e) {
          e.preventDefault();
          window.location = '/case.ejs?id=' + currId;
        }
        
        driverContent.appendChild(driverInfo);
        newDriver.appendChild(driverContent);
        sidebarBody.appendChild(newDriver);
      }
          
      // And set the values
      document.getElementById("tr_" + index).setAttribute("data-image", tmp[index].val.img);
      document.getElementById("span2_" + index).innerHTML = tmp[index].val.name;
      document.getElementById("span3_" + index).innerHTML = String(((1.0 * tmp[index].val.sum / tmp[index].val.total) * 100).toFixed(2)) + '%';
      document.getElementById("span4_" + index).innerHTML = '-' + (tmp[index].val.total - tmp[index].val.sum) + '$';
    }
  }, function(err) {
    console.log("Error: " + err.code);
  });
});

