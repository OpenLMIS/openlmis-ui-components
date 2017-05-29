5.1.0 / Current Snapshot
========================

New functionality added in a backwards-compatible manner:

* [OLMIS-2476](https://openlmis.atlassian.net/browse/OLMIS-2476): Simplified select implementation with select2

Improvements:

* [OLMIS-2444](https://openlmis.atlassian.net/browse/OLMIS-2444): Added new "success" button class.

5.0.1 / 2017-05-26
==================

Bug fixes:

* [OLMIS-2329](https://openlmis.atlassian.net/browse/OLMIS-2329): Removed initial timeout from the saving indicator
* [OLMIS-2224](https://openlmis.atlassian.net/browse/OLMIS-2224): Offline flag is now stored in local storage
* [OLMIS-2328](https://openlmis.atlassian.net/browse/OLMIS-2328): Fixed issues with resizing on tables with colspan and sticky columns
* [OLMIS-2489](https://openlmis.atlassian.net/browse/OLMIS-2489): Form error will now be properly displayed even if the translation can't be found
* [OLMIS-2471](https://openlmis.atlassian.net/browse/OLMIS-2471): Aligned locale selection and logout button.

5.0.0 / 2017-05-08
==================

Compatibility breaking changes:

* [OLMIS-2355](https://openlmis.atlassian.net/browse/OLMIS-2355): Inncorect working sticky columns - large gap in tables
  * Columns that are supposed to be sticked to the right side require additional class.

New functionality added in a backwards-compatible manner:

* Added progress bar component.
* [OLMIS-2037](https://openlmis.atlassian.net/browse/OLMIS-2037): Focused auto-saving behavior notifications
  * Added auto-saving component.
* [OLMIS-2045](https://openlmis.atlassian.net/browse/OLMIS-2045): Wrap datepicker in popover element
* [OLMIS-2164](https://openlmis.atlassian.net/browse/OLMIS-2164): Change screen after requisition action
  * Added StateTrackerService.

Bug fixes and performance improvements which are backwards-compatible:

* Fixed a bug with loading modal not closing sometimes.
* Improved select component.
* [OLMIS-2142](https://openlmis.atlassian.net/browse/OLMIS-2142): A slight gap between the toolbar and the edge of the screen
* [OLMIS-2291](https://openlmis.atlassian.net/browse/OLMIS-2291): The message of "Showing xx item(s) out of xx total" didn't works correctly on the physical inventory page (also on the requisition page).
