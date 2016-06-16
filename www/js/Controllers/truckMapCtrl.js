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

      var myLatLng = new google.maps.LatLng(lat, long);
       
      var mapOptions = {
        center: myLatLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };  
       
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var allCoords = [
          {"lat":36.1325977,"long":-86.75663829999999},
          {"lat":36.1420921,"long":-86.7693982},
          {"lat":36.1392416,"long":-86.7633095},
          {"lat":36.1422776,"long":-86.764577},
          {"lat":36.1441931,"long":-86.7788615}
        ];

      function generateMarkers(locations) {
        for (var i = 0; i < allCoords.length; i++) {  
          new google.maps.Marker({
            position: new google.maps.LatLng(allCoords[i].lat, allCoords[i].long),
            map: map,
            icon: `img/truck_icon.png`
          });
          console.log("??", allCoords);
        }
      };
      generateMarkers(allCoords);

      // var marker = new google.maps.Marker({
      //   position: allCoords,
      //   map: map,
      //   icon: `img/truck_icon.png`
      // });        
       
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