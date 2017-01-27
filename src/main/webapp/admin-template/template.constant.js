(function() {

    'use strict';

    angular
        .module('admin-template')
        .constant('TEMPLATE_CONSTANTS', constant());

    function constant() {

        return {
            MAX_COLUMN_DESCRIPTION_LENGTH: 140
        };
    }

})();
