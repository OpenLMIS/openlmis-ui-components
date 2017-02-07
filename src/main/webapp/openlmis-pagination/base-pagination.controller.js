(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-pagination.BasePaginationController
     *
     * @description
     * Base for all controllers providing pagination.
     */
    angular
        .module('openlmis-pagination')
        .controller('BasePaginationController', controller);

    controller.$inject = [
        '$state', 'paginationFactory', 'vm', 'page', 'pageSize', 'items', 'totalItems',
        'externalPagination'
    ];

    function controller($state, paginationFactory, vm, page, pageSize, items, totalItems,
                        externalPagination) {

        vm.updateUrl = updateUrl;
        vm.getPage = getPage;
        vm.changePage = changePage;
        vm.items = items;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.BasePaginationController
         * @name stateParams
         * @type {Object}
         *
         * @description
         * Stores the current state parameters. This object is used when reloading state.
         */
        vm.stateParams = {
            page: page,
            size: pageSize
        };

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.BasePaginationController
         * @name totalItems
         * @type {Number}
         *
         * @description
         * Stores the total amount of all items. This is used mostly by the pagination directive.
         */
        vm.totalItems = totalItems;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.BasePaginationController
         * @name pageItems
         * @type {Array}
         *
         * @description
         * The list of items displayed on the current page.
         */
        vm.pageItems = externalPagination ? items : getPage(vm.stateParams.page);

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.BasePaginationController
         * @name updateUrl
         *
         * @description
         * Responsible for updating current state URL with the parameters stored in the
         * vm.stateParams object.
         */
        function updateUrl() {
            $state.go($state.current.name, vm.stateParams, {
                reload: externalPagination,
                notify: externalPagination
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.BasePaginationController
         * @name changePage
         *
         * @description
         * Changes current page. It will update URL and load new items(only if internal pagination
         * is used).
         */
        function changePage() {
            if (!externalPagination) {
                vm.pageItems = getPage(vm.stateParams.page);
            }
            updateUrl();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.BasePaginationController
         * @name getPage
         *
         * @description
         * Gets the list of items on the given page.
         *
         * @param   {Number}    page    the number of the page
         * @return  {Array}             the list of items on the given page
         */
        function getPage(page) {
            return paginationFactory.getPage(vm.items, page, vm.stateParams.size);
        }
    }

})();
