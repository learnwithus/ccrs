angular.module('ccrs.controllers.sessionsctrl', [])
.controller('SessionsCtrl', function($scope, $http, $state, $stateParams, Preferences, $rootScope, Localstorage, $ionicPopup, $ionicLoading, $ionicHistory) {
  // var course_url = 'http://localhost/sessions.php';
  var session_url = $rootScope.CCRS_URL + "sessions.php";
  $scope.sessions = [];
  $scope.course = Preferences.getPreference();
  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i]['SessionID'] == obj) {
        return true;
      }
    }
    return false;
  }

  $http.get(session_url + '?id=' + $stateParams.CourseID.toString())
    .then(function(response) {
      $scope.sessions = response.data;
      $scope.sessions.forEach(function(session) {
        var datetime = session.StartDate.split(" ");
        session.startDate = datetime[0] + " " + datetime[1] + " " + datetime[2];
        session.fullStartTime = datetime[3].split(":");
        session.startTime = session.fullStartTime[0] + ":" + session.fullStartTime[1]
          + session.fullStartTime[3].substring(3);
        session.userEnrolled = containsObject(session.SessionID, Localstorage.getObject('user_courses'));
      });
      $state.go($state.current, {}, {reload: false});
    }, function(response) {
      console.log(response);
    });
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
        $ionicLoading.show();

        $http({
          method: "POST",
          url: req_url,
          data: {
            'user': Localstorage.get('CCRSID'),
            'session': session.SessionID,
            'course': $scope.course.CourseID,
            'group': Localstorage.get('group')
          }
        })
          .then(function(response) {
            $ionicLoading.hide();
            console.log(response.data);
            var list_courses = Localstorage.getObject('user_courses');
            var new_course = {CourseID: Preferences.getPreference.CourseID, SessionID: session.SessionID};
            list_courses.push(new_course);
            Localstorage.setObject('user_courses', list_courses);
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $state.go('tab.courses');
            $ionicPopup.alert({
              title: 'Successfully Registered',
              template: 'You have successfully registered for the session.'
            });
          }).then($ionicLoading.hide());

      } else {
        console.log('You are not enrolled');
      }
    });
  };
})
