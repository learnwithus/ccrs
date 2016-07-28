angular.module('ccrs.controllers.homectrl', [])
  .controller('HomeCtrl', function($scope) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = false;
    });
  });
