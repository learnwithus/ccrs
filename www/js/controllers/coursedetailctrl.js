angular.module('ccrs.controllers.coursedetailctrl', [])
.controller('CourseDetailCtrl', function($scope, $http, $state, $stateParams, Preferences, $ionicPopup, $rootScope, Localstorage, $ionicLoading, $ionicHistory) {
  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  var course_url = $rootScope.CCRS_URL + "course.php";
  $scope.course = {};
  $scope.online;

  $scope.userEnrolled = false;

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i]['CourseID'] == obj) {
        return true;
      }
    }
    return false;
  }

  /*
  if (containsObject($stateParams.CourseID.toString(), Localstorage.getObject('user_courses'))) {
    $scope.userEnrolled = true;
  } else {
    $scope.userEnrolled = false;
  }
  */
  $scope.userEnrolled = containsObject($stateParams.CourseID.toString(), Localstorage.getObject('user_courses'));

  $http.get(course_url + '?id=' + $stateParams.CourseID.toString())
    .then(function(response) {
      $scope.course = response.data;
      if ($scope.course.Description === '') {
        $scope.course.Description = 'No description available';
      }
      $scope.online = $scope.course.CourseType === "Online Course";
      $state.go($state.current, {}, {reload: false});
    }, function(response) {
      console.log(response);
    });

  $scope.viewSessions = function() {
    Preferences.setPreference($scope.course);
  };

  $scope.startOnlineCourse = function () {
    $ionicLoading.show();
    //Preferences.setPreference($scope.course);
    var online_course_url = $rootScope.CCRS_URL + "online_course.php";
    var moodle_url = "";

    $http.get(online_course_url + '?id=' + $scope.course.CourseID.toString())
      .then(function(response) {
        moodle_url = response.data.URL.substr(response.data.URL.lastIndexOf("=") + 1);
        $ionicLoading.hide();
        $state.go('tab.course-online-moodle', {'CourseID': $scope.course.CourseID, 'MoodleID': moodle_url});
      }, function(response) {
        $ionicLoading.hide();
        console.log(response);
      });
  };

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'You are about to enrol in the following course:<br><br>' + $scope.course.Title,
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
            'session': 0,
            'course': $scope.course.CourseID,
            'group': Localstorage.get('group')
          }
        })
          .then(function(response) {
            $ionicLoading.hide();
            var list_courses = Localstorage.getObject('user_courses');
            var new_course = {CourseID: $scope.course.CourseID, SessionID: 0};
            list_courses.push(new_course);
            Localstorage.setObject('user_courses', list_courses);
            $state.go('tab.course-online', {'CourseID': $scope.course.CourseID});
          }).then($ionicLoading.hide());


      } else {
        console.log('You are not enrolled');
      }
    });
  };

  // Always show back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });

  $rootScope.$ionicGoBack = function() {
    $state.go('tab.courses');
  };
});
