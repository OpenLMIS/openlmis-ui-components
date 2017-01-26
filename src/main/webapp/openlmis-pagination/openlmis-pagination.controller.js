(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-pagination.PaginationController
     *
     * @description
     * Responsible for managing pagination element.
     */
    angular
        .module('openlmis-pagination')
        .controller('PaginationController', controller);

    controller.$inject = ['$scope'];

    function controller($scope) {

        var vm = this;

        vm.changePage = changePage;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;

        vm.isCurrentPage = isCurrentPage;
        vm.isFirstPage = isFirstPage;
        vm.isLastPage = isLastPage;

        vm.getPageNumbers = getPageNumbers;

        vm.isPageValid = isPageValid;

        /**
         * @ngdoc method
         * @name changePage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Changes the current page number to a new one. If callback for changing page
         * was provided then it will be called.
         *
         * @param  {integer} newPage New page number
         */
        function changePage(newPage) {
            if(newPage > 0 && newPage <= $scope.items.length) {
                $scope.currentPage = newPage;
                if($scope.changePage && angular.isFunction($scope.changePage)) $scope.changePage(newPage);
            }
        }

        /**
         * @ngdoc method
         * @name nextPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Changes the current page to next one.
         */
        function nextPage() {
            changePage($scope.currentPage + 1);
        }

        /**
         * @ngdoc method
         * @name previousPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Changes the current page number to a previous one.
         */
        function previousPage() {
            changePage($scope.currentPage - 1);
        }

        /**
         * @ngdoc method
         * @name isCurrentPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Checks if the page number is current one.
         *
         * @param {integer} newPage number of page to check
         */
        function isCurrentPage(pageNumber) {
            return $scope.currentPage === pageNumber;
        }

        /**
         * @ngdoc method
         * @name isFirstPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Checks if current page is first one on the list.
         */
        function isFirstPage() {
            return $scope.currentPage === 1;
        }

        /**
         * @ngdoc method
         * @name isLastPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Checks if current page is last one on the list.
         */
        function isLastPage() {
            return $scope.currentPage === $scope.items.length;
        }

        /**
         * @ngdoc method
         * @name getPageNumbers
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Generates array with numbers of all pages.
         *
         * @return {Array} generated numbers for pagination
         */
        function getPageNumbers() {
            return new Array($scope.items.length);
        }

        /**
         * @ngdoc method
         * @name isPageValid
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Uses provided function to validate item. If there is no validation method
         * it will always return true.
         *
         * @param {integer} pageNumber number of page
         * @return {boolean} true if page is validated successfully or there is no validation method
         */
        function isPageValid(pageNumber) {
            var valid = true;
            if($scope.isItemValid && angular.isFunction($scope.isItemValid)) {
                angular.forEach($scope.items.getPage(pageNumber), function(item) {
                    if(!$scope.isItemValid(item)) valid = false;
                });
            }
            return valid;
        }
    }

})();
