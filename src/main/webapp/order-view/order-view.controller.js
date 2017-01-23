(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name order-view.OrderViewController
     *
     * @description
     * Responsible for managing Order View. Exposes facilities/programs to populate selects and
     * fetches data to populate grid.
     */
    angular
        .module('order-view')
        .controller('OrderViewController', controller);

    controller.$inject = [
        'supplyingFacilities', 'requestingFacilities', 'programs', 'orderFactory',
        'loadingModalService', 'notificationService', 'fulfillmentUrlFactory'
    ];

    function controller(supplyingFacilities, requestingFacilities, programs, orderFactory,
                        loadingModalService, notificationService, fulfillmentUrlFactory) {

        var vm = this;

        vm.loadOrders = loadOrders;
        vm.getPrintUrl = getPrintUrl;
        vm.getDownloadUrl = getDownloadUrl;

        /**
         * @ngdoc property
         * @propertyOf order-view.OrderViewController
         * @name supplyingFacilities
         * @type {Array}
         *
         * @description
         * The list of all supplying facilities available to the user.
         */
        vm.supplyingFacilities = supplyingFacilities;

        /**
         * @ngdoc property
         * @propertyOf order-view.OrderViewController
         * @name requestingFacilities
         * @type {Array}
         *
         * @description
         * The list of requesting facilities available to the user.
         */
        vm.requestingFacilities = requestingFacilities;

        /**
         * @ngdoc property
         * @propertyOf order-view.OrderViewController
         * @name programs
         * @type {Array}
         *
         * @description
         * The list of all programs available to the user.
         */
        vm.programs = programs;

        /**
         * @ngdoc method
         * @methodOf order-view.OrderViewController
         * @name loadOrders
         *
         * @description
         * Retrieves the list of orders matching the selected supplying facility, requesting
         * facility and program.
         *
         * @return  {Array} the list of matching orders
         */
        function loadOrders() {
            loadingModalService.open();
            orderFactory.search(
                vm.supplyingFacility.id,
                vm.requestingFacility ? vm.requestingFacility.id : null,
                vm.program ? vm.program.id : null
            ).then(function(orders) {
                vm.orders = orders;
            }, function() {
                notificationService.error('msg.error.occurred');
            }).finally(function() {
                loadingModalService.close();
            });
        }

        /**
         * @ngdoc method
         * @methodOf order-view.OrderViewController
         * @name getPrintUrl
         *
         * @description
         * Prepares a print URL for the given order.
         *
         * @param   {Object}    order   the order to prepare the URL for
         * @return  {String}            the prepared URL
         */
        function getPrintUrl(order) {
            return fulfillmentUrlFactory('/api/orders/' + order.id + '/print?format=pdf');
        }

        /**
         * @ngdoc method
         * @methodOf order-view.OrderViewController
         * @name getDownloadUrl
         *
         * @description
         * Prepares a download URL for the given order.
         *
         * @param   {Object}    order   the order to prepare the URL for
         * @return  {String}            the prepared URL
         */
        function getDownloadUrl(order) {
            return fulfillmentUrlFactory('/api/orders/' + order.id + '/export?type=csv');
        }

    }

})();
