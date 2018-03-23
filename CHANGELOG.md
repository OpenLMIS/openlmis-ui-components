5.2.1 / In Progress
===================

New functionality added in a backwards-compatible manner:
* [OLMIS-3108:](https://openlmis.atlassian.net/browse/OLMIS-3108) Updated to use dev-ui v7 transifex build process
* [OLMIS-2656:](https://openlmis.atlassian.net/browse/OLMIS-2656) Added filter component.
* [OLMIS-3738:](https://openlmis.atlassian.net/browse/OLMIS-3738) Added horizontal scrollbar to the table container.
* [OLMIS-3917:](https://openlmis.atlassian.net/browse/OLMIS-3917) Added optional title to confirm modal.
* [OLMIS-3995:](https://openlmis.atlassian.net/browse/OLMIS-3995) Added OpenLMISRepository and OpenLMISRepositoryImpl classes.
* [OLMIS-3166:](https://openlmis.atlassian.net/browse/OLMIS-3166) Added openlmisAppCache component.
* [OLMIS-3826](https://openlmis.atlassian.net/browse/OLMIS-3826): Added facility filter to display formatted facilities.
* [OLMIS-4127](https://openlmis.atlassian.net/browse/OLMIS-4127): Added util function to convert epoch in milliseconds to ISO-formatted date string.
* [OLMIS-3779:](https://openlmis.atlassian.net/browse/OLMIS-3779): Added number of flters to the filter button.

Improvements:
* [OLMIS-3876:](https://openlmis.atlassian.net/browse/OLMIS-3876) Applied filter component to all forms in an openlmis-table-container
* [OLMIS-3563:](https://openlmis.atlassian.net/browse/OLMIS-3563) Added moving ng-if from input to wrapper element.
* [OLMIS-3080:](https://openlmis.atlassian.net/browse/OLMIS-3080) Removed warning modal.
* [OLMIS-2695:](https://openlmis.atlassian.net/browse/OLMIS-2695) Following improvements to components:
** Added 'add days to date' method to date utils.
** Added disabled attribute to datepicker.
** Fixed changing page in pagination component to not reload parent state.
* [OLMIS-3326:](https://openlmis.atlassian.net/browse/OLMIS-3326) The notificationService will now wait for the loadingModalService to close before displaying any notification
* [OLMIS-3905:](https://openlmis.atlassian.net/browse/OLMIS-3905) Add min-width to select dropdown
* [OLMIS-3908:](https://openlmis.atlassian.net/browse/OLMIS-3908) Reduced vertical space in page header
* [OLMIS-4195:](https://openlmis.atlassian.net/browse/OLMIS-4195) Added empty-row directive
* [OLMIS-4026:](https://openlmis.atlassian.net/browse/OLMIS-4026) Updated openlmis-table to display borders.
* [OLMIS-4143](https://openlmis.atlassian.net/browse/OLMIS-4143): Updated openlmis-sort to align elements in the sort component.

Bug fixes:
* [OLMIS-3806:](https://openlmis.atlassian.net/browse/OLMIS-3806): Fixed date picker to not change selected date
* [OLMIS-3909:](https://openlmis.atlassian.net/browse/OLMIS-3909): Fixed scrollbar hiding underneath sticky columns
* [OLMIS-4195:](https://openlmis.atlassian.net/browse/OLMIS-4195): Forms styled with .openlmis-table-container will now flex to the match their parents
5.2.0 / 2017-11-09
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-3182:](https://openlmis.atlassian.net/browse/OLMIS-3182) Added openlmis-table-pane that implements high performance table rendering for large data tables.
* [OLMIS-2655:](https://openlmis.atlassian.net/browse/OLMIS-2655) Added sort control component.
* [OLMIS-3462:](https://openlmis.atlassian.net/browse/OLMIS-3462) Added debounce option for inputs.
* [OLMIS-3199:](https://openlmis.atlassian.net/browse/OLMIS-3199) Added PouchDB.

New functionality:
* Added modalStateProvider to ease modal state defining

Bug fixes:
* [OLMIS-3248](https://openlmis.atlassian.net/browse/OLMIS-3248): Added missing message for number validation.
* [OLMIS-3170](https://openlmis.atlassian.net/browse/OLMIS-3170): Fixed auto resize input controls.
* [OLMIS-3500](https://openlmis.atlassian.net/browse/OLMIS-3500): Fixed a bug with background changing color when scrolling.

Improvements:

* [OLMIS-3114:](https://openlmis.atlassian.net/browse/OLMIS-3114) Improved table keyboard accessibility
** Made table scroll if focused cell is off screen
** Wrapped checkboxes in table cells automatically if they don't have a label
* Modals now have backdrop and escape close actions disabled by default. Can by overridden by adding 'backdrop' and 'static' properties to the dialog definition.
* Extended stateTrackerService with the ability to override previous state parameters and pass state options.
* Updated dev-ui version to 6.
* [OLMIS-3359:](https://openlmis.atlassian.net/browse/OLMIS-3359) Improved the way offline is detected.

5.1.1 / 2017-09-01
========================

New functionality added in a backwards-compatible manner:

* [OLMIS-2978:](https://openlmis.atlassian.net/browse/OLMIS-2978) Made sticky table element animation more performant.
* [OLMIS-2573:](https://openlmis.atlassian.net/browse/OLMIS-2573) Re-worked table form error messages to not have multiple focusable elements.
* [OLMIS-1693:](https://openlmis.atlassian.net/browse/OLMIS-1693) Added openlmis-invalid and error message documentation.
* [OLMIS-249:](https://openlmis.atlassian.net/browse/OLMIS-249) Datepicker element now allows translating day and month names.
* [OLMIS-2817:](https://openlmis.atlassian.net/browse/OLMIS-2817) Added new file input directive.
* [OLMIS-3001:](https://openlmis.atlassian.net/browse/OLMIS-3001) Added external url run block, that allows opening external urls.

Bug fixes:
* [OLMIS-3088:](https://openlmis.atlassian.net/browse/OLMIS-3088) Re-implemented tab error icon.
* [OLMIS-3036:](https://openlmis.atlassian.net/browse/OLMIS-3036) Cleaned up and formalized input-group error message implementation.
* [OLMIS-3042:](https://openlmis.atlassian.net/browse/OLMIS-3042) Updated openlmis-invalid and openlmis-popover element compilation to fix popovers from instantly closing.
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
