angular.module('havaschedule.controllers', [])

// .controller('AppCtrl',
//   function($scope, $ionicModal, $timeout, dataServices, $rootScope, dateFilter) {
//
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   // $scope.$on('$ionicView.enter', function(e) {
//   //   // $log.debug('$ionicView.enter triggered (see app.js)');
//   // });
//
//   // ******************************************************************************
//   //  login
//   // ******************************************************************************
//
//   // Form data for the login modal
//   $scope.loginData = {};
//
//   // Create the login modal that we will use later
//   $ionicModal.fromTemplateUrl('templates/login.html', {
//     scope: $scope
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });
//
//   // Triggered in the login modal to close it
//   $scope.closeLogin = function() {
//     $scope.modal.hide();
//   };
//
//   // Open the login modal
//   $scope.login = function() {
//     $scope.modal.show();
//   };
//
//   // Perform the login action when the user submits the login form
//   $scope.doLogin = function() {
//     $log.debug('Doing login', $scope.loginData);
//
//     // Simulate a login delay. Remove this and replace with your login
//     // code if using a login system
//     $timeout(function() {
//       $scope.closeLogin();
//     }, 1000);
//   };
//
//   // ******************************************************************************
//   //  choose bellschedule
//   // ******************************************************************************
//
//   $ionicModal.fromTemplateUrl('templates/choosebell.html', {
//     scope:$scope
//   }).then(function(modal) {
//     $scope.chooseBellModal = modal;
//   });
//
//   // Triggered in the debug modal to close it
//   $scope.closeBellChooser = function() {
//     $scope.chooseBellModal.hide();
//   };
//
//   $scope.changeBellSelection = function(selection) {
//       $rootScope.chosenBellScheduleName = $scope.items[selection];
//       $rootScope.bellScheduleStatusChange = true;
//       $scope.closeBellChooser();
//   };
//
//   // Open the login modal
//   $scope.showBell = function() {
//     $scope.items = [];
//     var bells = dataServices.getBellSchedules('all');
//     for (var bellID in bells) {
//       $scope.items.push(bells[bellID].name);
//     }
//     $scope.chooseBellModal.show();
//   };
//
//   // ******************************************************************************
//   //  debug
//   // ******************************************************************************
//
//   // Form data for the debug modal
//   $scope.debugData = {
//     timeData: dataServices.getDebugTime(),
//     debugEnabled: dataServices.isDebug()
//   };
//
//   $ionicModal.fromTemplateUrl('templates/debug.html', {
//     scope:$scope
//   }).then(function(modal) {
//     $scope.debugmodal = modal;
//   });
//
//   // Triggered in the debug modal to close it
//   $scope.closeDebug = function() {
//     $scope.debugmodal.hide();
//   };
//
//   // Open the login modal
//   $scope.debug = function() {
//     $scope.debugmodal.show();
//   };
//
//   // Perform the debug toggle action when the user submits the debug form
//   $scope.doDebug = function() {
//     // $log.debug('Doing debug', $scope.debugData);
//     $rootScope.debugStatusChange = true;
//     // incrementing the app system time in debug mode uses
//     // the delta from appStartTime, so we need to reset this...
//     if ($scope.debugData.debugEnabled) {
//       $rootScope.appStartTime = new Date();
//       $log.debug("run app.js at " + dateFilter($rootScope.appStartTime, "yyyy-mm-dd HH:mm:ss"));
//       dataServices.setDebugTime($scope.debugData.timeData);
//     }
//     dataServices.setDebug($scope.debugData.debugEnabled);
//     $scope.closeDebug();
//   };
//
//   //  var set in app.js
//   $scope.devModeEnabled = $rootScope.devModeEnabled;
//
//
// })  // end of appCtrl

.controller('DisplayCtrl', ['$scope', '$rootScope', '$log', '$ionicPopup', '$cordovaNativeAudio', 'dateTimeServices', 'timeCalcServices', 'dataServices', 'dateFilter', '$cordovaLocalNotification', '$compile',
  function($scope, $rootScope, $log, $ionicPopup, $cordovaNativeAudio, dateTimeServices, timeCalcServices, dataServices, dateFilter, $cordovaLocalNotification, $compile) {

    // ******************************************************************************
    //  handle background and resultTime
    //  see:  https://cordova.apache.org/docs/en/latest/cordova/events/events.resume.html
    // ******************************************************************************

    $scope.$on('$ionicView.enter', function($cordovaNativeAudio) {
        $scope.updateDateUI();
        $scope.updatePeriodUI();
        $scope.updateTimerUI();
    });

    // this only happens when it's instantiated....
    $scope.currentDateTimeWithDebug = dataServices.getCurrentTime(dataServices.isDebug());

    $scope.updateUI = function() {
      $scope.updateDateUI();
      $scope.updatePeriodUI();
    };

    $scope.updateTimerUI = function() {
      $scope.timers = dataServices.getTimers();
    };

    $scope.updateDateUI = function() {
      $scope.theDate = dateTimeServices.dateString($scope.currentDateTimeWithDebug);
      $scope.theWeekday = dateTimeServices.dayOfWeekString($scope.currentDateTimeWithDebug);
      $scope.debug = dataServices.isDebug();
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
      $scope.activePeriod = timeCalcServices.calcBellUsingDates(bellschedule);
      var theRosteredClass;
      $scope.chosenBellScheduleName = $rootScope.chosenBellScheduleName;
      // $log.debug('updatePeriodUI found:  ' + activePeriod.status);

      if ($scope.activePeriod.status == 'not during school hours') {        // not during school hours
        $log.debug('activating non school hours mode');
        $scope.inClassDiv = false;
        $scope.passingTimeDiv = false;
        $scope.classTimers = false;
        $scope.theClass = '';
        $scope.thePeriod = $scope.activePeriod.status;
        $scope.periodStart = '';
        $scope.periodEnd = '';
      } else {
        theRosteredClass = timeCalcServices.getRosteredClass($scope.activePeriod.period, roster);
        $scope.theClass = theRosteredClass.name;
        $scope.thePeriod = $scope.activePeriod.period.name;
        $scope.theRoom = theRosteredClass.room;
        $scope.roomSpecified = true;

        if ($scope.theRoom.trim().length < 2) {
          $scope.roomSpecified = false;
        }
        $scope.periodStartDateTimeString = dateFilter($scope.activePeriod.period.start, "MMM dd, yyyy HH:mm:ss");
        $scope.periodStartString = $scope.activePeriod.period.start;

        if ($scope.activePeriod.status == 'passing time') {   // passing time.  must find a way to do constants
          $log.debug('activating passing time mode');
          $scope.inClassDiv = false;
          $scope.passingTimeDiv = true;
          $scope.classTimers = false;
          $scope.periodEnd = '';
        } else {
          $log.debug('activating during school mode');
          $scope.inClassDiv = true;
          $scope.passingTimeDiv = false;
          $scope.classTimers = true;
          // used in display.html directly
          $scope.periodStartString = dateFilter($scope.activePeriod.period.start, "HH:mm");
          $scope.periodEndString = dateFilter($scope.activePeriod.period.end, "HH:mm");

          // used in display.html to initialize the counttimer elements (see directives.js)
          $scope.periodStartDateTimeString = dateFilter($scope.activePeriod.period.start, "MMM dd, yyyy HH:mm:ss");
          $scope.periodEndDateTimeString = dateFilter($scope.activePeriod.period.end, "MMM dd, yyyy HH:mm:ss");
        }
      }
    };

    $scope.activate = function(timer) {
      if (timer.active === false) {
        var periodEnd, timerEnd, nowTime;
        nowTime = new Date(dataServices.getCurrentTime());
        if (timer.duration < 0)
        {
          periodEnd = new Date($scope.activePeriod.period.end);
          // check to make sure that there is enough time left in the period to permit the alarm
          var remainingTimeInPeriod = periodEnd.getTime() - nowTime.getTime();
          remainingTimeInPeriod /= 60000; // convert to minutes
          if (remainingTimeInPeriod < Math.abs(timer.duration)) return;
          timerEnd = new Date(periodEnd);
          timerEnd.setMinutes(timerEnd.getMinutes() + timer.duration);
        } else {
          timerEnd = nowTime.setMinutes(nowTime.getMinutes() + timer.duration);
        }
        timer.endTime = dateFilter(timerEnd, "MMM dd, yyyy HH:mm:ss");
        $cordovaLocalNotification.schedule({
            id: timer.id,
            at: timerEnd,
            text: "Timer Ended at " + dateFilter(timerEnd, 'HH:mm:ss'),
            sound:  'file://sounds/bell.wav'
        }).then(function() {
          $log.debug("notification " + timer.id + " set for " + dateFilter(timerEnd, "HH:mm:ss"));
        });

        $log.debug(timer);
        $scope.timerobj = timer;
        $log.debug("timer set for " + timer.endTime);
      } else {
        $log.debug('timer cancelled for id:  ' + timer.id);
        $cordovaLocalNotification.cancel(timer.id, function() {
          $log.debug("notification cancelled also");
        });
      }
      timer.active = !timer.active;
    };

    $scope.edit = function(timer) {
      $log.debug("editing " + timer);
    };

    $scope.shouldShow = function(timer) {
      if (timer.duration < 0 && $scope.activePeriod.status == 'during school') {
        return true;
      } else if (timer.duration > 0) {
        return true;
      }
      return false;
    };
  }]
)

.controller('PrefsCtrl', ['$scope', '$rootScope', '$log', '$ionicModal', 'dataServices', 'dateFilter',
  function($scope, $rootScope, $log, $ionicModal, dataServices, dateFilter) {
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
      // $log.debug('Doing debug', $scope.debugData);
      $rootScope.debugStatusChange = true;
      // incrementing the app system time in debug mode uses
      // the delta from appStartTime, so we need to reset this...
      if ($scope.debugData.debugEnabled) {
        $rootScope.appStartTime = new Date();
        $log.debug("run app.js at " + dateFilter($rootScope.appStartTime, "yyyy-mm-dd HH:mm:ss"));
        dataServices.setDebugTime($scope.debugData.timeData);
      }
      dataServices.setDebug($scope.debugData.debugEnabled);
      $scope.closeDebug();
    };

    //  var set in app.js
    $scope.devModeEnabled = $rootScope.devModeEnabled;
  }
])

.controller('RosterCtrl', ['$scope', '$rootScope', '$log', '$ionicModal', 'dataServices', 'dateFilter',
  function($scope, $rootScope, $log, $ionicModal, dataServices, dateFilter) {
    $scope.roster = dataServices.getRoster();
  }

])

.controller('BellsCtrl', ['$scope', '$rootScope', '$log', '$ionicModal', 'dataServices', 'dateFilter',
  function($scope, $rootScope, $log, $ionicModal, dataServices, dateFilter) {
    $scope.bells = dataServices.getBellSchedules('all');
  }

]);
