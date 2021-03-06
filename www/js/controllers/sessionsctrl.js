angular.module('ccrs.controllers.sessionsctrl', [])
.controller('SessionsCtrl', function($scope, $http, $state, $stateParams, Preferences, $rootScope, Localstorage, $ionicPopup, $ionicLoading, $ionicHistory, $timeout) {
  var session_url = $rootScope.CCRS_URL + "sessions.php";
  $scope.sessions = [];
  $scope.course = Preferences.getPreference();
  $scope.empty = false;

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i]['SessionID'] == obj) {
        return true;
      }
    }
    return false;
  }

  $ionicLoading.show({
    template: 'Retrieving available sessions'
  });
  $http.get($rootScope.CCRS_URL + 'registered_sessions.php?user=' + Localstorage.get('CCRSID'))
    .then(function(response) {
      Localstorage.setObject('user_courses', response.data);
      getSessions();
    }, function(response) {
      $ionicLoading.hide();
      console.log(response);
    });

  var getSessions = function() {
    $http.get(session_url + '?id=' + $stateParams.CourseID.toString())
    .then(function(response) {
      $scope.sessions = response.data;
      if ($scope.sessions.length == 0) {
        $scope.empty = true;
      }
      $scope.sessions.forEach(function(session) {
        var datetime = session.StartDate.split(" ");
        session.startDate = datetime[0] + " " + datetime[1] + " " + datetime[2];

        var fullStartTime = datetime[3].split(":");
        session.startTime = fullStartTime[0] + ":" + fullStartTime[1] + fullStartTime[3].substring(3);

        session.userEnrolled = containsObject(session.SessionID, Localstorage.getObject('user_courses'));

        session.isFull = (session.NumEnrolled >= session.MaxCapacity);
      });
      $ionicLoading.hide();
      $state.go($state.current, {}, {reload: false});
    }, function(response) {
      $ionicLoading.hide();
      console.log(response);
    });
  };

  $scope.appliedClass = function(index) {
    if (index % 2 != 0) {
      return "item item-text-wrap item-blue";
    } else {
      return "item item-text-wrap";
    }
  };

  $scope.showConfirm = function(session) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'You are about to enrol in the following session:<br><br>' + $scope.course.Title +
      '<br>' + session.startDate + " " + session.startTime +
      '<br>' + session.Location,
      template: "",
      okText: "Accept",
      okType: "button-default"
    });

    confirmPopup.then(function(res) {
      if(res) {
        Preferences.setPreference($scope.course);
        var req_url = $rootScope.CCRS_URL + "register_student.php";
        $ionicLoading.show({
          template: 'Registering'
        });

        $http({
          method: "POST",
          url: req_url,
          data: {
            'user': Localstorage.get('CCRSID'),
            'session': session.SessionID,
            'course': $scope.course.CourseID
          }
        })
          .then(function(response) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            var registered_session_url = $rootScope.CCRS_URL + "registered_sessions.php";
            $http.get(registered_session_url + "?user=" + Localstorage.get('CCRSID'))
              .then(function(response) {
                var sessions = response.data;
                if (containsObject(session.SessionID, sessions)) {
                  $ionicLoading.hide();
                  $state.go('tab.home');
                  $ionicPopup.alert({
                    title: 'Successfully Registered',
                    template: 'You have successfully registered for the session',
                    okType: 'btn-default'
                  });
                } else {
                  $ionicLoading.hide();
                  $state.go('tab.home');
                  $ionicPopup.alert({
                    title: 'Registration Failed',
                    template: 'Failed registration. You may not be eligible for the session. Please check your account type and try again',
                    okType: 'btn-default'
                  });
                }
              }, function(response) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: 'Registration Failed',
                  template: 'Registration failed due to a server error. Please try again soon',
                  okType: 'btn-default'
                });
              });
          }).then($ionicLoading.hide());

      }
    });
  };
  $rootScope.$ionicGoBack = function() {
    $ionicHistory.goBack();
  };
});
