
angular.module('havaschedule', [
  'ionic',
  'ionic.service.core',
  'havaschedule.controllers',
  'havaschedule.services',
  'havaschedule.directives',
  'ngCordova'
])

.run(function($ionicPlatform, $rootScope, dateFilter) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
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

.config(['$logProvider', function($logProvider){
    $logProvider.debugEnabled(true);
}])

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
      'tab-chats': {
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

//  to restore:  uncomment the lines below:

  // .state('app', {
  //   url: '/app',
  //   abstract: true,
  //   templateUrl: 'templates/menu.html',
  //   controller: 'AppCtrl'
  // })
  //
  // .state('app.display', {
  //   url: '/display',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/display.html',
  //       controller: 'DisplayCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/app/display');

  // to restore:  uncomment lines above

  console.debug("config app.js");

});
