angular.module('havaschedule.controllers', [])

.constant('PASSING_TIME', '-2')
.constant('NOT_SCHOOL_HOURS', '-1')

.controller('AppCtrl',
function($scope, $ionicModal, $timeout, dataServices, $rootScope, dateFilter) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  //   // console.log('$ionicView.enter triggered (see app.js)');
  // });

  // ******************************************************************************
  //  login
  // ******************************************************************************

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // ******************************************************************************
  //  choose bellschedule
  // ******************************************************************************

  $ionicModal.fromTemplateUrl('templates/choosebell.html', {
    scope:$scope
  }).then(function(modal) {
    $scope.chooseBellModal = modal;
  });

  // Triggered in the debug modal to close it
  $scope.closeBellChooser = function() {
    $scope.chooseBellModal.hide();
  };

  $scope.changeBellSelection = function(selection) {
      $rootScope.chosenBellScheduleName = $scope.items[selection];
      $rootScope.bellScheduleStatusChange = true;
      $scope.closeBellChooser();
  };

  // Open the login modal
  $scope.showBell = function() {
    $scope.items = [];
    var bells = dataServices.getBellSchedules('all');
    for (var bellID in bells) {
      $scope.items.push(bells[bellID].name);
    }
    $scope.chooseBellModal.show();
  };

// ******************************************************************************
//  debug
// ******************************************************************************

// Form data for the debug modal
  $scope.debugData = {
    timeData: dataServices.getDebugTime(),
    debugEnabled: dataServices.isDebug()
  };

  $ionicModal.fromTemplateUrl('templates/debug.html', {
    scope:$scope
  }).then(function(modal) {
    $scope.debugmodal = modal;
  });

  // Triggered in the debug modal to close it
  $scope.closeDebug = function() {
    $scope.debugmodal.hide();
  };

  // Open the login modal
  $scope.debug = function() {
    $scope.debugmodal.show();
  };

  // Perform the debug toggle action when the user submits the debug form
  $scope.doDebug = function() {
    // console.log('Doing debug', $scope.debugData);
    $rootScope.debugStatusChange = true;
    // incrementing the app system time in debug mode uses
    // the delta from appStartTime, so we need to reset this...
    if ($scope.debugData.debugEnabled) {
      $rootScope.appStartTime = new Date();
      console.log("run app.js at " + dateFilter($rootScope.appStartTime, "yyyy-mm-dd HH:mm:ss"));
      dataServices.setDebugTime($scope.debugData.timeData);
    }
    dataServices.setDebug($scope.debugData.debugEnabled);
    $scope.closeDebug();
  };

  //  var set in app.js
  $scope.devModeEnabled = $rootScope.devModeEnabled;


})  // end of appCtrl

.controller('DisplayCtrl', ['$scope', '$rootScope', 'dateTimeServices', 'timeCalcServices', 'dataServices', 'dateFilter', '$cordovaLocalNotification',
  // dumb programmer note:  the dependencies above ONLY need to get injected into the
  // controller function ONCE (below).  They are available as scoped variables to every
  // inner function w/out further injection.  Neat!
function($scope, $rootScope, dateTimeServices, timeCalcServices, dataServices, dateFilter) {

  // ******************************************************************************
  //  handle background and resultTime
  //  see:  https://cordova.apache.org/docs/en/latest/cordova/events/events.resume.html
  // ******************************************************************************

  $scope.$on('$ionicView.enter', function() {
      $scope.updateDateUI();
      $scope.updatePeriodUI();
  });

  // this only happens when it's instantiated....
  $scope.currentDateTimeWithDebug = dataServices.getCurrentTime(dataServices.isDebug());

  $scope.updateDateUI = function() {
    // console.log('updateDateUI');
    $scope.theDate = dateTimeServices.dateString($scope.currentDateTimeWithDebug);
    $scope.theWeekday = dateTimeServices.dayOfWeekString($scope.currentDateTimeWithDebug);
  };

  $scope.updatePeriodUI = function() {
    /*
    bellschedule is a two-element array.
    Element 1:  an array of configuration details
    Element 2:  an array of periods
    */

    // var bellschedule = dataServices.getBellSchedules();
    var bellschedule = timeCalcServices.getBellScheduleWithDates($rootScope.chosenBellScheduleName);
    var roster = dataServices.getRoster();
    var activePeriod = timeCalcServices.calcBellUsingDates(bellschedule);
    var theRosteredClass;
    $scope.chosenBellScheduleName = $rootScope.chosenBellScheduleName;
    // console.log('updatePeriodUI found:  ' + activePeriod.status);

    if (activePeriod.status == 'not during school hours') {        // not during school hours
      console.log('activating non school hours mode');
      $scope.inClassDiv = false;
      $scope.passingTimeDiv = false;
      $scope.classTimers = false;
      $scope.theClass = '';
      $scope.thePeriod = activePeriod.status;
      $scope.periodStart = '';
      $scope.periodEnd = '';
    } else if (activePeriod.status == 'passing time') {   // passing time.  must find a way to do constants
      console.log('activating passing time mode');
      $scope.inClassDiv = false;
      $scope.passingTimeDiv = true;
      $scope.classTimers = false;
      theRosteredClass = timeCalcServices.getRosteredClass(activePeriod.period, roster);
      $scope.theClass = theRosteredClass.name;
      $scope.thePeriod = activePeriod.period.name;
      $scope.periodStartDateTimeString = dateFilter(activePeriod.period.start, "MMM dd, yyyy HH:mm:ss");
      $scope.periodStartString = activePeriod.period.start;
      $scope.periodEnd = '';
    } else {
      console.log('activating during school mode');
      $scope.inClassDiv = true;
      $scope.passingTimeDiv = false;
      $scope.classTimers = true;
      $scope.thePeriod = activePeriod.period.name;
      theRosteredClass = timeCalcServices.getRosteredClass(activePeriod.period, roster);
      $scope.theClass = theRosteredClass.name;
      // used in display.html directly
      $scope.periodStartString = dateFilter(activePeriod.period.start, "HH:mm");
      $scope.periodEndString = dateFilter(activePeriod.period.end, "HH:mm");

      // used in display.html to initialize the counttimer elements (see directives.js)
      $scope.periodStartDateTimeString = dateFilter(activePeriod.period.start, "MMM dd, yyyy HH:mm:ss");
      $scope.periodEndDateTimeString = dateFilter(activePeriod.period.end, "MMM dd, yyyy HH:mm:ss");
    }
  };

    $scope.setTimer = function(amt, el, isActive) {
      console.log('settimer for ' + amt);
      var periodEnd, timerEnd, nowTime;
      var scopeDataName = el + 'End';
      console.log('scopeDataName = ' + scopeDataName);
      if (amt < 0) {
        periodEnd = timeCalcServices.getTimeFromString($scope.periodEndString);
        timerEnd = periodEnd.setMinutes(periodEnd.getMinutes() + amt);
      } else {
        nowTime = dataServices.getCurrentTime();
        timerEnd = nowTime.setMinutes(nowTime.getMinutes() + amt);
      }
      if (el === 'timer1') {
        $scope.timer1End = dateFilter(timerEnd, "MMM dd, yyyy HH:mm:ss");
      } else if (el === 'timer2') {
        $scope.timer2End = dateFilter(timerEnd, "MMM dd, yyyy HH:mm:ss");
      } else if (el === 'timer3') {
        $scope.timer3End = dateFilter(timerEnd, "MMM dd, yyyy HH:mm:ss");
      } else if (el === 'timer4') {
        $scope.timer4End = dateFilter(timerEnd, "MMM dd, yyyy HH:mm:ss");
      } else if (el === 'timer5') {
        $scope.timer5End = dateFilter(timerEnd, "MMM dd, yyyy HH:mm:ss");
      } else if (el === 'timer6') {
        $scope.timer6End = dateFilter(timerEnd, "MMM dd, yyyy HH:mm:ss");
      }
    };

}]);
