// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.preferenceService'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.CCRS_URL = "https://webedpm.com/~nomonke1/park/";
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // Each tab has its own nav history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
    .state('tab.training', {
      url: '/dash/training',
      views: {
        'tab-dash': {
          templateUrl: 'templates/training.html',
          controller: 'TrainingCtrl'
        }
      }
    })
    .state('tab.registered', {
      url: '/dash/registered',
      views: {
        'tab-dash': {
          templateUrl: 'templates/registered.html',
          controller: 'RegisteredCtrl'
        }
      }
    })

  .state('tab.courses', {
      url: '/courses',
      views: {
        'tab-courses': {
          templateUrl: 'templates/tab-courses.html',
          controller: 'CoursesCtrl'
        }
      }
    })
    .state('tab.course-detail', {
      url: '/courses/{CourseID}',
      views: {
        'tab-courses': {
          templateUrl: 'templates/course-detail.html',
          controller: 'CourseDetailCtrl'
        }
      }
    })

      .state('tab.course-sessions', {
        url: '/courses/{CourseID}/sessions',
        views: {
          'tab-courses': {
            templateUrl: 'templates/course-sessions.html',
            controller: 'SessionsCtrl'
          }
        }
      })

      .state('tab.course-online', {
        url: '/courses/{CourseID}/online',

        views: {
          'tab-courses': {
            templateUrl: 'templates/course-online.html',
            controller: 'OnlineCtrl'
          }
        }
      })
      .state('tab.course-online-moodle', {
        url: '/courses/{CourseID}/online/{MoodleID}',

        views: {
          'tab-courses': {
            templateUrl: 'templates/course-online-moodle.html',
            controller: 'OnlineMoodleCtrl'
          }
        }
      })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.factory('Localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || false;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      if($window.localStorage[key] != undefined)
        return JSON.parse($window.localStorage[key] || false );

      return false;
    },
    remove: function(key){
      $window.localStorage.removeItem(key);
    },
    clear: function(){
      $window.localStorage.clear();
    }
  }
}]);
