angular.module('havaschedule.models', [])

.factory('Roster', function(RosterEntry){

  function Roster(name, entries) {
    this.name = name;
    this.entries = entries;
  }

  Roster.prototype.getPeriod = function(number) {
    if (number < this.entries.length) {
      return this.entries[number];
    } else {
        throw "Period number out of bounds exception";
    }
    return undefined;
  };

  /*
      data should be:
      {name: "name", entries: [{RosterEntry1, RosterEntry2, etc...}]}
  */

  Roster.build = function(data) {
    var rosterEntries = [];
    for (var entry in data.entries) {
      rosterEntries.push(RosterEntry.build(data.entries[entry]));
    }
    return new Roster(
      data.name,
      rosterEntries
    );
  };

  return Roster;

})

.factory('RosterEntry', function() {
  function RosterEntry(period, name, location) {
    this.period = period;
    this.name = name;
    this.location = location;
  }

  /*
      data should be:
      {perod: int, name: "name", location: "loc"}
  */

  RosterEntry.build = function(data) {
    return new RosterEntry(
      data.period,
      data.name,
      data.location
    );
  };

  return RosterEntry;
})

.factory('BellSchedule', function(timeCalcServices, Period) {
  function BellSchedule(name, periods) {
    this.name = name;
    this.periods = periods;
  }

  BellSchedule.Prototype.bellScheduleWithDates = function() {
		for (var periodID in this.periods) {
			var p = periodList[periodID];

			// on first call, no dates in the period object
      var currentDate = new Date();
			if (!(p.start instanceof Date)) {
				p.start = timeCalcServices.getTimeFromString(p.start, currentDate);
			}
			p.end = timeCalcServices.addToTimeString(p.start, p.duration, true, currentDate);
		}
		return this;
	};

  BellSchedule.Prototype.getTimeNotificationList = function() {
    var times = [];
    var testDate = this.periods[0].start;
    if (!(testDate instanceof Date) || (!timeCalcServices.isToday(testDate))) {
      this.bellScheduleWithDates();
    }
    for (var periodID in this.periods) {
      var period = this.periods[periodID];
      times.push(period.start);
      times.push(period.end);
    }
    return times;
  };

  BellSchedule.build = function(data) {
    var periodEntries = [];
    for (var period in data.periods) {
      periodEntries.push(Period.build(data.periods[period]));
    }
    return new BellSchedule(
      data.name,
      periodEntries
    );
  };

  return BellSchedule;
})

.factory('Period', function() {
  function Period(period, name, start, end, duration) {
    this.period = period;
    this.name = name;
    this.start = start;
    this.end = end;
    this.duration = duration;
  }

  Period.build = function(data) {
    return new Period(
      data.period,
      data.name,
      data.start,
      data.end,
      data.duration
    );
  };
});
