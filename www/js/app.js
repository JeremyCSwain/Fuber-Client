"use strict";


let app = angular.module('Fuber', ['ionic', 'ionic-material', 'ngCordova','ngRoute', 'firebase']).constant("firebaseURL", "https://fuber-auth.firebaseio.com/");


// Creates a promise for each view that requires user authentication before resolving.
let isAuth = (authFactory) => new Promise(function (resolve, reject) {
  if (authFactory.isAuthenticated()) {
    console.log("User is authenticated, resolve route promise.");
    resolve();
  } else {
    console.log("User is not authenticated, reject route promise.");
    reject();
  }
});

// Routings for partials and their controllers for user views.
app.config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.
      when("/login", {
        templateUrl: "partials/login.html",
        controller: "loginCtrl"
      }).
      when("/truck-main", {
        templateUrl: "partials/truck_map_view.html",
        controller: "truckMapCtrl",
        resolve: {isAuth}
      }).
      when("/user-main", {
        templateUrl: "partials/user_map_view.html",
        controller: "userMapCtrl",
        resolve: {isAuth}
      }).
      otherwise({
        redirectTo: "/login"
      });
  }
]);

// When the application runs...
app.run(function($ionicPlatform, $location, firebaseURL) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  // If a change in authorization happens, redirect to login
  let appRef = new Firebase(firebaseURL);

  // If user is unauthenticated, reroute to login page.
  appRef.onAuth(authData => {
    if (!authData) {
      console.log("Unauthenticated user.");
      $location.path("/login");
    }
  });
});
 











