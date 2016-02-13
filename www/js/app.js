
angular.module('havaschedule', [
  'ionic',
  'ionic.service.core',
  'havaschedule.controllers',
  'havaschedule.services',
  'havaschedule.directives',
  'ngCordova',
  'ngStorage',
  'log.ex.uo'
])


.run(function($ionicPlatform, $rootScope, dateFilter, dataServices, prefServices) {
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
  // check to see if the app has been initialized in a first run.
  // if so, copy the sample data to userdata
  // if (prefServices.firstRun()) {
  //   dataServices.appInit();
  // }
// do this everytime for dev purposes
  if (true) {
    dataServices.appInit();
  }

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


/***********************************************************************

  loggin capabilities.  Old functionality (commented) $logProvider is
  angularjs standard.

  Added logExProvider via https://github.com/lwhiteley/AngularLogExtender
  using bower install.

*/

// .config(['$logProvider', function($logProvider){
//     console.debug('app.js config $logProvider');
//     $logProvider.debugEnabled(true);
// }])

.config(['logExProvider', function(logExProvider) {
    logExProvider.enableLogging(true);
    logExProvider.overrideLogPrefix(function (className) {
        var $injector = angular.injector([ 'ng' ]);
        var $filter = $injector.get( '$filter' );
        var separator = " >> ";
        var format = "yyyy-MMM-dd-HH:mm:ss:sss";
        var now = $filter('date')(new Date(), format);
        return "" + now + (!angular.isString(className) ? "" : "::" + className) + separator;
    });
}])


// see:  http://stackoverflow.com/questions/27874855/how-to-place-ionic-tabs-at-the-bottom-of-the-screen
.config(['$ionicConfigProvider', function($ionicConfigProvider,$log) {
    console.debug('app.js config $ionicConfigProvider');
    $ionicConfigProvider.tabs.position('top'); // other values: bottom
}])

// TODO:  this will be for persistent preferences....
.config(['$localStorageProvider',
    function ($localStorageProvider) {
      console.debug('app.js config $localStorageProvider');

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
