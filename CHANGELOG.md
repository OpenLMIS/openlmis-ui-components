5.0.1 / Coming soon
==================

Bug fixes

* [OLMIS-2329](https://openlmis.atlassian.net/browse/OLMIS-2329): Requisition calculated fields are calculated only for current page
  * Removed initial timeout from the saving indicator
* [OLMIS-2224](https://openlmis.atlassian.net/browse/OLMIS-2224): Offline flag is now stored in local storage
* [OLMIS-2328](https://openlmis.atlassian.net/browse/OLMIS-2328): Fixed issues with resizing on tables with colspan and sticky columns

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
