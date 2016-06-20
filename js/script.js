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
  'signInSuccessUrl': 'http://localhost:8888',
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
	    var nameArray = displayName.split(' ');
	    var firstName = nameArray[0];
	    var email = user.email;
	    var emailVerified = user.emailVerified;
	    var photoURL = user.photoURL;
	    var uid = user.uid;
	    var providerData = user.providerData;
	    user.getToken().then(function(accessToken) {
	      document.getElementById('quickstart-sign-in-status').textContent = 'Welcome, ' + firstName;
	      document.getElementById('loginButton').textContent = 'Sign out';
	      document.getElementById('loginButton').addEventListener("click", signOut);

	      var navBar = document.getElementById('navBar');
	      var li = document.createElement('li');
	      var a = document.createElement('a');
	      a.innerText = 'dashboard';
	      a.className = 'navbar-link';
	      a.href = '#dashboard';
	      var b = document.createElement('a');
	      b.innerText = 'update';
	      b.className = 'navbar-link';
	      b.href = '#update';
	      var c = document.createElement('a');
	      c.innerText = 'cancel';
	      c.className = 'navbar-link';
	      c.href = '#delete';
	      li.className = 'navbar-item';
	      li.appendChild(a);
	      li.appendChild(b);
	      li.appendChild(c);
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
	    document.getElementById('quickstart-sign-in-status').textContent = 'Sign in to access your dashboard';
	    document.getElementById('loginButton').textContent = 'Sign in';
	    document.getElementById('loginButton').addEventListener("click", signIn);
	    // document.getElementById('quickstart-account-details').textContent = 'null';
	  }
	}, function(error) {
	  console.log(error);
	});
};

// create our angular module and inject firebase
var angularApp = angular.module('ladyDeliveryApp', ['firebase', 'ngRoute', 'ngAnimate']);

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

		.when('/update', {
			templateUrl : 'pages/update.html',
			controller: 'updateController',
			resolve: {
		      "currentAuth": ["Auth", function(Auth) {
	        return Auth.$requireSignIn();
		      }]
		    }
		})

		.when('/delete', {
			templateUrl : 'pages/delete.html',
			controller: 'deleteController',
			resolve: {
		      "currentAuth": ["Auth", function(Auth) {
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


angularApp.controller("dashController", function($scope, $firebaseObject, $timeout, $http){

	// connect to Firebase
	// var ref = firebase.database().ref();
	// $scope.data = $firebaseObject(ref);

	var user = firebase.auth().currentUser;
	var name, email, uid, orderTimeId;
	var auth = app.auth();

  var accessTokenGot;

  getAccessToken = function() {
      auth.onAuthStateChanged(function(user) {
          if (user) {
              user.getToken().then(function(accessToken) {
                  console.log('Access Token: ' + accessToken);
                  accessTokenGot = accessToken;
              });
          } else {
              console.log('User is not signed in');
          }
          }, function(error) {
              console.log(error);
      });
  };

  getAccessToken();
  // console.log(accessTokenGot);

	if (user != null) {
	  name = user.displayName;
	  email = user.email;
	  uid = user.uid;

	  console.log(name);
	  console.log(email);
	  console.log(uid);

	  var ref = firebase.database().ref().child(uid).child('order');

	  // sync as object
		var syncObject = $firebaseObject(ref);

		// three way data binding
		syncObject.$bindTo($scope, 'order');

		/*
		$scope.tasks = [];
 
	  $scope.init = function () {
	    $scope.loading = true;

	    // sync as object
			var syncObject = $firebaseObject(ref);

			// three way data binding
			syncObject.$bindTo($scope, 'order');
		  $scope.$broadcast('dataloaded');

	  };
	 
		$scope.init();

		$scope.$on('dataloaded', function () {
			$timeout(function () { 
          $("#nomanoma").text("BRAHBRAH");
        }, 0, false);
		});
		*/

	  ref.on('child_changed', function(snapshot) {		
			var orderTimeId = snapshot.key;
			console.log(orderTimeId);

			// timestamp on value change
			var pickedRef = firebase.database().ref().child(uid).child('order/'+orderTimeId+'/status/picked/active');
			pickedRef.once('value', function(snapshot) {
				console.log(snapshot.val());
				if (snapshot.val() == true) {
					var formatTime = function(time) {
				    var hours = time.getHours();
				    var minutes = time.getMinutes();

				    if (hours < 10)
				        hours = '0' + hours;

				    if (minutes < 10)
				        minutes = '0' + minutes;

				    return hours + ":" + minutes;
					}

					var $pickedTime = new Date();
				  var $formatTime = formatTime($pickedTime);

				  var newTime = {
				  	"time": $formatTime
				  };

					$.ajax({
		        type: 'PATCH',
		        url: 'https://lady-delivery.firebaseio.com/'+uid+'/order/'+orderTimeId+'/status/picked.json?auth='+accessTokenGot,
		        contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(newTime),
		        success: function(data) {
		            console.log("Time updated!", data);
		            console.log(uid);
		        },
		        error: function (jqXHR) {
		            if (jqXHR.status == 401) {
		                alert("401: Authentication Error!");
		            } else if (jqXHR.status == 400) {
		                alert("400: Invalid data format in input");
		            };
		        }
				  });
				} else if (snapshot.val() == false) {

				var resetTime = {
			  	"time": ""
			  };

					$.ajax({
			        type: 'PATCH',
			        url: 'https://lady-delivery.firebaseio.com/'+uid+'/order/'+orderTimeId+'/status/picked.json?auth='+accessTokenGot,
			        contentType: "application/json; charset=utf-8",
			        data: JSON.stringify(resetTime),
			        success: function(data) {
			            console.log("Time reset!", data);
			            console.log(uid);
			        },
			        error: function (jqXHR) {
			            if (jqXHR.status == 401) {
			                alert("401: Authentication Error!");
			            } else if (jqXHR.status == 400) {
			                alert("400: Invalid data format in input");
			            };
			        }
			    });
				}
			});

			// timestamp on value change
			var deliveredRef = firebase.database().ref().child(uid).child('order/'+orderTimeId+'/status/delivered/active');
			deliveredRef.once('value', function(snapshot) {
				console.log(snapshot.val());
				if (snapshot.val() == true) {
					var formatTime = function(time) {
				    var hours = time.getHours();
				    var minutes = time.getMinutes();

				    if (hours < 10)
				        hours = '0' + hours;

				    if (minutes < 10)
				        minutes = '0' + minutes;

				    return hours + ":" + minutes;
					}

					var $deliveredTime = new Date();
			  	var $formatTime = formatTime($deliveredTime);

				  var newTime = {
				  	"time": $formatTime
				  };

					$.ajax({
		        type: 'PATCH',
		        url: 'https://lady-delivery.firebaseio.com/'+uid+'/order/'+orderTimeId+'/status/delivered.json?auth='+accessTokenGot,
		        contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(newTime),
		        success: function(data) {
		            console.log("Time updated!", data);
		            console.log(uid);
		        },
		        error: function (jqXHR) {
		            if (jqXHR.status == 401) {
		                alert("401: Authentication Error!");
		            } else if (jqXHR.status == 400) {
		                alert("400: Invalid data format in input");
		            };
		        }
				  });
				} else if (snapshot.val() == false) {

					var resetTime = {
				  	"time": ""
				  };

					$.ajax({
		        type: 'PATCH',
		        url: 'https://lady-delivery.firebaseio.com/'+uid+'/order/'+orderTimeId+'/status/delivered.json?auth='+accessTokenGot,
		        contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(resetTime),
		        success: function(data) {
		            console.log("Time reset!", data);
		            console.log(uid);
		        },
		        error: function (jqXHR) {
		            if (jqXHR.status == 401) {
		                alert("401: Authentication Error!");
		            } else if (jqXHR.status == 400) {
		                alert("400: Invalid data format in input");
		            };
		        }
			    });
				}
			});

		});

		$timeout(function() {

			var page = 1;
			var itemAmount = 10;
			var orderLength = $("#orderList > tr").length;
			console.log("ORDER LENGTH: " + orderLength);

			if (orderLength > itemAmount) {

				var orderLengthMinus = orderLength - itemAmount;

				$("#orderList > tr").slice(itemAmount,orderLength).hide();

				for ( i = 0 ; i < orderLengthMinus; i += itemAmount) {
					
				  var j = i + itemAmount;
				  var pageNumber = (i/itemAmount)+1;
				  var num = pageNumber.toString();
				  var pageClass = "page"+num;
				  $("#orderList > tr").slice(i,j).addClass(pageClass);

				};

				var x = orderLength / itemAmount; 
				var y = Math.floor(x);
				var z = y  * itemAmount;

				var q = y + 1;
				var num = q.toString();
				var pageClass = "page"+num;

				$("#orderList > tr").slice(z,orderLength).addClass(pageClass).hide();

				var maxPage = q;

				$(".currentPage").text(pageNumber);
				$(".totalPage").text(q);

				$('.next').on('click',function(){
	    		if(page < maxPage) {
		    		$("#orderList > tr:visible").hide();
	        	$('.page' + ++page).show();
	        	pageNumber += 1;
	        	$(".currentPage").text(pageNumber);
				  }
				});

				$('.prev').on('click',function(){
				  if(page > 1) {
				    $("#orderList > tr:visible").hide();
			      $('.page' + --page).show();
			      pageNumber -= 1;
	        	$(".currentPage").text(pageNumber);
				  }
				});

			} else {
				$(".currentPage").text('1');
				$(".totalPage").text('1');
			}

		}, 2000);

	};

	
	
});

angular.module('ladyDeliveryApp').controller('orderController', function($scope) {
    // create a message to display in our view
    // $ocLazyLoad.load('js/addOrder.js');

    map = new google.maps.Map(document.getElementById('map'), {
  	center: {lat: -6.223095, lng: 106.842674},
  	zoom: 11
		});

    var user = firebase.auth().currentUser;
		var name, email, photoUrl, uid;

		if (user != null) {
		  name = user.displayName;
		  email = user.email;
		  photoUrl = user.photoURL;
		  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
		                   // this value to authenticate with your backend server, if
		                   // you have one. Use User.getToken() instead.
		  console.log(name);
		  console.log(email);
		  console.log(photoUrl);
		  console.log(uid);
		}

    var formatTime = function(time) {
    var hours = time.getHours();
    var minutes = time.getMinutes();

    if (hours < 10)
        hours = '0' + hours;

    if (minutes < 10)
        minutes = '0' + minutes;

    return hours + ":" + minutes;
		}

		var formatDate = function(time) {
		    var day = time.getDate();
		    var month = time.getMonth() + 1;

		    if (day < 10)
		        day = '0' + day;

		    if (month < 10)
		        month = '0' + month;

		    return day + "/" + month;
		}

		$(document).ready(function(){
		    var auth = app.auth();

		    var accessTokenGot;

		    getAccessToken = function() {
		        auth.onAuthStateChanged(function(user) {
		            if (user) {
		                user.getToken().then(function(accessToken) {
		                    console.log('Access Token: ' + accessToken);
		                    accessTokenGot = accessToken;
		                });
		            } else {
		                console.log('User is not signed in');
		            }
		            }, function(error) {
		                console.log(error);
		        });
		    };

		    getAccessToken();

		    var $postedTime = new Date();
		    var $formatTime = formatTime($postedTime);
		    var $formatDate = formatDate($postedTime);



		    $('form #add-order').on('click', function(e) {
		    e.preventDefault();  

		    var $fromName = $('#fromName');
		    var $fromContactNo = $('#fromContactNo');
		    var $fromAddress = $('#fromAddress');
		    var $toName = $('#toName');
		    var $toContactNo = $('#toContactNo');
		    var $toAddress = $('#toAddress');
		    var $itemDesc = $('#itemDesc');
		    var $addOrder = $('#add-order');

		    var newOrder = {
		        "order_id": $.now(),
		        "date": $formatDate,
		        "from": {
		            "name": $fromName.val(),
		            "phone_no": $fromContactNo.val(),
		            "address": $fromAddress.val(),
		        },
		        "to": {
		            "name": $toName.val(),
		            "phone_no": $toContactNo.val(),
		            "address": $toAddress.val(),
		        },
		        "item": $itemDesc.val(),
		        "status": {
		            "posted": {
		                "active": true,
		                "time": $formatTime,
		            },
		            "picked": {
		                "active": false,
		                "time": "",
		            },
		            "delivered": {
		                "active": false,
		                "time": "",
		            },
		        },
		    };

		    $.ajax({
		        type: 'POST',
		        url: 'https://lady-delivery.firebaseio.com/'+uid+'/order.json?auth='+accessTokenGot,
		        contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(newOrder),
		        success: function(data) {
		            console.log("Order added!", data);
		            console.log(uid);
		            $("#order-status > p").text("Order added.");
		        },
		        error: function (jqXHR) {
		            if (jqXHR.status == 401) {
		                alert("401: Authentication Error!");
		            } else if (jqXHR.status == 400) {
		                alert("400: Invalid data format in input");
		            };
		        }
		    });

		    $.ajax({
		        type: 'POST',
		        url: 'https://hooks.zapier.com/hooks/catch/1402225/upcokh/',
		        contentType: "application/json; charset=utf-8",
		        data: JSON.stringify(newOrder),
		        success: function(data) {
		            console.log("Order added!", data);
		        },
		    });

		});

		// Calling Google Maps API

		
/*
		$.ajax({
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+$fromAddress+'&destinations='+$toAddress+'&key='+googleApiKey,
        success: function(data) {
            console.log("Quote received!", data);
            $("#quote-status > p").text("Quote received.");
        },
    });*/

		});
});

angular.module('ladyDeliveryApp').controller('updateController', function($scope) {
    // create a message to display in our view
    // $ocLazyLoad.load('js/addOrder.js');
    var loadScript = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'js/updateOrder.js';
        document.body.appendChild(script);
    }

    $scope.$on('$viewContentLoaded', function () {
        loadScript();
    });

});

angular.module('ladyDeliveryApp').controller('deleteController', function($scope) {

		var user = firebase.auth().currentUser;
		var name, email, photoUrl, uid;

		if (user != null) {
		  name = user.displayName;
		  email = user.email;
		  photoUrl = user.photoURL;
		  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
		                   // this value to authenticate with your backend server, if
		                   // you have one. Use User.getToken() instead.
		  console.log(name);
		  console.log(email);
		  console.log(photoUrl);
		  console.log(uid);
		}

    // create a message to display in our view
    // $ocLazyLoad.load('js/addOrder.js');
    /*var loadScript = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'js/deleteOrder.js';
        document.body.appendChild(script);
    }

    $scope.$on('$viewContentLoaded', function () {
        loadScript();
    });*/

    $(document).ready(function(){

    var auth = app.auth();

    var accessTokenGot;

    getAccessToken = function() {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                user.getToken().then(function(accessToken) {
                    console.log('Access Token: ' + accessToken);
                    accessTokenGot = accessToken;
                });
            } else {
                console.log('User is not signed in');
            }
            }, function(error) {
                console.log(error);
        });
    };

    getAccessToken();

    $('form').on('submit', function(e) {  

    var order_id = $('#order_id').val();
    console.log('order ID is: ' + order_id);
    var x;

    if (order_id == '') {
        alert('Cannot leave it blank!');
    } else {
        var databaseRef = database.ref().child(uid).child('order');
        databaseRef.once("value", function(snapshot) {
            var x = snapshot.child(order_id).exists();
            console.log('x is: ' + x);
            if (x == true) {
            if (confirm('Are you sure you want to delete the order?')) {
            $.ajax({
                type: 'DELETE',
                url: 'https://lady-delivery.firebaseio.com/'+uid+'/order/'+order_id+'.json?auth='+accessTokenGot,
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    console.log("Order deleted!", data);
                    $("#delete-status > p").text("Order deleted.");

                },
                error: function (jqXHR) {
                    if (jqXHR.status == 401) {
                        alert("401: Authentication Error!");
                    } else if (jqXHR.status == 400) {
                        alert("400: Invalid data format in input");
                    };
                }
            });

            $.ajax({
                type: 'POST',
                url: 'https://hooks.zapier.com/hooks/catch/1402225/upcokh/',
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    console.log("Order deleted!", data);
                },
            });

            $('#order_id').val("");
            }
        } else {
            $("#delete-status > p").text("Order not found.");
        }
        });
    }
});
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