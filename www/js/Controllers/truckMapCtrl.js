"use strict";


app.controller('truckMapCtrl', function($scope, $http, $cordovaGeolocation, $ionicLoading, $ionicPlatform, firebaseURL, authFactory) {
     
  $ionicPlatform.ready(function() {    

    let ref = new Firebase(firebaseURL);

    let currentUser = {};
    let currentTruck = {};

    // If user isAuthorized, get users and set current user based on uid.
    authFactory.getUser().then(UserObj => {
      let authData = ref.getAuth();
      for (var i = 0; i < UserObj.length; i++) {
        if(UserObj[i].firebaseUID == authData.uid) {
          currentUser = UserObj[i];
          $scope.$apply();
        }
      }
      console.log("Current User:", currentUser);
    })
    .then(
    // Get current User's truck_user data for location update.
      function () {
        if (currentUser.is_truck) {
          authFactory.getTruck().then(TruckObj => {
            for (var i = 0; i < TruckObj.length; i++) {
              if(TruckObj[i].firebaseUID == currentUser.firebaseUID) {
                currentTruck = TruckObj[i];
                $scope.$apply();
              }
            }
          })
        }
      }
    );

    var lat;
    var long;

    // Preloader
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
    });
     
    var watchOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    // Constant watch of current user's current position lat, long
    var watch = $cordovaGeolocation.watchPosition(watchOptions);

    watch.then(
      null, 
      function (err) {
        console.log("Error Message:", err);
      },
      function (position) {
        lat  = position.coords.latitude;
        long = position.coords.longitude;
        
        console.log("Current Coords:", lat, long);

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
        var truckMarker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, long),
          map: map
        });

        truckMarker.setPosition(myLatLng);

        window.setInterval(
          function () {
            $http.put(
              `http://localhost:3000/api/truck_user/${currentTruck._id}`,
              JSON.stringify({
                lat: lat,
                long: long
              })
            )
          }, 5000
        );

        // If pulling in all truck locs, set empty array for coords.
        let allCoords = [];

        // // If the Truck user decides to see other trucks, toggle view on and refresh allTruckCoords
        // window.setInterval(
        //   function () {
        //     // GET all truck locations
        //     $scope.getAllTrucks = function () {
        //       return new Promise(function (resolve, reject) {
        //         $http.get(`http://localhost:3000/api/truck_user`)
        //         .success(
        //           allCoordsObj => resolve(allCoordsObj),
        //           error => reject(error)
        //         )
        //       })
        //     };

        //     // Invoke GET
        //     $scope.getAllTrucks().then(
        //       allCoordsObj => {
        //         allCoords = allCoordsObj;
        //         console.log("All Truck User Coords:", allCoords);
        //       }
        //     )
        //     .then(
        //       function () {
        //         for (var i = 0; i < allCoords.length; i++) {  
        //           new google.maps.Marker({
        //             position: new google.maps.LatLng(allCoords[i].lat, allCoords[i].long),
        //             map: map,
        //             icon: `img/truck_icon.png`
        //           });
        //         }
        //       }
        //     );
        //   }, 1000 
        // );

        $scope.map = map;   
        $ionicLoading.hide();     
      }, 
      function(err) {
        $ionicLoading.hide();
        console.log(err);
      }
    );
    
  // End ionicPlatform.ready
  });
// End dependency function
});























