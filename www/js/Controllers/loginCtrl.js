"use strict";


app.controller('loginCtrl', function($scope, $http, $location, $ionicLoading, $ionicPlatform, $timeout, $ionicModal, authFactory, firebaseURL) {
  
  let ref = new Firebase(firebaseURL);

  $ionicPlatform.ready(function() {

  	$scope.account = {
  		email: "",
  		password: ""
  	};

  	$scope.user = {
  		username: "",
  		is_truck: false
  	};

		// Registers a new user and creates a new user_data object.
		$scope.register = function () {
			ref.createUser({
				// Set user with email and pw
				email: $scope.account.email,
				password: $scope.account.password
			}, function (error, userData) {
				if (error) {
					console.log(`Error creating user: ${error}`);
				} else {
					console.log(`Created user account with UID: ${userData.uid}`, userData);
					authFactory.storeUser(userData.uid, $scope.account, $scope.user);
					$scope.login();
				}
			});
		};

		// Authenticates and logs in a previously registered user.
		$scope.login = function () {
			authFactory.authenticate($scope.account)
				.then(function () {
					$location.path("/user-main");
					$scope.$apply();
				})
		};

		$ionicModal.fromTemplateUrl('../partials/modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
	    $scope.modal.hide();
	  };

    // Cleanup the modal when we're done with it
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

  // End ionicPlatform.ready()
  });

// End app.controller
});

















