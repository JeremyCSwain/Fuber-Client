"use strict";


app.controller('userMapCtrl', function($scope, $http, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $timeout, $ionicModal, $ionicPopup, ionicMaterialInk, firebaseURL, authFactory) {
     
  $ionicPlatform.ready(function() {  

    // Ionic Material Ink
    ionicMaterialInk.displayEffect();

    var ref = new Firebase(firebaseURL);

    var currentUser = {};  

    // If user isAuthorized, get users and set current user based on uid.
    authFactory.getUser().then(function (UserObj) {
      var authData = ref.getAuth();
      for (var i = 0; i < UserObj.length; i++) {
        if(UserObj[i].firebaseUID == authData.uid) {
          currentUser = UserObj[i];
          $scope.$apply();
        }
      }
      console.log("Current User:", currentUser);
    });

    // Checks if current user is a food truck user or not
    $scope.isTruck = function () {
      if (currentUser.is_truck) {
        return true;
        $scope.$apply();
      } else {
        return false;
        $scope.$apply();
      }
    };

    var lat;
    var long;

    // Preloader
    $ionicLoading.show({
      template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div><br/>Acquiring location!'
    });
    
    // Google maps position option settings for map view.
    var posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    // Get user's current position lat, long
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = position.coords.latitude;
      long = position.coords.longitude;
      
      console.log("Current Coords:", lat, long);

      // Set user's coords
      var myLatLng = new google.maps.LatLng(lat, long);
       
      // Map settings
      var mapOptions = {
        center: myLatLng,
        zoom: 16,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };  
      
      // Open New Google Map
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      // Set empty array for all truck coords.
      var allTrucks = [];
      var infowindow = new google.maps.InfoWindow();
      var truckMarker = new google.maps.Marker();

      // Get all truck locs on page load.
      $scope.getAllTrucks = function () {
        return new Promise(function (resolve, reject) {
          $http.get(`http://localhost:3000/api/truck_user`)
          .success(
            function (allTrucksObj) {resolve(allTrucksObj)},
            function (error) {reject(error)}
          )
        })
      };
      // Invoke GET, if there are no active trucks, alert user
      $scope.getAllTrucks().then(
        function (allTrucksObj) {
          allTrucks = allTrucksObj;
          if (allTrucks.length == 0) {
            $ionicPopup.alert('There are no active trucks!');
          }
          console.log("All Truck Users:", allTrucks);
        }
      )
      // Add a marker for each truck at it's exact coords
      .then(
        function () {
          for (var i = 0; i < allTrucks.length; i++) { 
            truckMarker = new google.maps.Marker({
              position: new google.maps.LatLng(allTrucks[i].lat, allTrucks[i].long),
              map: map,
              icon: `img/truck_icon.png`
            });
            // Add new infowindow to each marker with individual truck data
            truckMarker.info = new google.maps.InfoWindow({
              position: new google.maps.LatLng(allTrucks[i].lat, allTrucks[i].long),
              content:
                `<div>
                  <p>${allTrucks[i].truck_name}</p>
                  <p>Style: ${allTrucks[i].cuisine}</p>
                  <p><a href="tel:+1-1${allTrucks[i].contact_info}">Place an Order</a></p>
                  <p><a href="${allTrucks[i].website_url}">More Info</a></p>
                  <button id="${allTrucks[i].twitter_handle}" class="button twitter-button">See Twitter Feed</button>
                </div>`
            });
            // Adds event listener to truck markers to open infowindows
            google.maps.event.addListener(truckMarker, 'click', function() {
              this.info.open(map, this);
            });    
          }
        }
      );
      // On map click, close infowindow
      google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
      });
      
      // Begin marker refresh of truck locs on setInterval
      window.setInterval(
        function () {
          // GET all truck locations
          $scope.getAllTrucks = function () {
            return new Promise(function (resolve, reject) {
              $http.get(`http://localhost:3000/api/truck_user`)
              .success(
                function (allTrucksObj) {resolve(allTrucksObj)},
                function (error) {reject(error)}
              )
            })
          };
          // Invoke GET
          $scope.getAllTrucks().then(
            function (allTrucksObj) {
              allTrucks = allTrucksObj;
              console.log("All Truck User Coords:", allTrucks);
            }
          )
          .then(
            function () {
              for (var i = 0; i < allTrucks.length; i++) {
                var currTruckCoord = new google.maps.LatLng(allTrucks[i].lat, allTrucks[i].long);
                truckMarker.setPosition(currTruckCoord);
              }
            }
          );
        }, 20000 
      );

      $scope.map = map;   
      $ionicLoading.hide();     
      }, 
      function(err) {
        $ionicLoading.hide();
        console.log(err);
      }
    );

    // User modal partial for twitter feed registration
    $ionicModal.fromTemplateUrl('../partials/twitter_modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // On click of truck's infowindow button, pass the truck's twitter handle to the api call function for twitter feed.
    $('#map').on('click', '.twitter-button', function (event) {
      $scope.modal.show();
      var twitterHandle = event.currentTarget.id;
      var twitterQuery = {
        q: twitterHandle
      };
      $scope.getTwitterFeed(twitterQuery).then(function (tweetsObj) {
        console.log("???", tweetsObj);
      });
      console.log("Current Truck Twitter Handle: ", twitterHandle);
    });


    // Accepts twitter handle of truck that is clicked and calls api with query.
    $scope.getTwitterFeed = function (twitterQuery) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: 'https://api.twitter.com/1.1/search/tweets.json?' + $.param(twitterQuery),
          dataType: 'jsonp',
          success: function(tweetsObj) {
            resolve(tweetsObj)
          }, function (error) {
            reject(error)
          }
        });
      });
    }

    // General openModal call to open modal
    $scope.openModal = function() {
      $scope.modal.show();
    };

    // Close modal
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

  // End ionicPlatform.ready
  });
// End dependency function
});





























