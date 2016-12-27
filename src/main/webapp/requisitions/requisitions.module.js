(function() {

    "use strict";

    angular.module('openlmis.requisitions', [
        'requisition',
        'requisition-view',
        'requisition-approval',
        'requisition-full-supply',
        'requisition-non-full-supply',
        'requisition-convert-to-order',
        'angular.filter',
        'openlmis-core',
        'openlmis-templates',
        'ngSanitize',
        'ngBootbox'
    ]);

})();
