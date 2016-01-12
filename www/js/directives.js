angular.module('havaschedule.directives', [])

// note:  http://codepen.io/garethdweaver/pen/eNpWBb for timer ideas

.directive('countdown', ['timeCalcServices', '$interval', 'dateFilter',
function(timeCalcServices, dateFilter, $interval) {

  var theTimer;

  function diff(future, element) {
    // pass along the difference in seconds.
    var result = Math.floor((future.getTime() - new Date().getTime()) / 1000);
    var timeDiffString = timeCalcServices.countdownFormatString(result);
    return element.text(timeDiffString);
  }

  return {
    restrict: 'AE', // restricted to attribute or element
    scope: { date: '@' },   //meaning date as the attribute in the tag
    link: function (scope, element, attrs) {
      var future = new Date(scope.date);
      theTimer = $interval(diff(future, element), 1000);
      // timer must be explicitly destroyed if the element is removed from the DOM
      element.on('$destroy', function() {
        $interval.cancel(theTimer);
      });
    }
  };
}])

.directive('counttimer', ['$interval', 'dateFilter', 'timeCalcServices', 'dataServices',
function($interval, dateFilter, timeCalcServices, dataServices) {

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
      element.text(timeDiff(future, present));
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

    // used to update the UI
    function updateTime() {
      var d = dataServices.getCurrentTime();
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
