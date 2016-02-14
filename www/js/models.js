angular.module('havaschedule.models', [])

.factory('Roster', function(RosterEntry){

  function Roster(name, entries) {
    this.name = name;
    this.entries = entries;
  }

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

.factory('BellSchedule', function(Period) {
  function BellSchedule(name, periods) {
    this.name = name;
    this.periods = periods;
  }

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
