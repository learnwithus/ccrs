angular.module('ccrs.controllers.registeredctrl', [])
  .controller('RegisteredCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope, $ionicHistory, Preferences) {
    var course_url = $rootScope.CCRS_URL + "registered.php";
    $scope.courses = [];
    $ionicLoading.show({
      template: 'Loading Courses'
    });
    $http.get(course_url + "?user=" + Localstorage.get('CCRSID'))
      .then(function(response) {
        $scope.courses = response.data;
        $scope.courses.forEach(function(session) {
          if (session.CourseType == 0) {
            var idx = $scope.courses.indexOf(session);
            $scope.courses.splice(idx, 1);
          }
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
        return "item item-text-wrap item-blue item-no-padding";
      } else {
        return "item item-text-wrap item-no-padding";
      }
    };

    // Always show back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $rootScope.$ionicGoBack = function() {
      $state.go('tab.dash');
    };
    
    $scope.$on('$ionicView.afterLeave', function() {
      $ionicHistory.clearCache();
    });

    $scope.setPref = function() {
      Preferences.setPreference('tab.registered');
    };
});
