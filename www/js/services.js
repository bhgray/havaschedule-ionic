angular.module('havaschedule.services', [])

.factory('dataServices', function() {
		var getBellSchedules = function() {
			var bellschedule = [{name: 'Regular'},
			{periods: [
				{period: 0, name: 'Advisory', start: '07:50', duration: 16},
				{period: 1, name: 'Period 1', start: '08:09', duration: 48},
				{period: 2, name: 'Period 2', start: '09:00', duration: 48},
				{period: 3, name: 'Period 3', start: '09:51', duration: 48},
				{period: 4, name: 'Period 4', start: '10:42', duration: 48},
				{period: 5, name: 'Period 5', start: '11:33', duration: 48},
				{period: 6, name: 'Period 6', start: '12:24', duration: 48},
				{period: 7, name: 'Period 7', start: '13:15', duration: 48},
				{period: 8, name: 'Period 8', start: '14:06', duration: 48}
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
		return false;
	};

	var getCurrentTime = function() {
		if (isDebug())
		{
			return new Date(2016, 01, 11, 11, 02, 0);
		} else {
			return new Date();
		}
	};

	return {
		getBellSchedules: getBellSchedules,
		getRoster: getRoster,
		getCurrentTime: getCurrentTime,
		isDebug: isDebug
};
})

.factory('dateTimeServices', function($filter, dataServices) {

	var dayOfWeekString = function(currentDateTime) {
		// var d = new Date();
		var date = $filter('date')(currentDateTime, 'EEE').toUpperCase();
		return date;
	};

	var dateString = function(currentDateTime) {
		// var d = new Date();
		var date = $filter('date')(currentDateTime, 'MMM dd').toUpperCase();
		return date;
	};

	var timeString = function(currentDateTime) {
		// var d = new Date();
		var date = $filter('date')(currentDateTime, 'HH:mm:ss');
		return date;
	};

	return {
		dayOfWeekString: dayOfWeekString,
		dateString: dateString,
		timeString: timeString
	};

})

.factory('timeCalcServices', function(dataServices) {
	// see:  http://tools.ietf.org/html/rfc2822#section-3.3 for date-time parse format; I give up for now...
	var isBefore = function(t1String, t2String) {

		var currentDateTime = dataServices.getCurrentTime();
		var t1Date = getTimeFromString(t1String, currentDateTime);
		var t2Date = getTimeFromString(t2String, currentDateTime);

		if (t1Date.getTime() < t2Date.getTime()) {
			return true;
		} else {
			return false;
		}
	};

	var getTimeFromString = function(timeString) {
		// console.log('getTimeFromString(' + timeString + ')');
		var timeStrings = timeString.split(':');
		// console.log('getTimeFromString uses ' + timeStrings);
		var tDate = dataServices.getCurrentTime();
		// console.log('getTimeFromString date assumed:  ' + tDate);
		tDate.setHours(timeStrings[0]);
		tDate.setMinutes(timeStrings[1]);
		tDate.setSeconds('0');
		// console.log('getTimeFromString date result:  ' + tDate);

		return tDate;
	};

	var addToTimeString = function(timeString, minutes) {
		// console.log('addToTimeString(' + timeString + ', ' + minutes + ')');
		var currentDateTime = dataServices.getCurrentTime();
		var theTime = getTimeFromString(timeString, currentDateTime);
		theTime.setMinutes(theTime.getMinutes() + minutes);
		return theTime.getHours() + ':' + theTime.getMinutes();
	};

	var calcBell = function(bellschedule) {
		var currentDateTime = dataServices.getCurrentTime();
		var periods = bellschedule[1].periods;

		var foundPeriod;
		var timeNow = currentDateTime;
		var timeNowMinutes = timeNow.getMinutes();
		if(timeNowMinutes < 10) {
			timeNowMinutes = '0' + timeNowMinutes;
		}
		var timeNowString = timeNow.getHours() + ':' + timeNowMinutes;

		for (var periodID in periods) {
			var periodStart = periods[periodID].start;
			var periodDuration = periods[periodID].duration;
			// console.log(periodStart + " + " + periodDuration);
			var periodEnd = addToTimeString(periodStart, periodDuration, currentDateTime);
			// console.log(periodStart + " - " + periodEnd);

			if (isBefore(periodStart, timeNowString, currentDateTime)) {
				if (isBefore(timeNowString, periodEnd, currentDateTime)) {
					foundPeriod = periods[periodID];
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
		return [
			hours,
			minutes,
			seconds
		].join(':');
	};

	return {
		isBefore: isBefore,
		addToTimeString: addToTimeString,
		calcBell: calcBell,
		getTimeFromString: getTimeFromString,
		getRosteredClass: getRosteredClass,
		countdownFormatString: countdownFormatString
	};
});
