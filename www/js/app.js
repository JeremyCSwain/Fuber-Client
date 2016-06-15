"use strict";


var app = angular.module('Fuber', ['ionic','ngCordova']);
 
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
 
app.controller('MapController', function($scope, $http, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {
     
  $ionicPlatform.ready(function() {    

    var lat;
    var long;

    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });
     
    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = position.coords.latitude;
      long = position.coords.longitude;
      
      console.log("coords", lat, long);
      var myLatlng = new google.maps.LatLng(lat, long);
       
      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };          
       
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
       
      $scope.map = map;   
      $ionicLoading.hide();  

         
    }, function(err) {
      $ionicLoading.hide();
      console.log(err);
    })
    .then(
      function () {
        $http.post(
          `http://localhost:3000/api/truck_loc/`,
          JSON.stringify({
            lat: lat,
            long: long
          })
        )
      }
    )
  })               
});