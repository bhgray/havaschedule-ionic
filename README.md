# havaschedule-ionic

## 2016-01-13-0753
  * BUG:  doesn't refresh the period according the current time.  Only refreshes when app re-launched
    * TODO:
      - refactor DisplayCtl to create a new ui update function.  
      - brute force method:  every time the current time changes, broadcast that.  Listen for the change and
          call calcBell and then updateUI based on that.  updateUI only needs to take the activePeriod.

      - OK I think I did this.  but how to test?
      - need to change getCurrentTime in services.js somehow so that even the debug time increments...

  * BUG:  doesn't check seconds.  If time = 7:50 and class start = 7:50, doesn't update class until 7:51.  If the time is exactly equal to the start or tend time, then it sets status to 'non school hours'
      - Still a bug with checking equal to passing time.  check....

      - OK solved this.  But the time "broadcast" system is a mess.  Need to refactor.  Idea:  perhaps an array of time triggers that should trigger a periodUIUpdate (all period end times and beginning times)  then do the updates as close to the issuing time entity as possible (dataServices.getCurrenTime())

  * BUG:  passing time reverses the countdowns....  and fails to hide the class card;  
    - FIXED:  hid the class card.  the way passing time mode sends in the times still probably reverses the countdown, but we don't care bc the card is not relevant/shown

  * TODO:  refactor the statuses into a constant or enumeration?

  * TODO:   check $scope usage throughout.  only controllers create a new $scope.  Thus DisplayCtl creates a $scope that the display.html can use.

  see this site:  https://toddmotto.com/all-about-angulars-emit-broadcast-on-publish-subscribing/

## 2016-01-14-0831

  * created branch time_notifications_refactor to refine the ui update system....
    - new dataServices method to create an array of Date objects with each start and end time of a period in the current bell schedule.  The UI only has to be updated (calcBell style!) at those times.
      - ?? how to create a singleton -- don't want to recreate the times notification array every second!
      - TODO: don't love this in the directive.  Seems more appropriate for the service to watch the time, then broadcast UI updates from there.... future refactoring?
      - TODO:  consider using moment.js in future refactoring?
      - STATUS:  findTimeInArray in directives.js doesn't work... 
