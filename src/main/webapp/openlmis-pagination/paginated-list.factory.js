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
        function getPaginatedItems(items) {
            var toSplit = items,
                i = 0,
                pages = [];

            while(toSplit.length > PAGINATION_CONSTANTS.PAGE_SIZE) {
                pages[i] = toSplit.splice(0, PAGINATION_CONSTANTS.PAGE_SIZE);
                i++;
            }

            if(toSplit.length > 0) pages[i] = toSplit;

            pages.getPage = getPage;
            pages.items = items;

            return pages;
        }

        function getPage(pageNumber) {
            return pageNumber <= this.length && pageNumber > 0 ? this[pageNumber - 1] : undefined;
        }
    }

})();
