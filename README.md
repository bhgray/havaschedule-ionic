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
  * new branch:  0005_ui_refresh

## 2016-01-25-1010 SNOW DAY!
  * branch:  0009_timer_end
    - purpose:  create timer ending behavior.
    - strategy:  
      + create callbacks for counttimer directives?  that way we can swap in any ending behavior the user likes.
      + one shorter way of doing that might be to incorporate a few different update methods and ending methods in the counttimer itself, and select the appropriate one using an attribute....
    - steps:
      + created a new directive "stopwatch" for use in the timers section only.  
      + counttimer:  for period countdown/countup
      + theCurrentTime:  for current date and time in first card
      + stopwatch:  in timers card
    - check out:  https://developer.mozilla.org/en-US/docs/Web/Events
      + adding a new element.on function to catch the showing of the element initially.
      + NO.  can't find the event to bind to.
    - check out:  http://jsfiddle.net/ftfish/KyEr3/
      + idea:  add the counttimer directive dynamically from the controller and configure it appropriately.
      + oy.  this was painful.  had to use the angular.compile function to get the directive to compile dynamically from the controller.  
      + see:  http://www.learn-angularjs-apps-projects.com/AngularJs/dynamically-add-directives-in-angularjs
      + problem:  it keeps adding new ones -- need to be able to toggle in and out....
      + ugly ugly ugly.
    - OK new tactic.  Completely reforming the timers directives....
    - OK ugly ugly.  frustrating.  doing a lot of work on fiddle...
## 2016-01-26-1756 Snow Day 2
  * new tactic: refactor timers completely as a data bound list of timers.
    - display.html refactored
    - problem:  directive not updating in response to the click... how to recompile once the new date is bound to the element?
## 2016-01-27-1808 Wednesday
  * timers work for now... kludgy though
  * should recompile the directive once we add the date attribute, see:   
      - http://stackoverflow.com/questions/26506841/change-angular-directive-element-attribute-dynamically
    BUT....  instead kept a var in the directive and watched for the attribute change to signal a change to that var
  * instead:  re-do the directive and pass in the whole timer.  calculate the endTime in the directive, and keep track of the active field in the timer.  At the end, set active to false, and the display will update automatically.  TODO
    - also:  http://code.tutsplus.com/tutorials/mastering-angularjs-directives--cms-22511
   - and: http://www.sitepoint.com/practical-guide-angularjs-directives/
   - and: http://www.toptal.com/angular-js/angular-js-demystifying-directives
## 2016-01-30-1204-SAT
  * notifications in -- 0010_timer_not
    - they fire SLOWLY!
    - need sound.
    - otherwise good -- the timer disappears at the end, etc...
  * problem with this is that the local notifications plugin won't work in the browser.  installed GapDebug which allows user interaction from the browser as long as phone is connected.  Might be more to do with this with further exploration....
  * see (for gapdebug):  https://www.genuitec.com/products/gapdebug/learning-center/
  * switching for the moment to the problem of logging....  want to be able to use adb.exe and logcat....
  * see:  https://github.com/katzer/cordova-plugin-local-notifications/wiki/Upgrade-Guide
  * and:  https://github.com/katzer/cordova-plugin-local-notifications/wiki/11.-Samples
## 2016-01-31-1507-SUN
  * http://gonehybrid.com/how-to-add-sound-effects-to-your-ionic-app-with-native-audio/
  * installed using ionic plugin add cordova-plugin-nativeaudio
## 2016-02-02-1022-TUE
  * 0022_localstorage using ngStorage
  * new branch "display_redesign" to change the display a bit....
