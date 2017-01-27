(function() {

    'use strict';

    angular.module('requisition', [
        'ngResource',
        'requisition-constants',
        'requisition-template',
        'requisition-validation',
        'openlmis-date',
        'openlmis-i18n',
        'openlmis-local-storage',
        'openlmis-modal',
        'openlmis-offline',
        'openlmis-rights',
        'openlmis-urls',
        'ui.router'
    ]);

})();
