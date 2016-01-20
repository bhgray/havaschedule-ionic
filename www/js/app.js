
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
  $rootScope.debugTime = '2016-01-16-08-05-00';
  $rootScope.devModeEnabled = true;
  // default bell schedule....
  $rootScope.chosenBellScheduleName = "Regular";
  $rootScope.bellScheduleStatusChange = false;
  console.log("run app.js at " + dateFilter($rootScope.appStartTime, "yyyy-mm-dd HH:mm:ss"));

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.display', {
    url: '/display',
    views: {
      'menuContent': {
        templateUrl: 'templates/display.html',
        controller: 'DisplayCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/display');

  console.log("config app.js");

});
