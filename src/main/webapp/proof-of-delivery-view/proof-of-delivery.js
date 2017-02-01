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

    factory.$inject = ['proofOfDeliveryService', 'messageService'];

    function factory(proofOfDeliveryService, messageService){

        ProofOfDelivery.prototype.isValid = isValid;
        ProofOfDelivery.prototype.validateRequiredField = validateRequiredField;

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

            this.$errors = {};

            angular.forEach(this.proofOfDeliveryLineItems, function(lineItem) {

                lineItem.$errors = {};
                lineItem.isValid = isLineItemValid;
                lineItem.validate = validateLineItem;

                angular.forEach(lineItem.orderLineItem.orderable.programs, function(program) {
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
        function isLineItemValid() {
            var lineItem = this,
                valid = true;

            angular.forEach(lineItem.$errors, function(error) {
                valid = valid && !error;
            });

            return valid;
        }

        function validateLineItem() {
            var lineItem = this;

            if(lineItem.quantityReceived === undefined || lineItem.quantityReceived === null) lineItem.$errors.quantityReceived = messageService.get('msg.fieldRequired');
            else delete lineItem.$errors.quantityReceived;
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

            angular.forEach(this.proofOfDeliveryLineItems, function(lineItem) {
                lineItem.validate();
                if(!lineItem.isValid()) isValid = false;
            });

            this.validateRequiredField('receivedBy');
            this.validateRequiredField('deliveredBy');
            this.validateRequiredField('receivedDate');

            angular.forEach(this.$errors, function(error) {
                isValid = isValid && !error;
            });

            return isValid;
        }

        function validateRequiredField(fieldName) {
            if(!this[fieldName] || this[fieldName] === '') this.$errors[fieldName] = messageService.get('msg.fieldRequired');
            else delete this.$errors[fieldName];
        }
    }

})();
