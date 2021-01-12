document.addEventListener('DOMContentLoaded', (event) => {
  var tmp = JSON.parse(currentData);
  var userId = tmp.id;
  
  var table = document.getElementById("donations");
  var total = document.getElementById("total");
  const tableRow = document.querySelectorAll(".list__row");
  const overlay = document.querySelector(".overlay");
  const sidebar = document.querySelector(".sidebar");
  const closeOverlayBtn = document.querySelector(".button--close");

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
  
  const db = firebase.database().ref();
  db.child('users/' + userId + '/donations').on('value', snap => {
    var curr = []
    var cluster = new Set();
    var totalAmount = 0;
    snap.forEach(donation => {
      curr.push({pid : donation.key, val : donation.val()});
      totalAmount += donation.val().amount;
      cluster.add(donation.key);
    });
    curr.sort((l, r) => { return l.val.amount < r.val.amount ? 1 : -1});
    total.innerHTML = `Total: ` + totalAmount + '€';
    
    /*
      <tr><th>#</th><th>Name</th><th>Collected</th><th>Missing</th><th>My Donation</th></tr>
      <tr class="list__row" data-image=<%=data[i].img%>>
        <td class="list__cell"><span class="list__value black"><%=(i+1)%></span></td>
        <td class="list__cell"><span class="list__value"><%=data[i].name%></span></td>
        <td class="list__cell"><span class="list__value green"><%=(data[i].sum/data[i].total).toFixed(2)%>%</td>
        <td class="list__cell"><span class="list__value red">- <%=data[i].total - data[i].sum%>$</span></td>
        <td class="list__cell"><span class="list__value">+ <%=data[i].me%>$</span></td>
      </tr>
    */
    
    table.innerHTML = `<tr><th>#</th><th>Name</th><th>Collected</th><th>Missing</th><th>My Donation</th></tr>`;
    for (var index = 0; index !== curr.length; ++index) {
      console.log("Put now: " + curr[index].pid);
      
      // The image
      var tr = document.createElement("tr");
      tr.setAttribute("id", "tr_" + curr[index].pid);
      tr.setAttribute("data-id", curr[index].pid);
      tr.className = "list__row";
      
      // The index
      var td1 = document.createElement("td");
      td1.className = "list__cell"
      var span1 = document.createElement("span");
      span1.setAttribute("id", "span1_" + curr[index].pid);
      span1.innerHTML = String(index + 1);
      span1.className = "list__value black";
      td1.appendChild(span1);
        
      // The name
      var td2 = document.createElement("td");
      td2.className = "list__cell"
      var span2 = document.createElement("span");
      span2.setAttribute("id", "span2_" + curr[index].pid);
      span2.className = "list__value";
      td2.appendChild(span2);
      
      // The ratio
      var td3 = document.createElement("td");
      td3.className = "list__cell"
      var span3 = document.createElement("span");
      span3.setAttribute("id", "span3_" + curr[index].pid);
      span3.className = "list__value green";
      td3.appendChild(span3);
      
      // The missing amount
      var td4 = document.createElement("td");
      td4.className = "list__cell"
      var span4 = document.createElement("span");
      span4.setAttribute("id", "span4_" + curr[index].pid);
      span4.className = "list__value red";
      td4.appendChild(span4);
      
      // My donation
      var td5 = document.createElement("td");
      td5.className = "list__cell"
      var span5 = document.createElement("span");
      span5.setAttribute("id", "span5_" + curr[index].pid);
      span5.className = "list__value";
      span5.innerHTML = '+' + curr[index].val.amount + '€';
      td5.appendChild(span5);
      
			db.child('/patients/' + curr[index].pid).once("value", psnap => {
				document.getElementById("span2_" + psnap.key).innerHTML = (psnap.val().name !== "" ? psnap.val().name : ('Patient #' + psnap.key))
				document.getElementById("span3_" + psnap.key).innerHTML = String(((1.0 * psnap.val().sum / psnap.val().total) * 100).toFixed(2)) + '%';
				document.getElementById("span4_" + psnap.key).innerHTML = '-' + (psnap.val().total - psnap.val().sum).toFixed(2) + '€';
			}, err => {
				console.log("Err: " + err);
			});
			
      // And complete the row and the table
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      table.appendChild(tr);
      
      // And add the listener
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

        /* Build layout:
          <table class="driver__table">
            <tbody>
              <tr>
                <td><small>Missing</small></td>
                <td style="color: red;">${driverTeam}</td>
              </tr>
            </tbody>
            <div class="donate">
              <button class="btn" style="background-color: #74d5dd;" id=${'view_' + currId}>View</button>&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn" id=${'donate_' + currId}>Donate</button>
            </div>
          </table>
        */
        
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
    }
  }, function (err) {
    console.log("Error: " + err.code);
  });
});
