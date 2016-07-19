angular.module('ccrs.controllers.profilectrl', [])
  .controller('ProfileCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope) {
    var course_url = $rootScope.CCRS_URL + "profile.php";
    $scope.data = {};
    $ionicLoading.show({
      template: 'Loading Profile'
    });
    // $http.get(course_url + "?user=" + Localstorage.getObject('token').userid)
    $http.get(course_url + "?id=" + Localstorage.get('CCRSID'))
      .then(function(response) {
        $scope.data = response.data;
        $ionicLoading.hide();
        $state.go($state.current, {}, {reload: false});
      }, function(response) {
        console.log(response);
        $ionicLoading.hide();
      });
  });
