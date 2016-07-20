angular.module('ccrs.controllers.registeredsessionsctrl', [])
  .controller('RegisteredSessionsCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope, $ionicHistory) {
    var session_url = $rootScope.CCRS_URL + "registered_sessions.php";
    $scope.sessions = [];
    $ionicLoading.show({
      template: 'Loading Sessions'
    });
    $http.get(session_url + "?user=" + Localstorage.get('CCRSID'))
      .then(function(response) {
        $scope.sessions = response.data;
        $scope.sessions.forEach(function(session) {
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
    $rootScope.$ionicGoBack = function() {
      $state.go('tab.dash');
    };
});
