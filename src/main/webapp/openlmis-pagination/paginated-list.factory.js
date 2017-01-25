(function(){
    'use strict';
    /**
     *
     * @ngdoc service
     * @name openlmis-pagination.paginatedListFactory
     *
     * @description
     * Provides pagination of listed items.
     */
    angular
        .module('openlmis-pagination')
        .factory('paginatedListFactory', factory);

    factory.$inject = ['PAGINATION_CONSTANTS'];

    function factory(PAGINATION_CONSTANTS){

        var factory = {
            getPaginatedItems: getPaginatedItems
        };
        return factory;


        /**
         * @ngdoc method
         * @name getPaginatedItems
         * @methodOf openlmis-pagination.paginatedListFactory
         *
         * @description
         * Splits passed items into pages and gives basic information about pagination.
         *
         * @param {String} items items that will be split into pages
         * @return {Object} contains all pages, their amount and current page
         */
        function getPaginatedItems(items, currentPage) {
            var toSplit = items,
                i = 0,
                pages = [];

            while(toSplit.length > PAGINATION_CONSTANTS.PAGE_SIZE) {
                pages[i] = toSplit.splice(0, PAGINATION_CONSTANTS.PAGE_SIZE);
                i++;
            }

            if(toSplit.length > 0) pages[i] = toSplit;

            return {
                items: pages,
                pages: pages.length,
                currentPage: currentPage ? currentPage : 1
            };
        }
    }

})();
