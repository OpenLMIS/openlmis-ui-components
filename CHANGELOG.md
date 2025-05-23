7.2.14 - SNAPSHOT / WIP
==================
New Functionalities:
* [OE-96](https://openlmis.atlassian.net/browse/OE-96): Added quantity unit toggle component
* [OE-108](https://openlmis.atlassian.net/browse/OE-108): Added quantity unit input component

Improvements:
* [OE-98](https://openlmis.atlassian.net/browse/OE-98): Adjusting openlmis-adjustments to display values in doses and packs

7.2.13 / 2025-03-31
==================
New Functionalities:
* [OLMIS-8070](https://openlmis.atlassian.net/browse/OLMIS-8070): Table filter is filtering on enter
* [OLMIS-8126](https://openlmis.atlassian.net/browse/OLMIS-8126): Added function to change date to default format

7.2.12 / 2024-10-31
==================
Bug fixes:
* [OLMIS-7931](https://openlmis.atlassian.net/browse/OLMIS-7931): Fix imports for layout-ui jenkins job
* [OLMIS-8010](https://openlmis.atlassian.net/browse/OLMIS-8010): Added a condition for putAll function for local storage

New Functionalities:
* [OLMIS-7976](https://openlmis.atlassian.net/browse/OLMIS-7976): Improved visual apperance of the homepage alerts component

New functionalities that are backwards-compatible:
* [OLMIS-7987](https://openlmis.atlassian.net/browse/OLMIS-7987): Move Submit Requisitionless Orders functionalities from Angola to Core instance

New functionalities that are backwards-compatible:
* [OLMIS-7987](https://openlmis.atlassian.net/browse/OLMIS-7987): Move Submit Requisitionless Orders functionalities from Angola to Core instance

Improvements:
* [OIS-23](https://openlmis.atlassian.net/browse/OIS-23): Add basic mixin utils for RTL support
* [OIS-24](https://openlmis.atlassian.net/browse/OIS-24): Adjusted all components styles to support RTL
* [OLMIS-8022](https://openlmis.atlassian.net/browse/OLMIS-8022): Improvements in app offline capabilities.

7.2.11 / 2024-04-19
==================
Bug fixes:
* [OLMIS-7922](https://openlmis.atlassian.net/browse/OLMIS-7922): Fix missing loading spinner in the Data Export and Data Import pages
* [OLMIS-7903](https://openlmis.atlassian.net/browse/OLMIS-7903): Adjust BUQ colors with core UI
* [OLMIS-7906](https://openlmis.atlassian.net/browse/OLMIS-7906): Adjust BUQ to core geographic levels

New Functionalities:
* [OLMIS-7838](https://openlmis.atlassian.net/browse/OLMIS-7838): Add react components

7.2.10 / 2023-11-07
==================
Improvements:
* [OLMIS-7752](https://openlmis.atlassian.net/browse/OLMIS-7752): Added React Loading Component

7.2.9 / 2023-06-26
==================
Bug fixes:
* [OLMIS-7772](https://openlmis.atlassian.net/browse/OLMIS-7772): Fix issues with new Chrome popover functionality

7.2.8 / 2023-04-05
==================
Improvements:
* [OLMIS-7654](https://openlmis.atlassian.net/browse/OLMIS-7654): Added Radio Button Component
* [OLMIS-7649](https://openlmis.atlassian.net/browse/OLMIS-7649): Added MultiSelect Component
* [OLMIS-7655](https://openlmis.atlassian.net/browse/OLMIS-7655): Added Input With Suggestions Component
* [OLMIS-7658](https://openlmis.atlassian.net/browse/OLMIS-7658): Added Checkbox, Input with Clear Icon and Filter Components

7.2.7 / 2022-04-21
==================

Improvements:
* [OLMIS-7467](https://openlmis.atlassian.net/browse/OLMIS-7467): Moved React base fields components to ui-components
* [OLMIS-7468](https://openlmis.atlassian.net/browse/OLMIS-7468): Created table component in React
* [OLMIS-7454](https://openlmis.atlassian.net/browse/OLMIS-7454): Added possibility to edit data in React table.
* [OLMIS-7458](https://openlmis.atlassian.net/browse/OLMIS-7458): Added edit button class
* [OLMIS-7508](https://openlmis.atlassian.net/browse/OLMIS-7508): Added possibility to validate table cell value.
* [OLMIS-7515](https://openlmis.atlassian.net/browse/OLMIS-7515): Add numeric input
* [OLMIS-7516](https://openlmis.atlassian.net/browse/OLMIS-7516): React table style improvements

Bug fixes:
* [OLMIS-7546](https://openlmis.atlassian.net/browse/OLMIS-7546): Fix config for pouchdb-find

7.2.6 / 2021-10-28
==================

Improvements:
* [OLMIS-7323](https://openlmis.atlassian.net/browse/OLMIS-7323): Improved pages to be responsive on low screen resolutions.
* [OLMIS-7319](https://openlmis.atlassian.net/browse/OLMIS-7319): Added breakpoints variables based on bootstrap.

Bug fixes:
* [OLMIS-7314](https://openlmis.atlassian.net/browse/OLMIS-7314): Fixed issue with scss files after webpack migration.
* [OLMIS-7314](https://openlmis.atlassian.net/browse/OLMIS-7314): Update scss files to enable webpack build.
* [OLMIS-7421](https://openlmis.atlassian.net/browse/OLMIS-7421): The error modal "This action can't be completed while offline" is displaying in offline mode in view requisition screen.

7.2.5 / 2021-05-27
==================

Improvements:
* [OLMIS-7165](https://openlmis.atlassian.net/browse/OLMIS-7165): Added a possibility to save data to the local database with its own docId.
* [OLMIS-7182](https://openlmis.atlassian.net/browse/OLMIS-7182): Introduced a possibility in OpenlmisCachedResource to fetch data in offline mode.
* [OLMIS-7187](https://openlmis.atlassian.net/browse/OLMIS-7187): Made caching Openlmis Cached Resource possible also by other params than id.

Bug fixes:
* [OLMIS-7203](https://openlmis.atlassian.net/browse/OLMIS-7203): Fixed issue with Google Analytics dependency
* [OLMIS-7220](https://openlmis.atlassian.net/browse/OLMIS-7220): Refactored getAll method in local database to reject when it is not available.
* [OLMIS-7246](https://openlmis.atlassian.net/browse/OLMIS-7246): Fixed issue with missing pagination in Stock on Hand table.
* [OLMIS-7259](https://openlmis.atlassian.net/browse/OLMIS-7259): Not saving data to pouchDb with docId param when it is paginated.
* [OLMIS-7271](https://openlmis.atlassian.net/browse/OLMIS-7271): Fixed displaying products in the products table.

New functionality that are backwards-compatible:
* [OLMIS-7173](https://openlmis.atlassian.net/browse/OLMIS-7173): Added offline alert and notifications.

7.2.4 / 2020-11-17
==================

Bug fixes:
* [OLMIS-6923](https://openlmis.atlassian.net/browse/OLMIS-6923): Fixed issue with Google Analytics dependency
* [OLMIS-6920](https://openlmis.atlassian.net/browse/OLMIS-6920): Fixed issue with opening Physical Inventory with trade item products
* [OLMIS-6949](https://openlmis.atlassian.net/browse/OLMIS-6949): Fixed issue with making adjustments for Essential Meds
* [OLMIS-6960](https://openlmis.atlassian.net/browse/OLMIS-6960): Fixed extended Edit Supply Partner page load time after removing an association

7.2.3 / 2020-05-12
==================

Bug fixes:
* [COV-52](https://openlmis.atlassian.net/browse/COV-52): Fixed issue with invalid perfect-scrollbar dependency

7.2.2 / 2020-04-14
==================

Bug fixes:
* [OLMIS-6724](https://openlmis.atlassian.net/browse/OLMIS-6724): Updated pagination component to use params returned by a function to call before changing page (if it is provided).

7.2.1 / 2019-12-19
==================

Improvements:
* [OLMIS-6684](https://openlmis.atlassian.net/browse/OLMIS-6684): Updated pagination component to allow providing a function to call before changing page.
    * Got rid of angular.copy to improve performance in some places.

Bug fixes:
* [OLMIS-6612](https://openlmis.atlassian.net/browse/OLMIS-6612): Added check whether the property exists before sorting array by given property.
* [OLMIS-6740](https://openlmis.atlassian.net/browse/OLMIS-6740): Fixed wrapping text in modal body.

7.2.0 / 2019-10-17
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-6350](https://openlmis.atlassian.net/browse/OLMIS-6350): Added openlmisOkIcon component.
* [OLMIS-6380](https://openlmis.atlassian.net/browse/OLMIS-6380): Added openlmis-datetime module.
* [OLMIS-6361](https://openlmis.atlassian.net/browse/OLMIS-6361): Added openlmis-message and openlmis-creation-details components.
* [OLMIS-6359](https://openlmis.atlassian.net/browse/OLMIS-6359): Added missing message openlmisForm.maxlength.
* [OLMIS-6442](https://openlmis.atlassian.net/browse/OLMIS-6442): Added confirmation modal to the FunctionDecorator.
* [OLMIS-6441](https://openlmis.atlassian.net/browse/OLMIS-6441): Added directive positive-decimal.
* [OLMIS-6487](https://openlmis.atlassian.net/browse/OLMIS-6487): Added implementation for get and getAll functions in OpenlmisCacheResource on UI.
* [OLMIS-6538](https://openlmis.atlassian.net/browse/OLMIS-6538): Added implementation for getVersionedIds function in OpenlmisCacheResource on UI to search multiple id with specific version.

* [OLMIS-6486](https://openlmis.atlassian.net/browse/OLMIS-6486): Added implementation for create, update and delete functions in OpenlmisCacheResource on UI.
* [OLMIS-6438](https://openlmis.atlassian.net/browse/OLMIS-6438): Added possibility to use filter component in modal.

Improvements:
* [OLMIS-6357](https://openlmis.atlassian.net/browse/OLMIS-6357): Updated LocalDatabase to reopen database connection for every action.
* [OLMIS-6222](https://openlmis.atlassian.net/browse/OLMIS-6222): Added paginationId attribute to pagination.
* [OLMIS-6416](https://openlmis.atlassian.net/browse/OLMIS-6416): Updated OpenlmisCachedResource getByVersionIdentities to avoid sending requests when offline.

Bug fixes:
* [OLMIS-6403](https://openlmis.atlassian.net/browse/OLMIS-6403) Fixed incorrect Start Date and Expiry Date behaviour for system notifications.
* [OLMIS-6330](https://openlmis.atlassian.net/browse/OLMIS-6330): fixed trigerring reference-ui build.
* [OLMIS-6301](https://openlmis.atlassian.net/browse/OLMIS-6301): Removed code where added timezone to string date if not contain timezone definition.
* [OLMIS-6456](https://openlmis.atlassian.net/browse/OLMIS-6456): Fixed dates filter of periods in the initiated requisition and in POD.

7.1.0 / 2019-05-27
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-6020](https://openlmis.atlassian.net/browse/OLMIS-6020): Added openlmisCronSelection component.
* [OLMIS-4944](https://openlmis.atlassian.net/browse/OLMIS-4944): Added a new localeService to get locale settings from the OpenLMIS server.
* [OLMIS-4944](https://openlmis.atlassian.net/browse/OLMIS-4944): Refactored date filters to use locale settings, with support for a timezone parameter.

Improvements:
* [OLMIS-5822](https://openlmis.atlassian.net/browse/OLMIS-5822): Extended the OpenlmisArrayDecorator with a sortBy class.
* [OLMIS-5655](https://openlmis.atlassian.net/browse/OLMIS-5655): Updated modalStateProvider to not require parentResolves property when it is empty.
* [OLMIS-3773](https://openlmis.atlassian.net/browse/OLMIS-3773): Extended the OpenlmisArrayDecorator with a getUnique method.
* [OLMIS-6020](https://openlmis.atlassian.net/browse/OLMIS-6020): Added FunctionDecorator class.
* [OLMIS-6020](https://openlmis.atlassian.net/browse/OLMIS-6020): Extended the OpenlmisResource with the ability to pass custom parameters when calling create method.

Bug fixes:
* [OLMIS-3987:](https://openlmis.atlassian.net/browse/OLMIS-3987) Fixed wrapping long text in modals.
* [OLMIS-6167:](https://openlmis.atlassian.net/browse/OLMIS-6167) Fixed issue with a weird popover showing after using enter on the select product modal.

7.0.0 / 2018-12-12
==================

Breaking changes:
* [OLMIS-5409](https://openlmis.atlassian.net/browse/OLMIS-5409): Changed syntax for using sort component.

New functionality added in a backwards-compatible manner:
* [OLMIS-5625](https://openlmis.atlassian.net/browse/OLMIS-5625): Added OpenlmisValidator class.
* [OLMIS-5625](https://openlmis.atlassian.net/browse/OLMIS-5625): Added OpenlmisArrayDecorator class.
* [OLMIS-5356](https://openlmis.atlassian.net/browse/OLMIS-5356):
  * Extended OpenlmisResource with the getAll method.
  * Made ObjectMapper.map method synchronous.
  * Extended OpenlmisArrayDecorator with getAllWithUniqueIds method.
  * Changed the condition for when page should be reloaded when using pagination.

Improvements:
* [OLMIS-3696](https://openlmis.atlassian.net/browse/OLMIS-3696): Added dependency and development dependency locking.
* [OLMIS-3446](https://openlmis.atlassian.net/browse/OLMIS-3446): Make offline latency timeout configurable at build time
* [OLMIS-5488](https://openlmis.atlassian.net/browse/OLMIS-5488): Added styles for select2 inside popover and sidebar components

6.0.1 / 2018-10-01
==================

Improvements:
* [OLMIS-5235:](https://openlmis.atlassian.net/browse/OLMIS-5235): Extended LocalDatabase class:
  * Added pouchdb-find.
  * Added putAll method to the LocalDatabase.

6.0.0 / 2018-08-16
==================

Breaking changes:
* [OLMIS-4813:](https://openlmis.atlassian.net/browse/OLMIS-4813) Changed syntax for using datepicker.

New functionality added in a backwards-compatible manner:
* [OLMIS-4600:](https://openlmis.atlassian.net/browse/OLMIS-4600) Added input for managing tags.
* [OLMIS-4623:](https://openlmis.atlassian.net/browse/OLMIS-4623) Added support for non-paginated endpoints to OpenlmisResource.
* [OLMIS-4622:](https://openlmis.atlassian.net/browse/OLMIS-4622) Added the object mapper class.
* [OLMIS-3675:](https://openlmis.atlassian.net/browse/OLMIS-3675) Added support for custom pagination parameter names to the paginationService.
* [OLMIS-4838:](https://openlmis.atlassian.net/browse/OLMIS-4838) Added option to display informational alert to the alertService.
* [OLMIS-4797](https://openlmis.atlassian.net/browse/OLMIS-4797): Added feature flag service.

Improvements:
* [OLMIS-4744](https://openlmis.atlassian.net/browse/OLMIS-4744): Added Jenkinsfile.
* [OLMIS-4795](https://openlmis.atlassian.net/browse/OLMIS-4795): Updated dev-ui to version 8.
* [OLMIS-4935](https://openlmis.atlassian.net/browse/OLMIS-4935): Added UUID v4 generator.
* [OLMIS-4985](https://openlmis.atlassian.net/browse/OLMIS-4985): Extended OpenlmisRepository with the ability to query.
* [OLMIS-4984](https://openlmis.atlassian.net/browse/OLMIS-4984): Extended OpenlmisRepository with the ability to specify custom id parameter name.
* [OLMIS-4535](https://openlmis.atlassian.net/browse/OLMIS-4535): StateTrackerService will no longer trigger reload by default when offline.

Bug fixes:
* [OLMIS-4415:](https://openlmis.atlassian.net/browse/OLMIS-4415) Fixed weird datepicker behavior when entering the text instead of picking it from the component.
* [OLMIS-3675:](https://openlmis.atlassian.net/browse/OLMIS-3675) Fixed broken pagination when coming back to a paginated parent screen from a paginated child screen using "Back" button.
* [OLMIS-4838:](https://openlmis.atlassian.net/browse/OLMIS-4838) Fixed bug with alert promise not being resolved after the modal was closed.
* [OLMIS-4481](https://openlmis.atlassian.net/browse/OLMIS-4481): Fixed bug with double click required to open filter popover.
* [OLMIS-5144](https://openlmis.atlassian.net/browse/OLMIS-5144): Fixed bug with formatting money values.

5.3.0 / 2018-04-24
==================

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
* [OLMIS-4397:](https://openlmis.atlassian.net/browse/OLMIS-4397): Fixed min and max date restrictions on the datepicker
* [OLMIS-4469:](https://openlmis.atlassian.net/browse/OLMIS-4469): Fixed hiding loading modal after it is shown

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
