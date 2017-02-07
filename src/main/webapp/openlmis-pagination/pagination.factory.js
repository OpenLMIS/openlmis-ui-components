(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-pagination.paginationFactory
     *
     * @description
     * Provides method for dividing lists into pages.
     */
    angular
        .module('openlmis-pagination')
        .factory('paginationFactory', factory);

    factory.$inject = ['PAGE_SIZE'];

    function factory(PAGE_SIZE) {
        var factory = {
            getPage: getPage
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginationFactory
         * @name getPage
         *
         * @description
         * Get the page with the given number of the given size.
         *
         * @param   {Array}     items   the list of items to get the page from
         * @param   {Number}    page    the number of the page
         * @param   {Number}    size    the size of the page
         * @return  {Array}             the size-long sublist of the given list
         */
        function getPage(items, page, size) {
            var pageSize = size ? size : PAGE_SIZE,
                start = page * pageSize,
                end = Math.min(items.length, start + pageSize);

            return start < end ? items.slice(start, end) : [];
        }
    }

})();
