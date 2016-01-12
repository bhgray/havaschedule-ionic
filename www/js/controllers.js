angular.module('havaschedule.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // debug
  $scope.debug = true;

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

.controller('DisplayCtrl', ['$scope', 'dateTimeServices', 'timeCalcServices', 'dataServices',
  function($scope, dateTimeServices, timeCalcServices, dataServices) {
    $scope.format = "HH:mm:ss";
    var currentDateTimeWithDebug = dataServices.getCurrentTime($scope.debug);
    if ($scope.debug) {console.log(currentDateTimeWithDebug);}
    $scope.theDate = dateTimeServices.dateString(currentDateTimeWithDebug);
    $scope.theWeekday = dateTimeServices.dayOfWeekString(currentDateTimeWithDebug);

    /*
        bellschedule is a two-element array.
        Element 1:  an array of configuration details
        Element 2:  an array of periods
    */

    var bellschedule = dataServices.getBellSchedules();
    var roster = dataServices.getRoster();
    if ($scope.debug) {console.log(roster);}

    var activePeriod = timeCalcServices.calcBell(bellschedule, currentDateTimeWithDebug);
    if (activePeriod === undefined) {
      $scope.theClass = '';
      $scope.thePeriod = 'not during school hours';
      $scope.periodStart = '';
      $scope.periodEnd = '';
    } else {
      $scope.thePeriod = activePeriod.name;
      var theRosteredClass = timeCalcServices.getRosteredClass(activePeriod, roster);
      $scope.theClass = theRosteredClass.name;
      $scope.periodStart = activePeriod.start;
      $scope.periodEnd = timeCalcServices.addToTimeString(activePeriod.start, activePeriod.duration);
    }


  }]);
