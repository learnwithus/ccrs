angular.module('ccrs.controllers.settingsctrl', [])
.controller('SettingsCtrl', function($scope,  $state, Localstorage, $filter) {
  $scope.logout = function() {
    Localstorage.remove("username");
    Localstorage.remove("password");
    Localstorage.remove("token");
    Localstorage.remove('user_courses');
    $state.go('login');
  };

  $scope.help = function() {
    window.open($filter('trusted')("https://ccrs.vch.ca/Help.aspx"),'_system');
  };
});
