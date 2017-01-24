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

        $scope.changePage = changePage;
        $scope.getPageNumbers = getPageNumbers;

        /**
         * @ngdoc method
         * @name changePage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Changes the current page number to a new one.
         *
         * @param  {integer} newPage New page number
         */
        function changePage(newPage) {
            $scope.currentPage = newPage;
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
            return new Array($scope.numberOfPages);
        }
    }

})();
