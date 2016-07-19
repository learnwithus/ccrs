angular.module('ccrs.controllers.registeredctrl', [])
  .controller('RegisteredCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope) {
    var course_url = $rootScope.CCRS_URL + "registered.php";
    $scope.courses = [];
    $ionicLoading.show({
      template: 'Loading Courses'
    });
    $http.get(course_url + "?user=" + Localstorage.get('CCRSID'))
      .then(function(response) {
        $scope.courses = response.data;
        $scope.courses.forEach(function(session) {
          var datetime = session.StartDate.split(" ");
          session.startDate = datetime[0] + " " + datetime[1] + " " + datetime[2];
          session.fullStartTime = datetime[3].split(":");
          session.startTime = session.fullStartTime[0] + ":" + session.fullStartTime[1]
            + session.fullStartTime[3].substring(3);
        });
        $ionicLoading.hide();
        $state.go($state.current, {}, {reload: false});
      }, function(response) {
        console.log(response);
        $ionicLoading.hide();
      });
    $scope.appliedClass = function(index) {
      if (index % 2 != 0) {
        return "item item-text-wrap item-blue";
      } else {
        return "item item-text-wrap";
      }
    };
  });
