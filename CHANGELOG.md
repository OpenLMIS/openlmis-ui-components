5.1.1 / Current Snapshot
========================

New functionality added in a backwards-compatible manner:

* [OLMIS-1693:](https://openlmis.atlassian.net/browse/OLMIS-2704) Added openlmis-invalid and error message documentation.
* [OLMIS-249:](https://openlmis.atlassian.net/browse/OLMIS-249) Datepicker element now allows translating day and month names.
* [OLMIS-2817:](https://openlmis.atlassian.net/browse/OLMIS-2817) Added new file input directive.
* [OLMIS-3001:](https://openlmis.atlassian.net/browse/OLMIS-3001) Added external url run block, that allows opening external urls.

Bug fixes:
* [OLMIS-2806:](https://openlmis.atlassian.net/browse/OLMIS-2806) Fixed stock adjustment reasons display order not being respected in the UI.

5.1.0 / 2017-06-22
========================

New functionality added in a backwards-compatible manner:

* [OLMIS-2704:](https://openlmis.atlassian.net/browse/OLMIS-2704) Added style for button inside alert.
* [OLMIS-2657:](https://openlmis.atlassian.net/browse/OLMIS-2572) Added openlmis-cache service to support openlmis-facility-program-select.
* [OLMIS-2572:](https://openlmis.atlassian.net/browse/OLMIS-2572) Added popover-trigger-area attribute to the popover directive which lets user chose whether the whole element or just the added button should trigger the popover.
* [OLMIS-2509:](https://openlmis.atlassian.net/browse/OLMIS-2509) Fixed calculation of the tbody title width, which was causing some strange behavior of the tables.
* [OLMIS-2476:](https://openlmis.atlassian.net/browse/OLMIS-2476) Simplified select implementation with select2
* [OLMIS-2444:](https://openlmis.atlassian.net/browse/OLMIS-2444) Added new "add" button class.
* [OLMIS-2494:](https://openlmis.atlassian.net/browse/OLMIS-2494) Added textarea-required directive
responsible for displaying "This field is required" when form have been submitted, but didn't pass
the validations. Recolored the "This field is required" to red.
* [OLMIS-2548:](https://openlmis.atlassian.net/browse/OLMIS-2548) Added isOpened flag to loadingModalService.
* [OLMIS-2648:](https://openlmis.atlassian.net/browse/OLMIS-2648) Added possibility to customize cancel button message in confirm service, added support for messages with parameters.

Bug fixes:
* [OLMIS-2660:](https://openlmis.atlassian.net/browse/OLMIS-2660) Made "No options available" show when there is unknown option
* [OLMIS-2328:](https://openlmis.atlassian.net/browse/OLMIS-2328) Fixed table resizing bug.

5.0.1 / 2017-05-26
==================

Bug fixes:

* [OLMIS-2329:](https://openlmis.atlassian.net/browse/OLMIS-2329) Removed initial timeout from the saving indicator
* [OLMIS-2224:](https://openlmis.atlassian.net/browse/OLMIS-2224) Offline flag is now stored in local storage
* [OLMIS-2328:](https://openlmis.atlassian.net/browse/OLMIS-2328) Fixed issues with resizing on tables with colspan and sticky columns
* [OLMIS-2489:](https://openlmis.atlassian.net/browse/OLMIS-2489) Form error will now be properly displayed even if the translation can't be found
* [OLMIS-2471:](https://openlmis.atlassian.net/browse/OLMIS-2471) Aligned locale selection and logout button.

5.0.0 / 2017-05-08
==================

Compatibility breaking changes:

* [OLMIS-2355:](https://openlmis.atlassian.net/browse/OLMIS-2355) Inncorect working sticky columns - large gap in tables
  * Columns that are supposed to be sticked to the right side require additional class.

New functionality added in a backwards-compatible manner:

* Added progress bar component.
* [OLMIS-2037:](https://openlmis.atlassian.net/browse/OLMIS-2037) Focused auto-saving behavior notifications
  * Added auto-saving component.
* [OLMIS-2045:](https://openlmis.atlassian.net/browse/OLMIS-2045) Wrap datepicker in popover element
* [OLMIS-2164:](https://openlmis.atlassian.net/browse/OLMIS-2164) Change screen after requisition action
  * Added StateTrackerService.

Bug fixes and performance improvements which are backwards-compatible:

* Fixed a bug with loading modal not closing sometimes.
* Improved select component.
* [OLMIS-2142:](https://openlmis.atlassian.net/browse/OLMIS-2142) A slight gap between the toolbar and the edge of the screen
* [OLMIS-2291:](https://openlmis.atlassian.net/browse/OLMIS-2291) The message of "Showing xx item(s) out of xx total" didn't works correctly on the physical inventory page (also on the requisition page).
