angular.module('ccrs.controllers',
  ['ccrs.controllers.loginctrl',
  'ccrs.controllers.trainingctrl',
  'ccrs.controllers.registeredctrl',
  'ccrs.controllers.registeredsessionsctrl',
  'ccrs.controllers.profilectrl',
  'ccrs.controllers.coursesctrl',
  'ccrs.controllers.coursedetailctrl',
  'ccrs.controllers.sessionsctrl',
  'ccrs.controllers.onlinectrl',
  'ccrs.controllers.onlinemoodlectrl',
  'ccrs.controllers.accountctrl'])

.controller('DashCtrl', function($scope, $state, $ionicHistory) {
  $scope.goToSearch = function() {
    $state.go('tab.courses');
  };

  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = false;
  });
});

