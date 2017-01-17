(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name order.Order
     *
     * @description
     * Responsible for supplying order with additional information.
     */
    angular
        .module('order')
        .factory('Order', factory);

    function factory() {

        return Order;

        /**
         * @ngdoc function
         * @name Order
         * @methodOf order.Order
         *
         * @description
         * Adds all needed information to given Order.
         *
         * @param {Resource} source Order object
         * @param {Resource} facility Order facility
         * @param {Resource} requestingFacility Order requesting facility
         * @param {Resource} receivingFacility Order recieving facility
         * @param {Resource} supplyingFacility Order supplying facility
         * @param {Resource} program Order program
         * @param {Resource} processingPeriod Order processing period
         * @return {Object} Order with full info
         */
        function Order(source, facility, requestingFacility, receivingFacility, supplyingFacility, program, processingPeriod) {
            var order = this;

            angular.copy(source, this);

            this.$facility = facility;
            this.$requestingFacility = requestingFacility;
            this.$receivingFacility = receivingFacility;
            this.$supplyingFacility = supplyingFacility;
            this.$program = program;
            this.$processingPeriod = processingPeriod;
        }
    }

})();
