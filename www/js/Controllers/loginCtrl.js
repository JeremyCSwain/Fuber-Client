"use strict";


app.controller('loginCtrl', function($scope, $http, $location, $ionicLoading, $ionicPlatform, $timeout, $ionicModal, ionicMaterialMotion,authFactory, firebaseURL) {
  
  let ref = new Firebase(firebaseURL);

  $ionicPlatform.ready(function() {

  	$scope.account = {
  		email: "",
  		password: ""
  	};

  	$scope.newUser = {
  		username: "",
  		truck_name: "",
  		cuisine: "",
  		contact_info: "",
  		website_url: "",
  		twitter_handle: "",
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
					authFactory.storeUser(userData.uid, $scope.account, $scope.newUser);
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

		// User modal partial for new account registration
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

    // Ionic Material Ripple Effect
    var reset = function() {
      var inClass = document.querySelectorAll('.in');
      for (var i = 0; i < inClass.length; i++) {
        inClass[i].classList.remove('in');
        inClass[i].removeAttribute('style');
      }

      var done = document.querySelectorAll('.done');
      for (var i = 0; i < done.length; i++) {
        done[i].classList.remove('done');
        done[i].removeAttribute('style');
      }
      
      var ionList = $('#ripple-list').children();
      for (var i = 0; i < ionList.length; i++) {
        var toRemove = ionList[i].className;
        if (/animate-/.test(toRemove)) {
          ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
        }
      }
    };

    $scope.ripple = function() {
      reset();
      document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
      setTimeout(function() {
        ionicMaterialMotion.ripple();
      }, 500);
    };

  // End ionicPlatform.ready()
  });

// End app.controller
});

















