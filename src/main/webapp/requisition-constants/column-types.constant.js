(function() {

    'use strict';

    angular
        .module('requisition-constants')
        .constant('COLUMN_TYPES', type());

    function type() {
        return {
            CURRENCY: 'CURRENCY',
            TEXT: 'TEXT',
            BOOLEAN: 'BOOLEAN',
            NUMERIC: 'NUMERIC'
        };
    }

})();
