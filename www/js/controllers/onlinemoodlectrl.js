angular.module('ccrs.controllers.onlinemoodlectrl', [])
  .controller('OnlineMoodleCtrl', function($scope, $state, $stateParams, $filter, $rootScope, Localstorage) {
    $scope.login_url = "https://learn.vch.ca/m2/vch_custom/ccrsapp/ccrsapp.php?username=" + Localstorage.get('username')
      + "&password=" + Localstorage.get('password') + "&course_id=" + $stateParams.MoodleID.toString();
    // http://sourcefreeze.com/cordova-inappbrowser-plugin-example-using-ionic-framework/
    if (!$scope.loaded) {
      window.open($filter('trusted')($scope.login_url), '_blank');
    }
    $scope.loaded = true;
  });
