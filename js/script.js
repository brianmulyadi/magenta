document.addEventListener('DOMContentLoaded', function() {
	var timestamp = document.getElementById('timestamp');

	var latestUpdate = document.createElement('span');
	latestUpdate.innerText = moment().format('ll');
	timestamp.appendChild(latestUpdate);

	initApp();

	signOut = function() {
        firebase.auth().signOut().then(function() {
        // Sign-out successful.
        }, function(error) {
        // An error happened.
        });
        window.location="/";
  };

  signIn = function() {
  	window.location = "pages/login.html";
  };

});

// Initialize Firebase
var config = {
apiKey: "AIzaSyDxXKznSNweSi8tf0jemkkK_nRyeDL_eOU",
authDomain: "lady-delivery.firebaseapp.com",
databaseURL: "https://lady-delivery.firebaseio.com",
storageBucket: "gs://lady-delivery.appspot.com",
};

// Firebase UI config
var uiConfig = {
  'queryParameterForWidgetMode': 'mode',
  // Query parameter name for sign in success url.
  'queryParameterForSignInSuccessUrl': 'signInSuccessUrl',
  'signInSuccessUrl': 'http://localhost:8888/pages/logged-in.html',
  'signInOptions': [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  // 'tosUrl': '<your-tos-url>',
};

// Get the Firebase app and all primitives we'll use

var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();

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
	      document.getElementById('loginButton').textContent = 'Sign out';
	      document.getElementById('loginButton').addEventListener("click", signOut);

	      var navBar = document.getElementById('navBar');
	      var li = document.createElement('li');
	      var a = document.createElement('a');
	      a.innerText = 'dashboard';
	      a.className = 'navbar-link';
	      a.href = '#dashboard';
	      li.className = 'navbar-item';
	      li.appendChild(a);
	      navBar.appendChild(li);

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
	    document.getElementById('loginButton').textContent = 'Sign in';
	    document.getElementById('loginButton').addEventListener("click", signIn);
	    // document.getElementById('quickstart-account-details').textContent = 'null';
	  }
	}, function(error) {
	  console.log(error);
	});
};

// create our angular module and inject firebase
var angularApp = angular.module('ladyDeliveryApp', ['firebase', 'ngRoute']);

/*
angularApp.factory("Auth", function($firebaseAuth) {
	var authRef = firebase.database().ref();
	return $firebaseAuth(authRef);
});
*/

angularApp.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

angularApp.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/");
    }
  });
}]);

// configure our routes
angularApp.config(function($routeProvider) {
	$routeProvider

		.when('/', {
			templateUrl : 'pages/welcome.html',
			controller: 'mainController'
		})

		.when('/dashboard', {
			templateUrl : 'pages/dashboard.html',
			controller: 'dashController',
			/*resolve: {
				currentAuth: ["$firebaseAuth", function($firebaseAuth) {
					var authRef = firebase.database().ref();
					var authObj = $firebaseAuth();
					
					return authObj.$waitForSignIn();
				}]
			}*/
			resolve: {
		      // controller will not be loaded until $requireSignIn resolves
		      // Auth refers to our $firebaseAuth wrapper in the example above
		      "currentAuth": ["Auth", function(Auth) {
	        // $requireSignIn returns a promise so the resolve waits for it to complete
	        // If the promise is rejected, it will throw a $stateChangeError (see above)
	        return Auth.$requireSignIn();
		      }]
		    }
		})

		.when('/order-form', {
			templateUrl : 'pages/order.html',
			controller: 'orderController',
			/* resolve: {
				lazy: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ladyDeliveryApp',
                        files: ['js/addOrder.js']
                    }]);
                }]
			} */
		});
});

// create our main controller and get access to firebase
angularApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Hi there! Thank you for using LadyJek Delivery';
});


angularApp.controller("dashController", function($scope, $firebaseObject){

	// connect to Firebase
	// var ref = firebase.database().ref();
	// $scope.data = $firebaseObject(ref);

	var ref = firebase.database().ref().child('order');

	// sync as object
	var syncObject = $firebaseObject(ref);

	// three way data binding
	syncObject.$bindTo($scope, 'order');

});

angular.module('ladyDeliveryApp').controller('orderController', function($scope) {
    // create a message to display in our view
    // $ocLazyLoad.load('js/addOrder.js');
    var loadScript = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'js/addOrder.js';
        document.body.appendChild(script);
    }

    $scope.$on('$viewContentLoaded', function () {
        loadScript();
    });
});

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