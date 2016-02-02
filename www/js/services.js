angular.module('havaschedule.services', [])

.factory('dataServices', function($rootScope, $localStorage, $log) {

	var getTimers = function() {
		var result;
		var timersList = [
			{description: "30 minutes", duration: 30, active:false, endTime:"", id:"1"},
			{description: "10 minutes", duration: 10, active:false, endTime:"", id:"2"},
			{description: "1 minute", duration: 1, active:false, endTime:"", id:"3"},
			{description: "20 minutes before end", duration: -20, active:false, endTime:"", id:"4"},
			{description: "10 minutes before end", duration: -10, active:false, endTime:"", id:"5"},
			{description: "2 minutes before end", duration: -2, active:false, endTime:"", id:"6"}
		];
		if ($localStorage.prefs.sampledata === true) {
			result = timersList;
		}
		else {
			result = $localStorage.userdata.timers;
		}

		return result;
	};

	/*
			bell schedules store times as HH:mm:ss strings with durations.
			when they are opened in the app, they are converted to Date() objects
	*/

	var getBellSchedules = function(which) {
		var result;
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
							{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 0.5},
							{period: 1, name: 'Period 1', start: '07:51:00', end: '', duration: 0.5},
							{period: 2, name: 'Period 2', start: '07:52:00', end: '', duration: 0.5},
							{period: 3, name: 'Period 3', start: '07:53:00', end: '', duration: 0.5}
						]},
					{name: 'Midterms',
						periods: [
							{period: 0, name: 'Advisory', start: '07:50:00', end: '', duration: 20},
							{period: 8, name: 'Period 8', start: '08:13:00', end: '', duration: 90},
							{period: 4, name: 'Period 4', start: '09:46:00', end: '', duration: 90},
							{period: 3, name: 'Period 3', start: '11:19:00', end: '', duration: 33},
							{period: 5, name: 'Period 5', start: '11:55:00', end: '', duration: 33},
							{period: 6, name: 'Period 6', start: '12:31:00', end: '', duration: 33},
							{period: 7, name: 'Period 7', start: '13:07:00', end: '', duration: 33},
							{period: 1, name: 'Period 1', start: '13:43:00', end: '', duration: 33},
							{period: 2, name: 'Period 2', start: '14:19:00', end: '', duration: 33}
						]}
				];
				if ($localStorage.prefs.sampledata === true) {
					result = bellschedules;
				}
				else {
					result = $localStorage.userdata.bellschedules;
				}

		if (which === 'all') {
			return result;
		} else {
			var foundBellSchedule = null;
			for (var bellID in result) {
				var bell = bellschedules[bellID];
				if (bell.name === which) {
					return bell;

				}
			}
		return result;
		}
	};


	var getRoster = function() {
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

	var setDebug = function(debug) {
			$rootScope.debug = debug;
	};

	var isDebug = function() {
		return $rootScope.debug;
	};

	var setDebugTime = function(time) {
			$rootScope.debugTime = time;
	};

	var getDebugTime = function() {
		return $rootScope.debugTime;
	};

	var getCurrentTime = function() {
		var result = new Date();
		var elapsed = new Date().getTime() - $rootScope.appStartTime.getTime();
		if (isDebug())
		{
			result = new Date(getDebugTime().getTime() + elapsed);
		}
		return result;
	};

	return {
		getBellSchedules: getBellSchedules,
		getRoster: getRoster,
		getTimers: getTimers,
		getCurrentTime: getCurrentTime,
		isDebug: isDebug,
		setDebug: setDebug,
		getDebugTime: getDebugTime,
		setDebugTime: setDebugTime
	};
})

.factory('dateTimeServices', function($filter, dataServices) {

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

.factory('timeCalcServices', function(dataServices, dateFilter) {

	var getBellScheduleWithDates = function(which) {
		var bellschedule = dataServices.getBellSchedules(which);
		// bellschedule[0]
		var periodList = bellschedule.periods;
		for (var periodID in periodList) {
			var p = periodList[periodID];
			var endTimeString = addToTimeString(p.start, p.duration);
			p.start = getTimeFromString(p.start);
			p.end = getTimeFromString(endTimeString);
		}
		return bellschedule;
	};

	var getTimeNotificationList = function(which) {
		var bell = getBellScheduleWithDates(which);
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

	/*
			converts a string in the form HH:mm to a
			javascript Date() object
	*/
	var getTimeFromString = function(timeString) {
		// $log.debug('getTimeFromString(' + timeString +')');
		var timeStrings = timeString.split(':');
		var tDate = dataServices.getCurrentTime();
		tDate.setHours(timeStrings[0]);
		tDate.setMinutes(timeStrings[1]);
		tDate.setSeconds(timeStrings[2]);
		return tDate;
	};

	/*
		adds a number of minutes to a time,
		specified as a HH:mm string.

		returnDate = TRUE returns a Date() object,
		otherwise return a string in HH:mm:ss format.
	*/
	var addToTimeString = function(timeString, minutes, returnDate) {
		// $log.debug('addToTimeString(' + timeString + ', ' + minutes + ')');
		var theTime = getTimeFromString(timeString);
		var resultTime = new Date(theTime.getTime() + minutes * 60000);
		// $log.debug('addToTimeString result ->' + resultTime);
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
	var calcBellUsingDates = function(bellschedule) {
		var timeNow = dataServices.getCurrentTime();
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
				foundClass = roster[courseID];
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
		getBellScheduleWithDates: getBellScheduleWithDates,
		calcBellUsingDates: calcBellUsingDates,
		getTimeFromString: getTimeFromString,
		getRosteredClass: getRosteredClass,
		isBeforeDates: isBeforeDates,
		countdownFormatString: countdownFormatString
	};
})

;
