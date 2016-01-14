angular.module('havaschedule.controllers', [])

.constant('PASSING_TIME', '-2')
.constant('NOT_SCHOOL_HOURS', '-1')

.controller('AppCtrl',
function($scope, $ionicModal, $timeout, dataServices) {

  // debug
  // $scope.debug = dataServices.isDebug();

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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
})

.controller('DisplayCtrl', ['$scope', 'dateTimeServices', 'timeCalcServices', 'dataServices', 'dateFilter',
  // dumb programmer note:  the dependencies above ONLY need to get injected into the
  // controller function ONCE (below).  They are available as scoped variables to every
  // inner function w/out further injection.  Neat!
function($scope, dateTimeServices, timeCalcServices, dataServices, dateFilter) {

  $scope.currentDateTimeWithDebug = dataServices.getCurrentTime(dataServices.isDebug());
  // $scope.$watch('currentDateTimeWithDebug', function(newValue, oldValue) {
  //   console.log('watch called with ' + newValue);
  //   $scope.updateDateUI();
  //   $scope.updatePeriodUI();
  // });

  $scope.updateDateUI = function() {
    console.log('updateDateUI');
    $scope.theDate = dateTimeServices.dateString($scope.currentDateTimeWithDebug);
    $scope.theWeekday = dateTimeServices.dayOfWeekString($scope.currentDateTimeWithDebug);
  };

  $scope.updatePeriodUI = function() {
    /*
    bellschedule is a two-element array.
    Element 1:  an array of configuration details
    Element 2:  an array of periods
    */

    var bellschedule = dataServices.getBellSchedules();
    var roster = dataServices.getRoster();
    var activePeriod = timeCalcServices.calcBell(bellschedule);
    var theRosteredClass;
    console.log('updatePeriodUI found:  ' + activePeriod.status);

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
      $scope.periodStartDateTimeString = dateFilter(timeCalcServices.getTimeFromString(activePeriod.period.start), "MMM dd, yyyy HH:mm:ss");
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
      $scope.periodStartDateTimeString = dateFilter(timeCalcServices.getTimeFromString(activePeriod.period.start), "MMM dd, yyyy HH:mm:ss");
      $scope.periodStartString = activePeriod.period.start;
      $scope.periodEndString = timeCalcServices.addToTimeString(activePeriod.period.start, activePeriod.period.duration);
      $scope.periodEndDateTimeString = dateFilter(timeCalcServices.getTimeFromString($scope.periodEndString), "MMM dd, yyyy HH:mm:ss");
    }
  };

  $scope.updateDateUI();
  $scope.updatePeriodUI();

}]);
