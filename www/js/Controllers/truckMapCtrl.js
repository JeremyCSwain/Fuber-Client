"use strict";


app.controller('truckMapCtrl', function($scope, $http, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {
     
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
    // .then(
    //   function () {
    //     $http.post(
    //       `http://localhost:3000/api/truck_loc/`,
    //       JSON.stringify({
    //         lat: lat,
    //         long: long
    //       })
    //     )
    //   }
    // )
  })               
});