# havaschedule-ionic
Ionic deploy

2016-01-13-0753
  BUG:  doesn't refresh the period according the current time.  Only refreshes when app re-launched
    TODO:
      - refactor DisplayCtl to create a new ui update function.  
      - brute force method:  every time the current time changes, broadcast that.  Listen for the change and
          call calcBell and then updateUI based on that.  updateUI only needs to take the activePeriod.

          OK I think I did this.  but how to test?
      - need to change getCurrentTime in services.js somehow so that even the debug time increments...

  BUG:  doesn't check seconds.  If time = 7:50 and class start = 7:50, doesn't update class until 7:51.  If
        the time is exactly equal to the start or tend time, then it sets status to 'non school hours'.

          Still a bug with checking equal to passing time.  check....

          OK solved this.  But the time "broadcast" system is a mess.  Need to refactor.  Idea:  perhaps an array
          of time triggers that should trigger a periodUIUpdate (all period end times and beginning times)  then do
          the updates as close to the issuing time entity as possible (dataServices.getCurrenTime())


  TODO:  refactor the statuses into a constant or enumeration?

  TODO:   check $scope usage throughout.  only controllers create a new $scope.  Thus DisplayCtl creates
          a $scope that the display.html can use.  
          See:  https://toddmotto.com/all-about-angulars-emit-broadcast-on-publish-subscribing/
