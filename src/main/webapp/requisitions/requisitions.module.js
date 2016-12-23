(function() {

    "use strict";

    angular.module('openlmis.requisitions', [
        'requisition-full-supply',
        'requisition-non-full-supply',
        'angular.filter',
        'openlmis-core',
        'openlmis-templates',
        'ngSanitize',
        'ngBootbox'
    ]);

})();
