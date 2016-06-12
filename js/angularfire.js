document.addEventListener('DOMContentLoaded', function() {
	var timestamp = document.getElementById('timestamp');

	var latestUpdate = document.createElement('span');
	latestUpdate.innerText = moment().format('ll');
	timestamp.appendChild(latestUpdate);
});

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


// create our angular module and inject firebase
var angularApp = angular.module('ladyDeliveryApp', ['firebase']);

// create our main controller and get access to firebase

angularApp.controller("mainController", function($scope, $firebaseObject){

	// connect to Firebase
	// var ref = firebase.database().ref();
	// $scope.data = $firebaseObject(ref);

	var ref = firebase.database().ref().child('order');

	// sync as object
	var syncObject = $firebaseObject(ref);

	// three way data binding
	syncObject.$bindTo($scope, 'order');

});

/* "order": {
      "$singleOrder": {
        ".write": "newData.child('client_id').val() == 'EawDasGgVcMWh4s4GCeiItmIVtU2'"
      }
    }
*/

/*
var databaseRef = database.ref().child('order');

databaseRef.on('child_added', function(snapshot) {
		var order_id_snap = snapshot.val();
		addOrderId(order_id_snap);
});

function addOrderId(order_id_snap) {
	var order_td = document.createElement('td');
	order_td.innerText = order_id_snap
}*/