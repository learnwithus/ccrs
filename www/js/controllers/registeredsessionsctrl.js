angular.module('ccrs.controllers.registeredsessionsctrl', [])
  .controller('RegisteredSessionsCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope, Preferences) {
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

          var fullStartTime = datetime[3].split(":");
          session.startTime = fullStartTime[0] + ":" + fullStartTime[1] + fullStartTime[3].substring(3);

          var fullEndTime = session.EndDate.split(" ")[3].split(":");
          session.endTime = fullEndTime[0] + ":" + fullEndTime[1] + fullEndTime[3].substring(3);
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
      $state.go('tab.home');
    };

    $scope.setPref = function() {
      Preferences.setPreference('tab.registered-sessions');
    };

    $scope.cancel = function(session) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'You are about to cancel your registration for the following course:<br><br>' + session.Title,
        template: "",
        okText: "Accept",
        okType: "button-default"
      });

      confirmPopup.then(function(res) {
        /*
        if(res) {
          var req_url = $rootScope.CCRS_URL + "cancel_session.php";
          $ionicLoading.show();

          $http({
            method: "POST",
            url: req_url,
            data: {
              'user': Localstorage.get('CCRSID'),
              'session': session.SessionID
            }
          })
            .then(function(response) {
              $ionicLoading.hide();
              console.log(response.data);
              var list_courses = Localstorage.getObject('user_courses');
              for (var i = 0; i < list_courses.length; i++) {
                if (list_courses[i]['SessionID'] == session.SessionID) {
                  list_courses.splice(i, 1);
                }
              }
              Localstorage.setObject('user_courses', list_courses);
              $ionicPopup.alert({
                title: 'Successfully Cancelled',
                template: 'You have successfully cancelled your registration for the session.',
                okType: 'btn-default'
              });
              $state.go($state.current);
            }).then($ionicLoading.hide());
        } else {
          console.log('You are not enrolled');
        }
        */
        console.log(session);
      });
    };
});
