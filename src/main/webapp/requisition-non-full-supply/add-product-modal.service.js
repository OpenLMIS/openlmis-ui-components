(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-non-full-supply.addProductModalService
     *
     * @description
     * It shows modal with possibility to add non-full supply line item
     * with one of given products.
     */
    angular
        .module('requisition-non-full-supply')
        .service('addProductModalService', service);

    service.$inject = [
        '$q', '$rootScope', '$compile', '$templateRequest', '$ngBootbox', 'messageService',
        '$controller', 'categoryFactory'
    ];

    function service($q, $rootScope, $compile, $templateRequest, $ngBootbox, messageService,
                     $controller, categoryFactory) {

        this.show = show;

        /**
         * @ngdoc function
         * @name show
         * @methodOf requisition-non-full-supply.addProductModalService
         *
         * @description
         * Shows modal that allows to add line item to requisition.
         *
         * @param {Array} categories Facility approved categories
         * @returns {Promise} resolved with line item when product is added
         */
        function show(products, programId) {
            var deferred = $q.defer(),
                scope = $rootScope.$new();

            scope.vm = $controller('AddProductModalController', {
                deferred: deferred,
                categories: categoryFactory.groupProducts(products, programId),
                programId: programId
            });

            $templateRequest('requisition-non-full-supply/add-product-modal.html')
                .then(function(template) {
                    $ngBootbox.customDialog({
                        title: messageService.get('label.rnr.add.non.full.supply'),
                        message: $compile(angular.element(template))(scope),
                        className: 'add-product-modal'
                    });
                });

            return deferred.promise;
        }
    }

})();
