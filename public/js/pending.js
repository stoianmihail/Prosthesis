document.addEventListener('DOMContentLoaded', (event) => {
  var table = document.getElementById("orders");
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
	db.child('queue').on('value', snap => {
		console.log("!!!!! test: ");
		console.log(snap.val());
		
		var curr = []
    snap.forEach(order => {
      curr.push({oid : order.key, val : order.val()});
    });
		
		console.log(curr);
		
		table.innerHTML = `<tr><th>#</th><th>Name</th><th>Estimated Cost</th></tr>`;
		for (var index = 0; index !== curr.length; ++index) {
      console.log("Put now: " + curr[index].oid);
      console.log(curr[index].val);
			
      // The image
      var tr = document.createElement("tr");
      tr.setAttribute("id", "tr_" + curr[index].oid);
      tr.setAttribute("data-id", curr[index].oid);
      tr.className = "list__row";
      
      // The index
      var td1 = document.createElement("td");
      td1.className = "list__cell"
      var span1 = document.createElement("span");
      span1.setAttribute("id", "span1_" + curr[index].oid);
      span1.innerHTML = String(index + 1);
      span1.className = "list__value black";
      td1.appendChild(span1);
        
      // The name
      var td2 = document.createElement("td");
      td2.className = "list__cell"
      var span2 = document.createElement("span");
      span2.setAttribute("id", "span2_" + curr[index].oid);
      span2.className = "list__value";
			span2.innerHTML = curr[index].val.name;
      td2.appendChild(span2);
			
			// The estimated cost
      var td3 = document.createElement("td");
      td3.className = "list__cell"
      var span3 = document.createElement("span");
      span3.setAttribute("id", "span3_" + curr[index].pid);
      span3.className = "list__value green";
      span3.innerHTML = '+' + parseInt(curr[index].val.cost) + '$';
			td3.appendChild(span3);
			
      // And complete the row and the table
      tr.appendChild(td1);
      tr.appendChild(td2);
			tr.appendChild(td3);
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
        const driverTeam = this.querySelector(".list__cell:nth-of-type(3) .list__value").innerHTML;
        const driverPoints = this.querySelector(".list__cell:nth-of-type(3) .list__value").innerHTML;
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
                <td><small>Cost</small></td>
                <td style="color: green;">${driverTeam}</td>
              </tr>
            </tbody>
            <div class="donate">
              <button class="btn" style="background-color: #74d5dd;" id=${'view_' + currId}>View</button>&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn" id=${'donate_' + currId}>Donate</button>
            </div>
            <img src="pic_trulli.jpg" alt="Italian Trulli">
          </table>
        */
        
        const driverInfo = document.createElement('div');
        var tmpTable = document.createElement("table");
        tmpTable.className = 'driver__table';
        var tbody = document.createElement("tbody");
        var tr = document.createElement("tr");
        
        var td1 = document.createElement("td");
        var small = document.createElement("small");
        small.innerHTML = `Estimated Cost`;
        td1.appendChild(small);
        
        var td2 = document.createElement("td");
        td2.style.color = "green";
        td2.innerHTML = driverTeam;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
        
        var donateDiv = document.createElement("div");
        donateDiv.className = 'donate';
        
        var acceptButton = document.createElement("btn");
        acceptButton.setAttribute("data-id", currId);
        acceptButton.className = 'btn';
        acceptButton.style.backgroundColor = '#299617';
        acceptButton.innerHTML = `Accept Order`;
        donateDiv.appendChild(acceptButton);
				
				var currImg = document.createElement("img");
				currImg.src = 'images/profile.jpg';
				donateDiv.appendChild(currImg);
				
        tmpTable.appendChild(tbody);
        tmpTable.appendChild(donateDiv);
				driverInfo.appendChild(tmpTable);
        
        // And add the listener
        acceptButton.onclick = function(e) {
          e.preventDefault();
					
					// Fetch the order id
					let orderId = this.dataset.id;
					console.log(orderId);
	
					// And create a new case
					db.child('queue/' + orderId).once('value', snap => {
						// Update the patients
						db.child('patients/').once('value', patSnap => {
							let newId = 0;
							if (patSnap.exists())
								newId = patSnap.val().length;
							db.child('patients/' + newId).set({
								name: snap.val().name,
								coordinates: snap.val().coordinates,
								img: snap.val().file,
								sum: 0,
								total: snap.val().cost
							});
							
							// Update the cluster of the facility
							let facility = snap.val().facility;
							db.child('facilities/' + facility + '/cluster').once('value', facSnap => {
								console.log(facSnap.val());
								let tmp = 0;
								if (facSnap.exists())
									tmp = facSnap.val();
								tmp.push(newId);
								db.child('facilities/' + facility).update({
									cluster: tmp
								});
							}, err => {
								console.log('Error: ' + err);
							});
						}, err => {
							console.log('Error: ' + err);
						});
					}, err => {
						console.log('Error: ' + err);
					});
					
					// And remove the order
					//db.child('queue/' + orderId).remove();
					
					// Close the sidebar
          //sidebarClose();
        }
        
        driverContent.appendChild(driverInfo);
        newDriver.appendChild(driverContent);
        sidebarBody.appendChild(newDriver);
      }
    }
	}, err => {
		console.log('Error: ' + err);
	});
});
