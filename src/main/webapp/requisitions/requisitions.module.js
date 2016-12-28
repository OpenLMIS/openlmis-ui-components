(function() {

    "use strict";

    angular.module('openlmis.requisitions', [
        'requisition',
        'requisition-view',
        'requisition-template',
        'requisition-approval',
        'requisition-constants',
        'requisition-validation',
        'requisition-full-supply',
        'requisition-calculations',
        'requisition-non-full-supply',
        'requisition-convert-to-order',
        'angular.filter',
        'openlmis-core',
        'openlmis-templates',
        'ngSanitize',
        'ngBootbox'
    ]);

})();
