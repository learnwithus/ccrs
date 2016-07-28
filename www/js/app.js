
angular.module('ccrs', ['ionic', 'ccrs.controllers', 'ccrs.preferenceService', 'ccrs.filter', 'ccrs.localStorage'])
.run(function($ionicPlatform, $rootScope) {
  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
      window.open = cordova.InAppBrowser.open;
  }
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
  $rootScope.CCRS_URL = "https://learndev.vch.ca/m2/vch_custom/ccrsapp/";
})

/**
 * States configuration for the app, with a template and controller for each state
 */
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('Back');
  $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider

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
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
    .state('tab.training', {
      url: '/home/training',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/training.html',
          controller: 'TrainingCtrl'
        }
      }
    })
    .state('tab.registered', {
      url: '/home/registered',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/registered.html',
          controller: 'RegisteredCtrl'
        }
      }
    })
    .state('tab.registered-sessions', {
      url: '/home/registered-sessions',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/registered-sessions.html',
          controller: 'RegisteredSessionsCtrl'
        }
      }
    })
    .state('tab.profile', {
      url: '/home/profile',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
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
      cache: false,
      views: {
        'tab-courses': {
          templateUrl: 'templates/course-detail.html',
          controller: 'CourseDetailCtrl'
        }
      }
    })

      .state('tab.course-sessions', {
        url: '/courses/{CourseID}/sessions',
        cache: false,
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

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
