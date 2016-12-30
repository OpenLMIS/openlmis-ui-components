(function() {

    'use strict';

    angular.module('requisition', [
        'ngResource',
        'requisition-constants',
        'requisition-template',
        'requisition-validation',
        'openlmis-i18n',
        'openlmis-offline',
        'openlmis-urls',
        'ui.router'
    ]);

})();
