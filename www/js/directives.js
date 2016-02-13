angular.module('havaschedule.directives', [])

// note:  http://codepen.io/garethdweaver/pen/eNpWBb for timer ideas

// directive <count-timer> used in the passingCard and scheduleCard.  No alarm --
// just a countdown or countup timer
.directive('countTimer', ['$interval', '$log', 'dateFilter', 'timeCalcServices', 'dataServices', '$timeout', '$rootScope',
  function($interval, $log, dateFilter, timeCalcServices, dataServices, $timeout, $rootScope) {

    return function(scope, element, attrs) {
      var stopTimer;

      function timeDiff(future, present) {
        // pass along the difference in seconds.
        var result = Math.floor((future - present) / 1000);
        var timeDiffString = timeCalcServices.countdownFormatString(result);
        return timeDiffString;
      }

      function updateTimeNoUI() {
        var d = dataServices.getCurrentTime();
        var present = d.getTime();
        var future = new Date(attrs.date).getTime();
        var delta = timeDiff(future, present);
        element.text(delta);
      }

      function updateTime() {
        var updateRequired = false;

        if ($rootScope.debugStatusChange) {
          updateRequired = true;
          $log.debug("counttimer (directive.js):  debugStatusChange");
        } else if ($rootScope.bellScheduleStatusChange) {
          updateRequired = true;
          $log.debug("counttimer (directive.js):  bellScheduleStatusChange");
        }

        if (updateRequired) {
          scope.updateDateUI();
          scope.updatePeriodUI();
          $rootScope.debugStatusChange = false;
          $rootScope.bellScheduleStatusChange = false;
        }

        var d = dataServices.getCurrentTime();
        var present = d.getTime();
        var future = new Date(attrs.date).getTime();
        var delta = timeDiff(future, present);
        element.text(delta);
      }

      stopTimer = $interval(updateTime, 1000);

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.on('$destroy', function() {
        $interval.cancel(stopTimer);
      });
    };
}])

// directive <timer-display> is used in the timerCard.  allows for alarms.
.directive('timerDisplay', ['$interval', '$log', '$cordovaLocalNotification', '$ionicPopup', 'dateFilter', 'timeCalcServices', 'dataServices',
  function($interval, $log, $cordovaLocalNotification, $ionicPopup, dateFilter, timeCalcServices, dataServices) {
    return {
      template: '<div ng-model="timer"></div>',
      link: function(scope, element, attrs) {
        var stopTimer;

        function timeDiff(future, present) {
          // pass along the difference in seconds.
          var result = Math.floor((future - present) / 1000);
          return result;
        }

        function updateTime() {
          var d = dataServices.getCurrentTime();
          var present = d.getTime();
          // $log.debug(scope.timerobj);
          var endTime = new Date(scope.timer.endTime).getTime();
          var delta = timeDiff(endTime, present);
          var timeDiffString = timeCalcServices.countdownFormatString(delta);
          element.text(timeDiffString);
          if (delta === 0) {
            alarm();
            endTimer();
          }
        }

        function alarm() {
          var alertPopup = $ionicPopup.alert({
            title:'Timer Done',
            template: 'Done!'
          });
          alertPopup.then(function(res) {
            $log.debug('alert cancelled');
            $cordovaLocalNotification.cancel(scope.timer.id, function() {
              $log.debug("notification cancelled also");
            });
          });
        }

        function endTimer() {
          scope.timer.active = false;

          $interval.cancel(stopTimer);
          unbindableWatcher();
        }

        stopTimer = $interval(updateTime, 1000);

        var unbindableWatcher = scope.$watch('timerobj', function(newValue, oldValue) {
             if (newValue)
                 updateTime();
         }, true);

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time after the DOM element was removed.
        element.on('$destroy', function() {
          endTimer();
        });
      }
    };
  }
])


// directive <the-current-time> used in the nowcard.  main timing mechanism to
// alert others to necessary UI update based on time of day.

.directive('theCurrentTime', ['$interval',  '$log', 'dateFilter', 'dataServices', 'timeCalcServices', '$rootScope', 'prefServices',
  function($interval,  $log, dateFilter, dataServices, timeCalcServices, $rootScope, prefServices) {
    // return the directive link function. (compile function not needed)
    return function(scope, element, attrs) {
      var format;  // date format string
      var stopTime; // so that we can cancel the time updates

      // searches an array to match a given time
      //  might need to be a bit imprecise about matching - we
      // don't know if we will get this call at the very second it's due...
      // hmm.... but note that this will find that time over and over again for
      // one minute....  perhaps instead of just comparing hour and minute,
      // also compare seconds but allow for 10 seconds?  experiment with window.
      function findTimeInArray(element, index, array) {
          var d = dataServices.getCurrentTime();
          // $log.debug('findTimeInArray comparing ' + d + ' and ' + element);
          if (d.getHours() == element.getHours() && d.getMinutes() == element.getMinutes()) {
            return true;
          }
          return false;
      }

      // used to update the UI
      function updateTime() {
        var d = dataServices.getCurrentTime();
        var list;
        // run the findTimeInArray method against all elements of theCurrentTime
        // time notification list...  see if an update is required to the UI.
        var updateRequired = false;
        if ($rootScope.debugStatusChange) {
          $log.debug("counttimer (directive.js):  debugStatusChange");
          updateRequired = true;
        } else if ($rootScope.bellScheduleStatusChange) {
          $log.debug("counttimer (directive.js):  bellScheduleStatusChange");
          updateRequired = true;
        }

        if (updateRequired) {
          dataServices.setTimeNotificationList(undefined);
          scope.updateDateUI();
          scope.updatePeriodUI();
          scope.updateTimerUI();
          $rootScope.debugStatusChange = false;
          $rootScope.bellScheduleStatusChange = false;
          updateRequired = false;
        }
        list = dataServices.getTimeNotificationList();
        // check once per minute if we are in a new period or passing time
        if (d.getSeconds() === 0) {
            var matchingTimes = list.find(findTimeInArray);
            if (matchingTimes !== undefined) {
              $log.debug("counttimer (directive.js):  matchingTimes found");
              scope.updateDateUI();
              scope.updatePeriodUI();
              scope.updateTimerUI();
            }
        }
        element.text(dateFilter(d, prefServices.getTimeDisplayFormat()));
      }

      stopTime = $interval(updateTime, 1000);

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.on('$destroy', function() {
        $interval.cancel(stopTime);
      });
    };
  }]);
