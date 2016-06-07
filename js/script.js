document.addEventListener('DOMContentLoaded', function() {
	// Step 0: HTML defined, variables for elements
	var fromName = document.getElementById('fromName'),
	  fromContactNo = document.getElementById('fromContactNo'),
	  fromAddress = document.getElementById('fromAddress'),
	  toName = document.getElementById('toName'),
	  toContactNo = document.getElementById('toContactNo'),
	  toAddress = document.getElementById('toAddress'),
	  itemDesc = document.getElementById('itemDesc'),
	  orderId = document.getElementById('orderId'),
	  status = document.getElementById('status'),
	  orderList = document.getElementById('orderList'),
	  timestamp = document.getElementById('timestamp');

	var latestUpdate = document.createElement('span');
	latestUpdate.innerText = moment().format('ll');
	//timestamp.appendChild(latestUpdate);

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyDxXKznSNweSi8tf0jemkkK_nRyeDL_eOU",
    authDomain: "lady-delivery.firebaseapp.com",
    databaseURL: "https://lady-delivery.firebaseio.com",
    storageBucket: "gs://lady-delivery.appspot.com",
	};
  
	// Get the Firebase app and all primitives we'll use

	var app = firebase.initializeApp(config);
	var database = app.database();
	var auth = app.auth();
	var storage = app.storage();


	/* ANGULAR FIRE
	// create our angular module and inject firebase
	var angularApp = angular.module('ladyDeliveryApp', ['firebase']);

	// create our main controller and get access to firebase
	angularApp.controller("mainController", function($scope, $firebaseObject){

		// connect to Firebase
		var ref = firebase.database().ref();
		$scope.data = $firebaseObject(ref);

		var ref = firebase.database().ref().child('order');

		// sync as object
		var syncObject = $firebaseObject(ref);

		// three way data binding
		syncObject.$bindTo($scope, 'order');
	});
	*/
	// END OF ANGULAR FIRE

	// Get a reference to our chat "node" in the database
	var databaseRef = database.ref().child('order');

	function pullData(pushID) {
		var databaseRelRef = database.ref().child('order').child(pushID).child('status');
		console.log('motherfakin');
		var status = { posted: 0 };
		databaseRelRef.update(status);
	}

	// Handles when you click "Send" button

	/*
	sendButton.addEventListener('click', function(evt) {
		var chat = { name: username, message: textInput.value };
		// Push the chat message to the database
		databaseRef.push().set(chat);
		textInput.value = '';
	});
	*/

	// Listen for when child nodes get added to the collection
	databaseRef.on('child_added', function(snapshot) {
		var order = snapshot.val();
		console.log(order);
		orderAdded(order);
	});

	function orderAdded(order) {
	    var tr = document.createElement('tr');

	    	var orderElm = document.createElement('td');

	    		var dateElm = document.createElement('p');
			    dateElm.innerText = "Date: " + order.date;
			    orderElm.appendChild(dateElm);

			    var orderIdElm = document.createElement('p');
			    orderIdElm.innerText = order.order_id;
			    orderElm.appendChild(orderIdElm);

			  tr.appendChild(orderElm);

	      var fromElm = document.createElement('td');

		      var fromNameElm = document.createElement('p');
		      fromNameElm.innerText = order.from.name;
		      fromNameElm.className = 'strong';
		      fromElm.appendChild(fromNameElm);

		      var fromContactElm = document.createElement('p');
		      fromContactElm.innerText = order.from.phone_no;
		      fromElm.appendChild(fromContactElm);

		      var fromAddressElm = document.createElement('p');
		      fromAddressElm.innerText = order.from.address;
		      fromElm.appendChild(fromAddressElm);

		    tr.appendChild(fromElm);

		    var toElm = document.createElement('td');

		      var toNameElm = document.createElement('p');
		      toNameElm.innerText = order.to.name;
		      toNameElm.className = 'strong';
		      toElm.appendChild(toNameElm);

		      var toContactElm = document.createElement('p');
		      toContactElm.innerText = order.to.phone_no;
		      toElm.appendChild(toContactElm);

		      var toAddressElm = document.createElement('p');
		      toAddressElm.innerText = order.to.address;
		      toElm.appendChild(toAddressElm);

		    tr.appendChild(toElm);

		    var itemDescElm = document.createElement('td');
		    itemDescElm.innerText = order.item;
		    tr.appendChild(itemDescElm);

		    var statusElm = document.createElement('td');

		    	var postedElm = document.createElement('button');
		    	if (order.status.posted.active == true) {
		    		postedElm.className = 'button-primary status-button';
		    		postedElm.innerText = "Posted at " + order.status.posted.time;
		    	}
		    	else {
		    		postedElm.className = 'status-button';
		    		postedElm.innerText = "Posted";
		    	}
		    	postedElm.id = 'postedButton';
		      statusElm.appendChild(postedElm);

		      // postedElm.addEventListener('click', pullData('KJ9UIoLix9m_2DfZwLL'));

		      var pickedElm = document.createElement('button');
		      if (order.status.picked.active == true) {
		    		pickedElm.className = 'button-primary status-button';
		    		pickedElm.innerText = "Picked-Up at " + order.status.picked.time;
		    	}
		    	else {
		    		pickedElm.className = 'status-button';
		    		pickedElm.innerText = "Picked-Up";
		    	}
		    	pickedElm.id = "pickedButton";
		      statusElm.appendChild(pickedElm);

		      var deliveredElm = document.createElement('button');
		      if (order.status.delivered.active == true) {
		    		deliveredElm.className = 'button-primary status-button';
		    		deliveredElm.innerText = "Delivered at " + order.status.delivered.time;
		    	}
		    	else {
		    		deliveredElm.className = 'status-button';
		    		deliveredElm.innerText = "Delivered";
		    	}
		    	deliveredElm.id = "deliveredButton"
		      statusElm.appendChild(deliveredElm);

		    /*if (order.status.posted == true && order.status.picked == true && order.status.delivered == true) {
		    	statusElm.innerText = "Delivered";
		    } else if (order.status.posted == true && order.status.picked == true) {
		    	statusElm.innerText = "Picked Up";
		    } else {
		    	statusElm.innerText = "Order Posted";
		    }*/
		    tr.appendChild(statusElm);

	    orderList.appendChild(tr);
  	}

  	

});

/*var postedButton = document.getElementById('postedButton');
	if (postedButton) {
		postedButton.addEventListener('click', function(evt) {
		var status = { posted: False };
		// Push the chat message to the database
		databaseRef.child('status').set(status);
		});
	}*/