// Firebase config

var config = {
  'authDomain': 'lady-delivery.firebaseapp.com',
  'apiKey': 'AIzaSyDxXKznSNweSi8tf0jemkkK_nRyeDL_eOU',
};

// FirebaseUI config.
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

// Initialize the FirebaseUI Widget using Firebase.
var app = firebase.initializeApp(config);
var auth = app.auth();
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

      window.onload = function() {
        initApp()

        signOut = function() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }, function(error) {
  // An error happened.
  });
};

var outButton = document.getElementById('sign-out');
outButton.addEventListener("click", signOut);
      };
