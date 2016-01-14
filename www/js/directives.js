angular.module('havaschedule.directives', [])

// note:  http://codepen.io/garethdweaver/pen/eNpWBb for timer ideas

.directive('counttimer', ['$interval', 'dateFilter', 'timeCalcServices', 'dataServices', '$timeout',
function($interval, dateFilter, timeCalcServices, dataServices, $timeout) {

  return function(scope, element, attrs) {
    var stopTimer;

    function timeDiff(future, present) {
      // pass along the difference in seconds.
      var result = Math.floor((future - present) / 1000);
      var timeDiffString = timeCalcServices.countdownFormatString(result);
      return timeDiffString;
    }

    function updateTime() {
      // console.log('attrs -> ' + attrs.date);
      var d = dataServices.getCurrentTime();
      var present = d.getTime();
      var future = new Date(attrs.date).getTime();
      var delta = timeDiff(future, present);
      // var result = Math.floor((future - present) / 1000);
      // if (result === 0) {
      //   console.log('period over! at ' + dateFilter(d, "yyyy-mm-dd HH:mm:ss"));
      //   $timeout(function() {
      //     scope.updateDateUI();
      //     scope.updatePeriodUI();
      //   }, 1000);
      // }
      // d = dataServices.getCurrentTime();
      // present = d.getTime();
      // future = new Date(attrs.date).getTime();
      // delta = timeDiff(future, present);
      element.text(delta);
    }

    // var count = timeDiff(future);
    stopTimer = $interval(updateTime, 1000);

    // listen on DOM destroy (removal) event, and cancel the next UI update
    // to prevent updating time after the DOM element was removed.
    element.on('$destroy', function() {
      $interval.cancel(stopTimer);
    });

  };

}])

.directive('theCurrentTime', ['$interval', 'dateFilter', 'dataServices',

function($interval, dateFilter, dataServices) {
  // return the directive link function. (compile function not needed)
  return function(scope, element, attrs) {
    var format;  // date format string
    var stopTime; // so that we can cancel the time updates

    // searches an array to match a given time
    //  might need to be a bit imprecise about matching - we
    // don't know if we will get this call at the very second it's due...
    function findTimeInArray(element, index, array) {
        var d = dataServices.getCurrentTime();
        console.log('findTimeInArray comparing');
        if (d.getHours() == element.getHours() && d.getMinutes() == element.getMinutes()) {
          return true;
        }
        return false;
    }

    // used to update the UI
    function updateTime() {
      var d = dataServices.getCurrentTime();
      // run the findTimeInArray method against all elements of theCurrentTime
      // time notification list...  see if an update is required to the UI.
      var matchingTimes = dataServices.getTimeNotificationList().find(findTimeInArray);
      console.log('updateTime() in directive theCurrentTime --> matchingTimes:  ' + matchingTimes);
      if (matchingTimes !== undefined) {
        scope.updateDateUI();
        scope.updatePeriodUI();
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
