angular.module('havaschedule.services', [])

.service('prefServices', function($localStorage, $rootScope) {

	/*
			timeFormat:  {"HH:mm:ss" | "hh:mm:ss a"}
	*/

	var getAllPrefs = function() {
		return $localStorage.prefs;
	};

	var getPref = function(which) {
		if ($localStorage.prefs[which] !== undefined) {
			return $localStorage.prefs[which];
		}
	};

	var setPref = function(key, value) {
		$localStorage.prefs[key] = value;
	};

	var getTimeDisplayFormat = function() {
		if ($localStorage.prefs.timeFormat === undefined) {
			$localStorage.prefs.timeFormat = "HH:mm:ss";
		}
		return $localStorage.prefs.timeFormat;
	};

	var setTimeDisplayFormat = function(format) {
		$localStorage.prefs.timeFormat = format;
	};

	var setDebug = function(debug) {
		$localStorage.debug.status = debug;
		// TODO:  do we need this?  or just read from prefServices?
		$rootScope.debug = $localStorage.debug.status;
		$rootScope.debugStatusChange = true;
	};

	var isDebug = function() {
		return $localStorage.debug.status;
	};

	var setDebugTime = function(time) {
		$localStorage.debug.time = time;
		$rootScope.debugTime = time;
		$rootScope.debugStatusChange = true;
	};

	var getDebugTime = function() {
		return $localStorage.debug.time;
	};

	var speedUpMode = function() {
		return $localStorage.debug.speedUpMode;
	};

	var setSpeedUpMode = function(enabled) {
		$localStorage.debug.speedUpMode = enabled;
	};

	var firstRun = function() {
		return $localStorage.userdata.firstRun;
	};

	var setFirstRun = function(which) {
		$localStorage.userdata.firstRun = which;
	};

	return {
		getAllPrefs: getAllPrefs,
		setPref: setPref,
		getPref: getPref,
		firstRun: firstRun,
		setFirstRun: setFirstRun,
		isDebug: isDebug,
		setDebug: setDebug,
		getDebugTime: getDebugTime,
		setDebugTime: setDebugTime,
		speedUpMode: speedUpMode,
		setSpeedUpMode: setSpeedUpMode,
		getTimeDisplayFormat: getTimeDisplayFormat,
		setTimeDisplayFormat: setTimeDisplayFormat
	};
})


.service('dataServices', function($rootScope, $localStorage, $log, prefServices, timeCalcServices) {


	var appInit = function() {
		$log.debug("appInit called on first run.");
		resetUserData();
		// prefServices.setFirstRun(false);
	};

	var resetUserData = function() {
		$log.debug("resetting user data and preferences");
		$rootScope.resetStatusChange = true;
		$localStorage.userdata = {};
		$localStorage.userdata.timers = getSampleTimers();
		$localStorage.userdata.bellschedules = getSampleBellSchedules();
		$localStorage.userdata.roster = getSampleRoster();
		$localStorage.userdata.firstRun = false;
		$localStorage.userdata.timeNotificationList = undefined;
		$localStorage.debug = {};
		$localStorage.debug.status = false;
		$localStorage.debug.speedUpMode = false;
		$localStorage.prefs = {};
		$localStorage.prefs.timeFormat = "HH:mm:ss";
		$localStorage.prefs.dateFormat = "yyyy-mm-dd";
		$localStorage.prefs.selectedBellScheduleName = undefined;
		$localStorage.prefs.selectedBellWithDates = undefined;
	};

	var getSelectedBellScheduleName = function() {
		if ($localStorage.prefs.selectedBellScheduleName === undefined) {
			setSelectedBellScheduleName("Regular");
		}
		return $localStorage.prefs.selectedBellScheduleName;
	};

	var setSelectedBellScheduleName = function(which) {
		if (which !== $localStorage.prefs.selectedBellScheduleName) {
			$rootScope.bellScheduleStatusChange = true;
			$localStorage.prefs.selectedBellScheduleName = which;
			$localStorage.prefs.selectedBellWithDates = undefined;
		}
	};

	var getSelectedBellWithDates = function() {
		return $localStorage.prefs.selectedBellWithDates;
	};

	var setSelectedBellWithDates = function(bellWithDates) {
			$localStorage.prefs.selectedBellWithDates = bellWithDates;
		};

	var getTimers = function() {
		return $localStorage.userdata.timers;
	};

		var getSampleTimers = function() {
			var timersList = [
				{description: "30 minutes", duration: 30, active:false, endTime:"", id:"1"},
				{description: "10 minutes", duration: 10, active:false, endTime:"", id:"2"},
				{description: "1 minute", duration: 1, active:false, endTime:"", id:"3"},
				{description: "20 minutes before end", duration: -20, active:false, endTime:"", id:"4"},
				{description: "10 minutes before end", duration: -10, active:false, endTime:"", id:"5"},
				{description: "2 minutes before end", duration: -2, active:false, endTime:"", id:"6"}
			];
			return timersList;
		};

		var getBellSchedules = function(which, withDates) {
			var bellschedules = $localStorage.userdata.bellschedules;
			if (which === 'all') {
				return bellschedules;
			} else {
				var foundBellSchedule = null;
				for (var bellID in bellschedules) {
					var bell = bellschedules[bellID];
					if (bell.name === which) {
						if (withDates) {
							return calcBellScheduleDates(bell);
						} else {
							return bell;
						}
					}
				}
			}
		};

	/*
			bell schedules store times as HH:mm:ss strings with durations.
			when they are opened in the app, they are converted to Date() objects
	*/

	var getSampleBellSchedules = function() {
		var bellschedules = [
			{name: 'Regular',
				periods: [
					{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 16},
					{period: 1, name: 'Period 1', start: '08:09:00', end: '', duration: 48},
					{period: 2, name: 'Period 2', start: '09:00:00', end: '', duration: 48},
					{period: 3, name: 'Period 3', start: '09:51:00', end: '', duration: 48},
					{period: 4, name: 'Period 4', start: '10:42:00', end: '', duration: 48},
					{period: 5, name: 'Period 5', start: '11:33:00', end: '', duration: 48},
					{period: 6, name: 'Period 6', start: '12:24:00', end: '', duration: 48},
					{period: 7, name: 'Period 7', start: '13:15:00', end: '', duration: 48},
					{period: 8, name: 'Period 8', start: '14:06:00', end: '', duration: 48}
				]},
			{name: 'Extended Advisory',
				periods: [
					{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 40},
					{period: 1, name: 'Period 1', start: '08:33:00', end: '', duration: 45},
					{period: 2, name: 'Period 2', start: '09:21:00', end: '', duration: 45},
					{period: 3, name: 'Period 3', start: '10:09:00', end: '', duration: 45},
					{period: 4, name: 'Period 4', start: '10:57:00', end: '', duration: 45},
					{period: 5, name: 'Period 5', start: '11:45:00', end: '', duration: 45},
					{period: 6, name: 'Period 6', start: '12:33:00', end: '', duration: 45},
					{period: 7, name: 'Period 7', start: '13:21:00', end: '', duration: 45},
					{period: 8, name: 'Period 8', start: '14:09:00', end: '', duration: 45}
				]},
				{name: 'Early Dissmisal',
					periods: [
						{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 16},
						{period: 1, name: 'Period 1', start: '08:09:00', end: '', duration: 21},
						{period: 2, name: 'Period 2', start: '08:33:00', end: '', duration: 21},
						{period: 3, name: 'Period 3', start: '08:57:00', end: '', duration: 30},
						{period: 4, name: 'Period 4', start: '09:30:00', end: '', duration: 30},
						{period: 5, name: 'Period 5', start: '10:03:00', end: '', duration: 30},
						{period: 6, name: 'Period 6', start: '10:36:00', end: '', duration: 30},
						{period: 7, name: 'Period 7', start: '11:09:00', end: '', duration: 21},
						{period: 8, name: 'Period 8', start: '11:33:00', end: '', duration: 21}
					]},
				{name: 'Second Advisory',
					periods: [
						{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 16},
						{period: 1, name: 'Period 1', start: '08:09:00', end: '', duration: 47},
						{period: 2, name: 'Period 2', start: '08:59:00', end: '', duration: 47},
						{period: 3, name: 'Period 3', start: '09:49:00', end: '', duration: 47},
						{period: 4, name: 'Period 4', start: '10:39:00', end: '', duration: 47},
						{period: 5, name: 'Period 5', start: '11:29:00', end: '', duration: 47},
						{period: 6, name: 'Period 6', start: '12:19:00', end: '', duration: 47},
						{period: 7, name: 'Period 7', start: '13:09:00', end: '', duration: 47},
						{period: 8, name: 'Period 8', start: '13:59:00', end: '', duration: 47}
					]},
					{name: 'Debug',
						periods: [
							{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 11},
							{period: 1, name: 'Period 1', start: '08:02:00', end: '', duration: 11},
							{period: 2, name: 'Period 2', start: '08:14:00', end: '', duration: 11},
							{period: 3, name: 'Period 3', start: '08:26:00', end: '', duration: 11}
						]},
					{name: 'Midterms',
						periods: [
							{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 20},
							{period: 2, name: 'Period 2', start: '08:13:00', end: '', duration: 90},
							{period: 5, name: 'Period 5', start: '09:46:00', end: '', duration: 90},
							{period: 3, name: 'Period 3', start: '11:19:00', end: '', duration: 33},
							{period: 4, name: 'Period 4', start: '11:55:00', end: '', duration: 33},
							{period: 6, name: 'Period 6', start: '12:31:00', end: '', duration: 33},
							{period: 7, name: 'Period 7', start: '13:07:00', end: '', duration: 33},
							{period: 8, name: 'Period 8', start: '13:43:00', end: '', duration: 33},
							{period: 1, name: 'Period 1', start: '14:19:00', end: '', duration: 33}
						]},
					{name: 'PM Assembly',
						periods: [
							{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 19},
							{period: 1, name: 'Period 1', start: '08:12:00', end: '', duration: 39},
							{period: 2, name: 'Period 2', start: '08:54:00', end: '', duration: 39},
							{period: 3, name: 'Period 3', start: '09:36:00', end: '', duration: 39},
							{period: 4, name: 'Period 4', start: '10:18:00', end: '', duration: 39},
							{period: 5, name: 'Period 5', start: '11:00:00', end: '', duration: 39},
							{period: 6, name: 'Period 6', start: '11:42:00', end: '', duration: 39},
							{period: 7, name: 'Period 7', start: '12:24:00', end: '', duration: 39},
							{period: 8, name: 'Period 8', start: '13:06:00', end: '', duration: 39},
							{period: 9, name: 'Assembly', start: '13:45:00', end: '', duration: 69}
						]}
				];

		return bellschedules;

	};

	var getRoster = function() {
		return $localStorage.userdata.roster;
	};

	var getSampleRoster = function() {
		var roster = [
			{period: 0, name: 'Advisory 205', room: '220'},
			{period: 1, name: 'Prep', room: ''},
			{period: 2, name: 'Duty', room: ''},
			{period: 3, name: 'CS1 (HS)', room: '220'},
			{period: 4, name: 'WebDev', room: '220'},
			{period: 5, name: 'Lunch', room: ''},
			{period: 6, name: 'CS1 (MS)', room: '220'},
			{period: 7, name: 'APCS', room: '220'},
			{period: 8, name: 'Discrete Math', room: '220'}
		];
		return roster;
	};


	var getCurrentTime = function() {
		var result = new Date();
		if (prefServices.isDebug())
		{
			var elapsed = new Date().getTime() - $rootScope.appStartTime.getTime();
			if (prefServices.speedUpMode()) {
				elapsed *= 100;
			}
			result = new Date(prefServices.getDebugTime().getTime() + elapsed);
			if (prefServices.speedUpMode()) {
				result.setSeconds(0);
			}
		}
		return result;
	};

	var calcBellScheduleDates = function(bellschedule) {
		var periodList = bellschedule.periods;
		for (var periodID in periodList) {
			var p = periodList[periodID];

			// on first call, no dates in the period object
			if (!(p.start instanceof Date)) {
				p.start = timeCalcServices.getTimeFromString(p.start, getCurrentTime());
			}
			p.end = timeCalcServices.addToTimeString(p.start, p.duration, true, getCurrentTime());
		}
		return bellschedule;
	};

	var setTimeNotificationList = function(theList) {
		$localStorage.userdata.timeNotificationList = theList;
	};

	var getTimeNotificationList = function() {
		if ($localStorage.userdata.timeNotificationList === undefined) {
			setTimeNotificationList(timeCalcServices.getTimeNotificationList(getSelectedBellWithDates()));
		}
		return $localStorage.userdata.timeNotificationList;
	};

	var getCurrentWarningNotificationList = function() {
		return $localStorage.userdata.currentWarningList;
	};

	var setCurrentWarningNotificationList = function(theList) {
		$localStorage.userdata.currentWarningList = theList;
	};


	return {
		getBellSchedules: getBellSchedules,
		getRoster: getRoster,
		getTimers: getTimers,
		getCurrentTime: getCurrentTime,
		getSelectedBellScheduleName: getSelectedBellScheduleName,
		setSelectedBellScheduleName: setSelectedBellScheduleName,
		setSelectedBellWithDates: setSelectedBellWithDates,
		getSelectedBellWithDates: getSelectedBellWithDates,
		setTimeNotificationList: setTimeNotificationList,
		getTimeNotificationList: getTimeNotificationList,
		appInit: appInit,
		resetUserData: resetUserData,
		getCurrentWarningNotificationList: getCurrentWarningNotificationList,
		setCurrentWarningNotificationList: setCurrentWarningNotificationList
	};
})

.service('dateTimeServices', function($filter, dataServices) {

	var dayOfWeekString = function() {
		var date = $filter('date')(dataServices.getCurrentTime(), 'EEE').toUpperCase();
		return date;
	};

	var dateString = function() {
		var date = $filter('date')(dataServices.getCurrentTime(), 'MMM dd').toUpperCase();
		return date;
	};

	var timeString = function() {
		var date = $filter('date')(dataServices.getCurrentTime(), 'HH:mm:ss');
		return date;
	};

	return {
		dayOfWeekString: dayOfWeekString,
		dateString: dateString,
		timeString: timeString
	};

})

.service('timeCalcServices', function(dateFilter, $log) {



	var getTimeNotificationList = function(bell) {
		var times = [];
		for (var periodID in bell.periods) {
			var period = bell.periods[periodID];
			times.push(period.start);
			times.push(period.end);
		}
		return times;
	};


	/*
		returns TRUE if t1 < t2, where t1 and t2 are specified
		as strings in the form HH:mm:ss
	*/
	var isBeforeDates = function(d1, d2) {
		return d1.getTime() < d2.getTime();
	};

	var isEqualDates = function(d1, d2) {
		return d1.getTime() === d2.getTime();
	};

	var isEqualDatesToMinutes = function(d1, d2) {
		return ((d1.getHours() === d2.getHours()) &&
			(d1.getMinutes() === d2.getMinutes()));
	};

	var isLessThanOrEqualDates = function(d1, d2) {
			return isEqualDatesToMinutes(d1, d2) || isBeforeDates(d1, d2);
	};

	/*
			converts a string in the form HH:mm to a
			javascript Date() object
	*/
	var getTimeFromString = function(timeString, currentTime) {
		// $log.debug('getTimeFromString(' + timeString +')');
		var timeStrings = timeString.split(':');
		currentTime.setHours(timeStrings[0]);
		currentTime.setMinutes(timeStrings[1]);
		currentTime.setSeconds(timeStrings[2]);
		return currentTime;
	};

	/*
		adds a number of minutes to a time,
		specified as a HH:mm string OR as a Date object.

		returnDate = TRUE returns a Date() object,
		otherwise return a string in HH:mm:ss format.
	*/
	var addToTimeString = function(theTime, minutes, returnDate, currentTime) {
		if (!(theTime instanceof Date)) {
			theTime = getTimeFromString(theTime, currentTime);
		}
		var resultTime = new Date(theTime.getTime() + minutes * 60000);
		if (returnDate) {
			return resultTime;
		} else {
			return dateFilter(resultTime, "HH:mm:ss");
		}
	};

	/*
	iterates through the current bellschedule.  For each period,
	calculate the start and end times, and check whether:
		* start < current < end (meaning we are in this period -- return it)
		* end < current < next period start (meaning we are in passing time -- return the next period).
		Returns an object consisting of
		{status:  'some status message', period: the array representing the appropriate period}
	*/
	var calcBellUsingDates = function(bellschedule, timeNow) {
		$log.debug('calcBellUsingDates:  bell -> ' + bellschedule + '; timeNow -> ' + timeNow);
		// gets the array of periods from the bellschedule object
		var periods = bellschedule.periods;
		var foundPeriod = {status: 'not during school hours', period: null};
		// var timeNowString = dateFilter(timeNow, "HH:mm:ss");
		var passingTime = false;
		var duringSchool = false;
		// $log.debug("calcBell:  current time = " + timeNowString);
		for (var periodID = 0; periodID < periods.length; periodID++) {
			var p = periods[periodID];
			var periodStart = p.start;
			var periodEnd = p.end;
			// $log.debug('checking ' + periodID + ': ' + periodStart + " - " + periodEnd);
			if (periodID < periods.length - 1) {
				var nextID = periodID + 1;
				var nextPeriodStart = periods[nextID].start;
				// $log.debug(nextPeriodStart);
				passingTime = isBeforeDates(periodEnd, timeNow) && isBeforeDates(timeNow, nextPeriodStart);
				if (passingTime || isEqualDates(timeNow, periodEnd)) {
					foundPeriod.status = 'passing time';
					foundPeriod.period = periods[periodID + 1];	// passing time!
				}
			}
			if (!passingTime) {
				duringSchool = isBeforeDates(periodStart, timeNow) && isBeforeDates(timeNow, periodEnd);
				if (duringSchool  || isEqualDates(timeNow, periodStart)) {
						foundPeriod.status = 'during school';
						foundPeriod.period = periods[periodID];
				}
			}
		}
		return foundPeriod;
	};

	var getRosteredClass = function(period, roster) {
		var periodNumber = period.period;
		var foundClass;
		for (var courseID in roster) {
			var rosteredPeriodID = roster[courseID].period;
			if (rosteredPeriodID === periodNumber) {
				return roster[courseID];
			}
		}
		return foundClass;
	};

	var countdownFormatString = function(t) {
		var days, hours, minutes, seconds;
		// huh?  this is returning -1 for day?  given an input of -2783?
		if (t < 0) { t *= -1; }
		days = Math.floor(t / 86400);
		// $log.debug("cdfs days: " + days);
		t -= days * 86400;
		hours = Math.floor(t / 3600) % 24;
		t -= hours * 3600;
		minutes = Math.floor(t / 60) % 60;
		t -= minutes * 60;
		seconds = t % 60;
		if (days < 10) { days = '0' + days;}
		if (hours < 10) { hours = '0' + hours;}
		if (minutes < 10) { minutes = '0' + minutes;}
		if (seconds < 10) { seconds = '0' + seconds;}
		return [
			hours,
			minutes,
			seconds
		].join(':');
	};

	return {
		getTimeNotificationList: getTimeNotificationList,
		addToTimeString: addToTimeString,
		calcBellUsingDates: calcBellUsingDates,
		getTimeFromString: getTimeFromString,
		getRosteredClass: getRosteredClass,
		isBeforeDates: isBeforeDates,
		countdownFormatString: countdownFormatString,
		isEqualDatesToMinutes: isEqualDatesToMinutes,
		isLessThanOrEqualDates: isLessThanOrEqualDates
	};
});
