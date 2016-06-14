document.addEventListener('DOMContentLoaded', function() {
	var timestamp = document.getElementById('timestamp');

	var latestUpdate = document.createElement('span');
	latestUpdate.innerText = moment().format('ll');
	timestamp.appendChild(latestUpdate);

	/*initApp();
	signOut = function() {
        firebase.auth().signOut().then(function() {
        // Sign-out successful.
        }, function(error) {
        // An error happened.
        });
    };
    var outButton = document.getElementById('sign-out');
    outButton.addEventListener("click", signOut);*/
});

// Initialize Firebase
var config = {
apiKey: "AIzaSyDxXKznSNweSi8tf0jemkkK_nRyeDL_eOU",
authDomain: "lady-delivery.firebaseapp.com",
databaseURL: "https://lady-delivery.firebaseio.com",
storageBucket: "gs://lady-delivery.appspot.com",
};

/* Firebase UI config
var uiConfig = {
  'queryParameterForWidgetMode': 'mode',
  // Query parameter name for sign in success url.
  'queryParameterForSignInSuccessUrl': 'signInSuccessUrl',
  'signInSuccessUrl': 'http://localhost:8888/logged-in.html',
  'signInOptions': [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  'tosUrl': '<your-tos-url>',
};
*/
// Get the Firebase app and all primitives we'll use

var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();
/*
//Firebase UI auth
var ui = new firebaseui.auth.AuthUI(auth);
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

initApp = function() {
	auth.onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    var displayName = user.displayName;
	    var email = user.email;
	    var emailVerified = user.emailVerified;
	    var photoURL = user.photoURL;
	    var uid = user.uid;
	    var providerData = user.providerData;
	    user.getToken().then(function(accessToken) {
	      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
	      document.getElementById('quickstart-sign-in').textContent = 'Sign out';
	      document.getElementById('quickstart-account-details').textContent = JSON.stringify({
	        displayName: displayName,
	        email: email,
	        emailVerified: emailVerified,
	        photoURL: photoURL,
	        uid: uid,
	        accessToken: accessToken,
	        providerData: providerData
	      }, null, '  ');
	    });
	  } else {
	    // User is signed out.
	    document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
	    document.getElementById('quickstart-sign-in').textContent = 'Sign in';
	    document.getElementById('quickstart-account-details').textContent = 'null';
	  }
	}, function(error) {
	  console.log(error);
	});
};
*/
// create our angular module and inject firebase
var angularApp = angular.module('ladyDeliveryApp', ['firebase']);

// create our main controller and get access to firebase

angularApp.controller("mainController", ["$scope", "$firebaseAuth", function($scope, $firebaseObject, $firebaseAuth){

	// connect to Firebase
	// var ref = firebase.database().ref();
	// $scope.data = $firebaseObject(ref);

	var ref = firebase.database().ref().child('order');
	var authObj = $firebaseAuth();

	// sync as object
	var syncObject = $firebaseObject(ref);

	// three way data binding
	syncObject.$bindTo($scope, 'order');

	// auth
	$scope.login = function() {

	}
	$scope.authObj.$authWithPassword ({
		email: "foo",
		password: "bar"
	}).then(function(authData) {
		// user authenticated
	}).catch(function(error) {
		// authentication error
	});

	$scope.authObj.$onAuth(function(authData) {
		if(authData) {
			// user logged in
		} else {
			// user logged out
		}
	});

	$scope.authObj.ref.$createUser({
		email: 'foo',
		password: 'bar'
	}).then(function(userData) {
		// user created
	}).catch(function(error) {
		// error creating user
	});

}]);

angularApp.config(function($routeProvider) {
	$routeProvider
		.when('/test', {
			controller: 'testCtrl',
			templateUrl: 'pages/test.html',
			resolve: {
				currentAuth: function(Auth) {
					return Auth.$waitForAuth();
				}
			}
		})
})

/* LOGIN

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in
	} else {
		// No user is signed in
	}
});

var user = firebase.auth().currentUser;
var name, email, uid;

if (user != null) {
	name = user.displayName;
	email = user.email;
	uid = user.uid;
}

var newPassword

*/

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