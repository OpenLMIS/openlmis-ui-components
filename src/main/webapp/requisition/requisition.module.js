(function() {

    'use strict';

    angular.module('requisition', [
        'ngResource',
        'requisition-constants',
        'requisition-template',
        'requisition-validation',
        'openlmis-core',
        'openlmis-i18n',
        'openlmis-local-storage',
        'openlmis-modal',
        'openlmis-offline',
        'openlmis-urls',
        'ui.router'
    ]);

})();
