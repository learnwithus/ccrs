angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('TrainingCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope) {
  var course_url = $rootScope.CCRS_URL + "training.php"
  console.log(Localstorage.getObject("token").userid);
  $scope.courses = [];
  $ionicLoading.show({
    template: 'Loading Courses'
  });
  // $http.get(course_url + "?user=" + Localstorage.getObject('token').userid)
  $http.get(course_url + "?user=36")
    // Using a hardcoded user id value, until I have access to an account that exists on both CCRSQA and production
    // When I log in using demo_vch_02, userid on production is "23723" which does not exist on CCRSQA db
    // If I try to log in using an account that only exists on CCRSQA, it fails since I'm using Jacky's take5 (LearRX)
    // service to log in, which uses the production db to authenticate.
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
      return "item item-text-wrap item-blue";
    } else {
      return "item item-text-wrap";
    }
  };
})

.controller('RegisteredCtrl', function($scope, $http, $state, Localstorage, $ionicPopup, $ionicLoading, $rootScope) {
  var course_url = $rootScope.CCRS_URL + "registered.php"
  console.log(Localstorage.getObject("token").userid);
  $scope.sessions = [];
  $ionicLoading.show({
    template: 'Loading Courses'
  });
  // $http.get(course_url + "?user=" + Localstorage.getObject('token').userid)
  $http.get(course_url + "?user=1576")
    .then(function(response) {
      $scope.sessions = response.data;
      $scope.sessions.forEach(function(session) {
        var datetime = session.StartDate.split(" ");
        session.startDate = datetime[0];
        session.startTime = datetime[1];
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
  $scope.log = function(courseId) {
    console.log(courseId);
  }
})

.controller('LoginCtrl', function($http, $scope, $state, Localstorage, $templateCache, $ionicPopup) {
  $scope.user = {};

  if (Localstorage.getObject('token') && Localstorage.get("username") && Localstorage.get("password")) {
    $state.go('tab.courses');
  }

  $scope.login = function () {
      var token_url = "https://learn.vch.ca/m2/local/take5service/logging_in.php";

      $http({
        method: "POST",
        url: token_url,
        data: {
          'username': $scope.user.username,
          'password': $scope.user.password,
          'service': 'take5service'
        },
        cache: $templateCache
      })
        .then(function(result) {
          Localstorage.setObject('token', result.data);
          Localstorage.set('username', $scope.user.username);
          Localstorage.set('password', $scope.user.password);

          var token = Localstorage.getObject('token').token;
          var userId = Localstorage.getObject('token').userid;

          if (typeof token !== "undefined" && typeof userId !== "undefined") {
            $state.go('tab.courses');
            console.log(userId);
          }
          //failed login
          else {
            $ionicPopup.alert({
              title: 'Login Error',
              template: 'Your username or password is incorrect. Please re-enter.'
            });
          }
        });
  };
})

.controller('CoursesCtrl', function($scope, $http, $state, $ionicModal, $rootScope, $ionicLoading) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.courses = [];
  $scope.date;

  var showLoader = function() {
    $ionicLoading.show({
      template: 'Loading Courses'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });
  };
  var hideLoader = function(){
    $ionicLoading.hide().then(function(){
      console.log("The loading indicator is now hidden");
    });
  };

  $scope.search_preference = {
    "Organization": [
      {name: "Vancouver Coastal Health", value: true},
      {name: "Providence Health Care ", value: true},
      {name: "Fraser Health", value: true},
      {name: "Island Health", value: true}
    ],
    "CourseType": [
      {name: "Online Course", value: true, alias: "1"},
      {name: "Classroom Course", value: true, alias: "0"}
    ]};

  $scope.findCourses = function(title) {
    showLoader();;
    var courses_url = $rootScope.CCRS_URL + "courses.php";
    courses_url += '?';
    var orgs = $scope.search_preference.Organization;
    var orgs_added = 0;
    var types = $scope.search_preference.CourseType;
    var types_added = 0;

    for (var i = 0; i < orgs.length; i++) {
      if (orgs[i].value) {
        courses_url += 'Organization[]=' + orgs[i].name + '&';
        orgs_added += 1;
      }
    }
    courses_url = courses_url.substring(0, courses_url.length - 1);

    if (orgs_added > 0) {
      courses_url += '&';
    } else {
      courses_url += '?';
    }
    for (var i = 0; i < types.length; i++) {
      if (types[i].value) {
        courses_url += 'CourseType[]=' + types[i].alias + '&';
        types_added += 1;
      }
    }
    courses_url = courses_url.substring(0, courses_url.length - 1);

    if (types_added > 0 || orgs_added > 0) {
      courses_url += '&';
    } else {
      courses_url += '?';
    }

    $http.get(courses_url + 'title=' + title)
      .then(function(response) {
          $scope.courses = response.data;
          hideLoader();
          $state.go($state.current, {}, {reload: false});
      }, function(response) {
          hideLoader();
          console.log(response);
      });
  };

  $ionicModal.fromTemplateUrl('templates/advanced-search.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('CourseDetailCtrl', function($scope, $http, $state, $stateParams, Preferences, $ionicPopup, $rootScope) {
  // var course_url = 'http://localhost/course.php';
  var course_url = $rootScope.CCRS_URL + "course.php";
  $scope.course = {};
  $scope.online;

  $http.get(course_url + '?id=' + $stateParams.CourseID.toString())
    .then(function(response) {
        $scope.course = response.data;
        $scope.online = $scope.course.CourseType === "Online Course";
        $state.go($state.current, {}, {reload: false});
    }, function(response) {
        console.log(response);
    });

  $scope.viewSessions = function() {
    Preferences.setPreference($scope.course.Title);
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
       $state.go('tab.course-online', {'CourseID': $scope.course.CourseID});
     } else {
       console.log('You are not enrolled');
     }
   });
  };
})

.controller('SessionsCtrl', function($scope, $http, $state, $stateParams, Preferences, $rootScope) {
  // var course_url = 'http://localhost/sessions.php';
  var course_url = $rootScope.CCRS_URL + "sessions.php";
  $scope.sessions = [];
  $scope.course = Preferences.getPreference();
  $http.get(course_url + '?id=' + $stateParams.CourseID.toString())
    .then(function(response) {
        $scope.sessions = response.data;
        $scope.sessions.forEach(function(session) {
          var datetime = session.StartDate.split(" ");
          session.startDate = datetime[0];
          session.startTime = datetime[1];
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
})

.controller('AccountCtrl', function($scope, $rootScope, $state, Localstorage) {
  $scope.logout = function() {
    Localstorage.remove("username");
    Localstorage.remove("password");
    Localstorage.remove("token");
    $state.go('login');
  };
})

.controller('OnlineMoodleCtrl', function($scope, $state, $stateParams, $filter, $rootScope, Localstorage, $http) {
  // $scope.moodle_url = "https://learn.vch.ca/m2/course/view.php?id=" + $stateParams.MoodleID.toString();
  // $scope.moodle_url = "https://webedpm.com/park/moodle/course/view.php?id=2";
  $scope.login_url = "https://webedpm.com/park/ccrsapp.php?username=" + Localstorage.get('username')
    + "&password=" + Localstorage.get('password') + "&course_id=2";
  // http://sourcefreeze.com/cordova-inappbrowser-plugin-example-using-ionic-framework/
  window.open($filter('trusted')($scope.login_url),'_self');

})

.controller('OnlineCtrl', function($scope, Preferences, $state, $http, $stateParams, $rootScope) {
  $scope.course = Preferences.getPreference();
  // var online_course_url = "http://localhost/online_course.php"
  var online_course_url = $rootScope.CCRS_URL + "online_course.php";
  $scope.online_course = {};
  $scope.moodle_url = "";
  $http.get(online_course_url + '?id=' + $stateParams.CourseID.toString())
    .then(function(response) {
        $scope.online_course = response.data;
        //$scope.moodle_url = response.data.URL;
        $scope.moodle_url = $scope.online_course.URL.substr($scope.online_course.URL.lastIndexOf("=") + 1);
        console.log($scope.moodle_url);
        $state.go($state.current, {}, {reload: false});
    }, function(response) {
        console.log(response);
    });
});

