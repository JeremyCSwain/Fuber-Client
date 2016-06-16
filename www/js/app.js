"use strict";


let app = angular.module('Fuber', ['ionic','ngCordova','ngRoute', 'firebase']).constant("firebaseURL", "https://fuber-auth.firebaseio.com/");

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
        controller: "truckMapCtrl"
      }).
      otherwise({
        redirectTo: "/login"
      });
  }
]);


app.run(function($ionicPlatform) {
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
});
 











