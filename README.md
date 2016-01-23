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
      -
## 2016-01-14-1927
  * branch time_notifications_refactor done!  
  * ISSUE: the timers are still *slighly* off...
  * new branch debug_toggle
    - goal:  allow setting the debug time and toggle in the UI.

## 2016-01-15-0619
  * BUG:  date doesn't refresh when app re-entered next day!
    - FIXED:  added $ionicView.$on function to refresh the UI
    - see:  http://www.gajotres.net/understanding-ionic-view-lifecycle/
  * TODO:  check full data lifecycle....  
  * STATUS:  done.  

## 2016-01-17-0919
  * GRRRRR my stupidity on git erased some of this README and other work I had done
    on services and display to toggle the pressed state on the timers.  GRRRRR
  * created branch time_calc_refactor

  * check out:  https://www.airpair.com/angularjs/posts/top-10-mistakes-angularjs-developers-make

## 2016-01-19-1157
  * DONE time calc refactoring.  committed, pulled, and deleted.
  * CREATE:  new branch timers
  * Note.  Scope of variables used in ng directives seems to be scope?
  * one issue:  briefly shows NANANA before the scope updates.....
  - solution might be to update ng-show directive in the function call once the data is created rather than immediately
  * TODO:
    - style the lists
    - have alarms ring when done?
    - add a callback to the counttimer directive?  
  * added ng-cordova (bower install ngCordova)
    - this is an angular wrapper for cordova....
  * added ng-cordova.min.js to index.html
  * installed plugin for notifications
    - see:  https://devdactic.com/local-notifications-ionic/
    - cordova plugin add de.appplant.cordova.plugin.local-notification
    - note:  only installed android b/c i'm working in windows....
  * created a new branch timer_notifications
## 2016-01-20-0949
  * created new branch off of timers:  choose_bellschedule
    - added new bellschedules and refined data structure in services.js to return the bell schedules.
    - DONE
    - TODO:  
      - style the spans in display.html
      - doesn't load immediately?  takes two pushes -- FIXED
## 2016-01-20-1808
  * starting using mantix bug tracking....
  * started branch off timers:  refactor_counttimer_0001 (SEE:  http://havalinasw.com/bugz/view.php?id=1)
  * still messed up.... :-(ch)
  * FIXED:  see resolution in bugz above
## 2016-01-22-0633
  * back to work on timers and notifications
  * idea is to use local notifications
  * TODO:  refactor this readme..... this doc is supposed to be the public front of the project -- create a separate programming log

## 2016-01-23-1819 THE BLIZZARD
  * 
