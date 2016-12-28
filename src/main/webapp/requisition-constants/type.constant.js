(function() {

    'use strict';

    angular
        .module('requisition-constants')
        .constant('Type', type());

    function type() {
        return {
            CURRENCY: 'CURRENCY',
            TEXT: 'TEXT',
            BOOLEAN: 'BOOLEAN',
            NUMERIC: 'NUMERIC'
        };
    }

})();
