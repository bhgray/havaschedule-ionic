angular.module('havaschedule.directives', [])

// note:  http://codepen.io/garethdweaver/pen/eNpWBb for timer ideas

.directive('counttimer', ['$interval', 'dateFilter', 'timeCalcServices', 'dataServices', '$timeout', '$rootScope',
function($interval, dateFilter, timeCalcServices, dataServices, $timeout, $rootScope) {

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
        console.log("counttimer (directive.js):  debugStatusChange");
      } else if ($rootScope.bellScheduleStatusChange) {
        console.log("counttimer (directive.js):  bellScheduleStatusChange");
        updateRequired = true;
      }
      if (updateRequired) {
        // console.log('debugStatusChange detected in counttimer directive');
        scope.updateDateUI();
        scope.updatePeriodUI();
        $rootScope.debugStatusChange = false;
        $rootScope.bellScheduleStatusChange = false;
      }

      // console.log('attrs -> ' + attrs.date);
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

.directive('theCurrentTime', ['$interval', 'dateFilter', 'dataServices', 'timeCalcServices', '$rootScope',

function($interval, dateFilter, dataServices, timeCalcServices, $rootScope) {
  // return the directive link function. (compile function not needed)
  return function(scope, element, attrs) {
    var format;  // date format string
    var stopTime; // so that we can cancel the time updates

    // searches an array to match a given time
    //  might need to be a bit imprecise about matching - we
    // don't know if we will get this call at the very second it's due...
    function findTimeInArray(element, index, array) {
        var d = dataServices.getCurrentTime();
        // console.log('findTimeInArray comparing ' + d + ' and ' + element);
        if (d.getHours() == element.getHours() && d.getMinutes() == element.getMinutes()) {
          return true;
        }
        return false;
    }

    // used to update the UI
    function updateTime() {
      var d = dataServices.getCurrentTime();
      var list = null;
      // run the findTimeInArray method against all elements of theCurrentTime
      // time notification list...  see if an update is required to the UI.
      var updateRequired = false;
      if ($rootScope.debugStatusChange) {
        updateRequired = true;
        console.log("counttimer (directive.js):  debugStatusChange");
      } else if ($rootScope.bellScheduleStatusChange) {
        console.log("counttimer (directive.js):  bellScheduleStatusChange");
        updateRequired = true;
      }
      if (updateRequired) {
        $rootScope.timeNotificationList = null;
      }
      if ($rootScope.timeNotificationList === null) {
        $rootScope.timeNotificationList = timeCalcServices.getTimeNotificationList($rootScope.chosenBellScheduleName);
      }
      list = $rootScope.timeNotificationList;
      if (updateRequired) {
        scope.updateDateUI();
        scope.updatePeriodUI();
        $rootScope.debugStatusChange = false;
        $rootScope.bellScheduleStatusChange = false;
        updateRequired = false;
      }
      // check once per minute if we are in a new period or passing time
      if (d.getSeconds() === 0) {
          var matchingTimes = list.find(findTimeInArray);
          if (matchingTimes !== undefined) {
            console.log("counttimer (directive.js):  matchingTimes found");
            scope.updateDateUI();
            scope.updatePeriodUI();
          }
      }
      element.text(dateFilter(d, "HH:mm:ss"));
    }

    stopTime = $interval(updateTime, 1000);

    // listen on DOM destroy (removal) event, and cancel the next UI update
    // to prevent updating time after the DOM element was removed.
    element.on('$destroy', function() {
      $interval.cancel(stopTime);
    });
  };
}]);
