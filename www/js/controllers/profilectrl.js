angular.module('ccrs.controllers.profilectrl', [])
  .controller('ProfileCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope, $filter) {
    var course_url = $rootScope.CCRS_URL + "profile.php";
    $scope.data = {};

    $ionicLoading.show({
      template: 'Loading Profile'
    });
    $http.get(course_url + "?id=" + Localstorage.get('CCRSID'))
      .then(function(response) {
        $scope.data = response.data;
        $ionicLoading.hide();
        $state.go($state.current, {}, {reload: false});
      }, function(response) {
        console.log(response);
        $ionicLoading.hide();
      });
    $scope.username = Localstorage.get("username");
    $scope.password = "";
    for (var i = 0; i < Localstorage.get("password").length; i++) {
      $scope.password += '*';
    }
    $rootScope.$ionicGoBack = function() {
      $state.go('tab.home');
    };
    $scope.ccrs = function() {
      window.open($filter('trusted')("https://ccrs.vch.ca/"),'_system');
    };
  });
