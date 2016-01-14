angular.module('havaschedule.services', [])

.constant('FOUND_PERIOD', {'PASSING_TIME': '-2', 'NOT_SCHOOL_HOURS':-1})

.factory('dataServices', function($rootScope) {
		var getBellSchedules = function() {
			var bellschedule = [{name: 'Regular'},
			{periods: [
				{period: 0, name: 'Advisory', start: '07:50:00', duration: 16},
				{period: 1, name: 'Period 1', start: '08:09:00', duration: 48},
				{period: 2, name: 'Period 2', start: '09:00:00', duration: 48},
				{period: 3, name: 'Period 3', start: '09:51:00', duration: 48},
				{period: 4, name: 'Period 4', start: '10:42:00', duration: 48},
				{period: 5, name: 'Period 5', start: '11:33:00', duration: 48},
				{period: 6, name: 'Period 6', start: '12:24:00', duration: 48},
				{period: 7, name: 'Period 7', start: '13:15:00', duration: 48},
				{period: 8, name: 'Period 8', start: '14:06:00', duration: 48}
			]}
		];
		return bellschedule;
	};

	var getRoster = function() {
		var roster = [
			{period: 0, name: 'Advisory 205', room: '220'},
			{period: 1, name: 'Prep', room: 'n/a'},
			{period: 2, name: 'Duty', room: 'n/a'},
			{period: 3, name: 'CS1 (HS)', room: '220'},
			{period: 4, name: 'WebDev', room: '220'},
			{period: 5, name: 'Lunch', room: 'n/a'},
			{period: 6, name: 'CS1 (MS)', room: '220'},
			{period: 7, name: 'APCS', room: '220'},
			{period: 8, name: 'Discrete Math', room: '220'}
		];
		return roster;
	};

	var isDebug = function() {
		return true;
	};

	var getCurrentTime = function() {
		var result;
		var elapsed = new Date().getTime() - $rootScope.appStartTime.getTime();
		if (isDebug())
		{
			// console.log('getCurrentTime :: elapsed = ' + elapsed);
			result = new Date(2016, 0, 11, 11, 29, 50);
			result = new Date(result.getTime() + elapsed);
		} else {
			result = new Date();
		}
		return result;
	};

	return {
		getBellSchedules: getBellSchedules,
		getRoster: getRoster,
		getCurrentTime: getCurrentTime,
		isDebug: isDebug
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
	// see:  http://tools.ietf.org/html/rfc2822#section-3.3 for date-time parse format; I give up for now...
	/*
		returns TRUE if t1 < t2, where t1 and t2 are specified
		as strings in the form HH:mm:ss
	*/
	var isBefore = function(t1String, t2String) {
		var t1Date = getTimeFromString(t1String);
		var t2Date = getTimeFromString(t2String);
		if (t1Date.getTime() < t2Date.getTime()) {
			return true;
		} else {
			return false;
		}
	};

	var isEqual = function(t1String, t2String) {
		// console.log('isEqual(' + t1String + ',' + t2String + ')');
		var t1Date = getTimeFromString(t1String);
		var t2Date = getTimeFromString(t2String);
		if (t1Date.getTime() === t2Date.getTime()) {
			return true;
		} else {
			return false;
		}
	};

/*
		converts a string in the form HH:mm to a
		javascript Date() object
*/
	var getTimeFromString = function(timeString) {
		// console.log('getTimeFromString(' + timeString +')');
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
*/
	var addToTimeString = function(timeString, minutes) {
		// console.log('addToTimeString(' + timeString + ', ' + minutes + ')');
		var theTime = getTimeFromString(timeString);
		var resultTime = new Date(theTime.getTime() + minutes * 60000);
		// console.log('addToTimeString result ->' + resultTime);
		var result = dateFilter(resultTime, "HH:mm:ss");
		// console.log('addToTimeString returning ' + result);
		return result;
	};

/*
	iterates through the current bellschedule.  For each period,
	calculate the start and end times, and check whether:
		* start < current < end (meaning we are in this period -- return it)
		* end < current < next period start (meaning we are in passing time -- return the next period).
		Returns an object consisting of
		{status:  'some status message', period: the array representing the appropriate period}
*/
	var calcBell = function(bellschedule) {
		var timeNow = dataServices.getCurrentTime();
		// gets the array of periods from the bellschedule object
		var periods = bellschedule[1].periods;
		var foundPeriod = {status: 'not during school hours', period: null};
		var timeNowString = dateFilter(timeNow, "HH:mm:ss");
		var passingTime = false;
		var duringSchool = false;
		// console.log("calcBell:  current time = " + timeNowString);
		for (var periodID = 0; periodID < periods.length; periodID++) {
			var periodStart = periods[periodID].start;
			var periodDuration = periods[periodID].duration;
			var periodEnd = addToTimeString(periodStart, periodDuration);
			// console.log('checking ' + periodID + ': ' + periodStart + " - " + periodEnd);
			if (periodID < periods.length - 1) {
				var nextID = periodID + 1;
				var nextPeriodStart = periods[periodID + 1].start;
				// console.log(nextPeriodStart);
				passingTime = isBefore(periodEnd, timeNowString) && isBefore(timeNowString, nextPeriodStart);
				if (passingTime || isEqual(timeNowString, periodEnd)) {
					foundPeriod = {status: 'passing time', period: periods[periodID + 1]};	// passing time!
				}
			}
			if (!passingTime) {
				duringSchool = isBefore(periodStart, timeNowString) && isBefore(timeNowString, periodEnd);
				if (duringSchool  || isEqual(timeNowString, periodStart)) {
						foundPeriod = {status: 'during school', period: periods[periodID]};
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
			if (rosteredPeriodID == periodNumber) {
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
		// console.log("cdfs days: " + days);
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
		isBefore: isBefore,
		isEqual: isEqual,
		addToTimeString: addToTimeString,
		calcBell: calcBell,
		getTimeFromString: getTimeFromString,
		getRosteredClass: getRosteredClass,
		countdownFormatString: countdownFormatString
	};
});