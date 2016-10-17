angular.module('ccrs.controllers.coursesctrl', [])
.controller('CoursesCtrl', function($scope, $http, $state, $ionicModal, $rootScope, $ionicLoading, $ionicHistory) {
  $scope.courses = [];
  $scope.date;
  $scope.clear = true;


  $scope.setCache = function() {
    $scope.clear = false;
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
    if (title == "") return;
    $ionicLoading.show();
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
        $ionicLoading.hide();
        $state.go($state.current, {}, {reload: false});
      }, function(response) {
        $ionicLoading.hide();
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
    $scope.findCourses(document.getElementById("input_title").value);
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  // Never show back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = false;
    $scope.clear = true;
  });

  $scope.$on('$ionicView.afterLeave', function() {
    if ($scope.clear) {
      $ionicHistory.clearCache();
    }
  });
});
