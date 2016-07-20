angular.module('ccrs.controllers.onlinectrl', [])
.controller('OnlineCtrl', function($scope, Preferences, $state, $http, $stateParams, $rootScope) {
  $scope.course = Preferences.getPreference();

  var online_course_url = $rootScope.CCRS_URL + "online_course.php";
  $scope.online_course = {};
  $scope.moodle_url = "";
  $http.get(online_course_url + '?id=' + $stateParams.CourseID.toString())
    .then(function(response) {
      $scope.online_course = response.data;
      $scope.moodle_url = $scope.online_course.URL.substr($scope.online_course.URL.lastIndexOf("=") + 1);
      $state.go($state.current, {}, {reload: false});
    }, function(response) {
      console.log(response);
    });
});
