
angular.module('havaschedule', [
  'ionic',
  'ionic.service.core',
  'havaschedule.controllers',
  'havaschedule.services',
  'havaschedule.directives',
  'ngCordova',
  'ngStorage'
])

.run(function($ionicPlatform, $rootScope, dateFilter) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.appStartTime = new Date();
  $rootScope.debug = false;
  $rootScope.debugStatusChange = false;
  var debugtime = new Date();
  debugtime.setHours(8);
  debugtime.setMinutes(9);
  debugtime.setSeconds(0);
  debugtime.setMilliseconds(0);
  $rootScope.debugTime = debugtime;
  $rootScope.devModeEnabled = true;
  // default bell schedule....
  $rootScope.chosenBellScheduleName = "Regular";
  $rootScope.bellScheduleStatusChange = false;
  $rootScope.timeNotificationList = undefined;
  console.debug("run app.js at " + dateFilter($rootScope.appStartTime, "yyyy-mm-dd HH:mm:ss"));

})

// see:  http://stackoverflow.com/questions/27874855/how-to-place-ionic-tabs-at-the-bottom-of-the-screen
.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('top'); // other values: bottom

}])

.config(['$logProvider', function($logProvider){
    $logProvider.debugEnabled(true);
}])

// TODO:  this will be for persistent preferences....
.config(['$localStorageProvider',
    function ($localStorageProvider) {
        $localStorageProvider.set('prefs', { 'sampledata': true });
    }
])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DisplayCtrl'
        }
      }
    })

    .state('tab.roster', {
      url: '/roster',
      views: {
        'tab-roster': {
          templateUrl: 'templates/tab-roster.html',
          controller: 'RosterCtrl'
        }
      }
    })

    .state('tab.roster-detail', {
      url: '/roster/:classId',
      views: {
        'tab-roster': {
          templateUrl: 'templates/roster-detail.html',
          controller: 'RosterDetailCtrl'
        }
      }
    })

    .state('tab.bells', {
      url: '/bells',
      views: {
        'tab-bells': {
          templateUrl: 'templates/tab-bells.html',
          controller: 'BellsCtrl'
        }
      }
    })

    .state('tab.bell-detail', {
    url: '/bells/:bellId',
    views: {
      'tab-bells': {
        templateUrl: 'templates/bell-detail.html',
        controller: 'BellDetailCtrl'
      }
    }
  })

  .state('tab.prefs', {
    url: '/prefs',
    views: {
      'tab-prefs': {
        templateUrl: 'templates/tab-prefs.html',
        controller: 'PrefsCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/tab/dash');

  console.debug("config app.js");

});
