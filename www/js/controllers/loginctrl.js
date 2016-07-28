angular.module('ccrs.controllers.loginctrl', [])
  .controller('LoginCtrl', function($http, $scope, $state, Localstorage, $templateCache, $ionicPopup, $ionicLoading, $rootScope) {
    $scope.user = {};

    if (Localstorage.getObject('token') && Localstorage.get("username") && Localstorage.get("password")) {
      $state.go('tab.courses');
    }

    var getAccountInfo = function() {
      $ionicLoading.show({
        template: 'Initializing your profile'
      });
      $http.get($rootScope.CCRS_URL + 'registered_id.php?user=' + Localstorage.get('CCRSID'))
        .then(function(response) {
          Localstorage.setObject('user_courses', response.data);
          console.log("User Courses Successfully Set in Localstorage");
          $ionicLoading.hide();
          $state.go('tab.dash');
        }, function(response) {
          $ionicLoading.hide();
          console.log(response);
        });
    };

    var getCCRSID = function() {
      $http.get($rootScope.CCRS_URL + 'ccrs_id.php?user=' + Localstorage.getObject('token').userid)
        .then(function(response) {
          $ionicLoading.hide();
          console.log('CCRS ID: ' + response.data['idnumber']);
          Localstorage.set('CCRSID', response.data['idnumber']);
          getAccountInfo();
        }, function(response) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Login Error',
            template: 'Unexpected login server error. Please try again soon.'
          });
          console.log(response);
        });
    };

    $scope.login = function () {
      var token_url = "https://learndev.vch.ca/m2/local/take5service/logging_in.php";
      $ionicLoading.show({
        template: 'Signing in'
      });
      $http({
        method: "POST",
        url: token_url,
        data: {
          'username': $scope.user.username,
          'password': $scope.user.password,
          'service': 'take5service'
        },
        cache: $templateCache
      })
        .then(function(result) {
          Localstorage.setObject('token', result.data);
          Localstorage.set('username', $scope.user.username);
          Localstorage.set('password', $scope.user.password);

          var token = Localstorage.getObject('token').token;
          var userId = Localstorage.getObject('token').userid;

          if (typeof token !== "undefined" && typeof userId !== "undefined") {
            getCCRSID();
            console.log("Moodle ID: " + userId);
          }
          // failed login
          else {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Login Error',
              template: 'Your username or password is incorrect. Please re-enter.'
            });
          }
        });
    };
  });
