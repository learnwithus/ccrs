angular.module('ccrs.controllers.trainingctrl', [])
  .controller('TrainingCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope) {
    var course_url = $rootScope.CCRS_URL + "training.php";
    $scope.courses = [];
    $ionicLoading.show({
      template: 'Loading Courses'
    });
    // $http.get(course_url + "?user=" + Localstorage.getObject('token').userid)
    $http.get(course_url + "?user=" + Localstorage.get('CCRSID'))
      .then(function(response) {
        $scope.courses = response.data;
        $ionicLoading.hide();
        $state.go($state.current, {}, {reload: false});
      }, function(response) {
        console.log(response);
        $ionicLoading.hide();
      });
    $scope.appliedClass = function(index) {
      if (index % 2 != 0) {
        return "item item-text-wrap item-blue item-no-padding";
      } else {
        return "item item-text-wrap item-no-padding";
      }
    };
    $rootScope.$ionicGoBack = function() {
      $state.go('tab.dash');
    };
});
