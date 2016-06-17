"use strict";


app.controller('truckMapCtrl', function($scope, $http, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {
     
  $ionicPlatform.ready(function() {    

    let ref = new Firebase(firebaseURL);

    let currentUser = [];  

    authFactory.getUser().then(UserObj => {
      let authData = ref.getAuth();
      currentUser = authData;
      $scope.$apply();
      }
    );

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

    // Get user's current position lat, long
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = position.coords.latitude;
      long = position.coords.longitude;
      
      console.log("coords", lat, long);

      // Set user's coords
      var myLatLng = new google.maps.LatLng(lat, long);
       
      var mapOptions = {
        center: myLatLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };  
      
      // Open New Google Map
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      // Drop marker on user's location
      new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        map: map
      });

      let allCoords = [];

      // GET all truck locations
      $scope.getAllTrucks = function () {
        return new Promise(function (resolve, reject) {
          $http.get(`http://localhost:3000/api/truck_loc`)
          .success(
            allCoordsObj => resolve(allCoordsObj),
            error => reject(error)
          )
        })
      };

      // Invoke GET
      $scope.getAllTrucks().then(
        allCoordsObj => {
          allCoords = allCoordsObj;
          console.log("??", allCoords);
        }
      )
      .then(
        function () {
          for (var i = 0; i < allCoords.length; i++) {  
            new google.maps.Marker({
              position: new google.maps.LatLng(allCoords[i].lat, allCoords[i].long),
              map: map,
              icon: `img/truck_icon.png`
            });
          }
        }
      );

      $scope.map = map;   
      $ionicLoading.hide();  
   
    }, 

    function(err) {
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