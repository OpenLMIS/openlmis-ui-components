(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-pagination.paginatedRouter
     *
     * @description
     * Provides method for enriching a resolve object with pagination related params. If a items
     * resolve is provided it will also set total items count.
     */
    angular
        .module('openlmis-pagination')
        .provider('paginatedRouter', factory);

    factory.$inject = [];

    function factory() {
        this.resolve = resolve;

        this.$get = [function(){}];

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginatedRouter
         * @name resolve
         *
         * @description
         * Adds pagination related resolves to the given resolve object.
         *
         * @param   {Object}    toResolve   the object to be enriched
         * @return  {Object}                the enriched object
         */
        function resolve(toResolve) {
            if (!toResolve.pageSize) {
                toResolve.pageSize = pageSizeResolve;
            }

            if (!toResolve.totalItems && toResolve.items) {
                toResolve.totalItems = totalItemsResolve;
            }

            if (!toResolve.page) {
                toResolve.page = pageResolve;
            }
            return toResolve;
        }

        function pageSizeResolve($stateParams) {
            return getInt($stateParams.size);
        }

        function totalItemsResolve(items) {
            return items.length;
        }

        function pageResolve($stateParams) {
            return getInt($stateParams.page);
        }

        function getInt(value) {
            return value ? parseInt(value) : value;
        }
    }

})();
