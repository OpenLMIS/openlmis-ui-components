(function(){
    'use strict';
    /**
     *
     * @ngdoc service
     * @name proof-of-delivery-view.ProofOfDelivery
     *
     * @description
     * Responsible for supplying pod with additional methods and information.
     */
    angular
        .module('proof-of-delivery-view')
        .factory('ProofOfDelivery', factory);

    factory.$inject = ['podService'];

    function factory(podService){

        ProofOfDelivery.prototype.isValid = isValid;
        ProofOfDelivery.prototype.isLineItemValid = isLineItemValid;

        return ProofOfDelivery;


        /**
         * @ngdoc method
         * @name ProofOfDelivery
         * @methodOf proof-of-delivery-view.ProofOfDelivery
         *
         * @description
         * Adds all needed methods and information to given ProofOfDelivery.
         *
         * @param {Resource} source ProofOfDelivery object
         * @param {Resource} order Order with additional info
         * @return {Object} ProofOfDelivery
         */
        function ProofOfDelivery(source) {
            var pod = this;

            angular.copy(source, this);

            angular.forEach(this.proofOfDeliveryLineItems, function(lineItem) {
                angular.forEach(lineItem.orderLineItem.orderableProduct.programs, function(program) {
                    if(program.programId === pod.order.program.id) lineItem.$program = program;
                });
            });
        }

        /**
         * @ngdoc method
         * @name isLineItemValid
         * @methodOf proof-of-delivery-view.ProofOfDelivery
         *
         * @description
         * Checks if POD line item is valid.
         *
         * @param {Object} lineItem POD line item
         * @return {boolean} true if line item is valid
         */
        function isLineItemValid(lineItem) {
            return !(lineItem.quantityReceived === undefined) && !(lineItem.quantityReceived === null);
        }

        /**
         * @ngdoc method
         * @name isValid
         * @methodOf proof-of-delivery-view.ProofOfDelivery
         *
         * @description
         * Checks if POD is valid.
         *
         * @return {boolean} true if POD is valid
         */
        function isValid() {
            var isValid = true;

            if(!this.receivedBy || this.receivedBy === '') return false;
            if(!this.deliveredBy || this.deliveredBy === '') return false;
            if(!this.receivedDate) return false;

            angular.forEach(this.proofOfDeliveryLineItems, function(lineItem) {
                if(!isLineItemValid(lineItem)) isValid = false;
            });

            return isValid;
        }
    }

})();
