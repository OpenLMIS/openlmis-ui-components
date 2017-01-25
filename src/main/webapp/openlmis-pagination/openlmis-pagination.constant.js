(function() {

    'use strict';

    angular
        .module('openlmis-pagination')
        .constant('PAGINATION_CONSTANTS', constant());

    function constant() {
        return {
            PAGE_SIZE: '@@PAGE_SIZE'
        };
    }

})();
