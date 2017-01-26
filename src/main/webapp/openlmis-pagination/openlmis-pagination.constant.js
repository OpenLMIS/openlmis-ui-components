(function() {

    'use strict';

    angular
        .module('openlmis-pagination')
        .constant('PAGINATION_CONSTANTS', constant());

    function constant() {

        var DEFAULT_PAGE_SIZE = 10;

        return {
            PAGE_SIZE: getPageSize()
        };

        function getPageSize() {
            var pageSize = '@@PAGE_SIZE';
            if(parseInt(pageSize) && parseInt(pageSize) > 0) return parseInt(pageSize);
            return DEFAULT_PAGE_SIZE;
        }
    }

})();
