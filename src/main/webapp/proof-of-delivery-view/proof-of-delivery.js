/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

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

            this.$errors = {};

            angular.forEach(this.proofOfDeliveryLineItems, function(lineItem) {

                lineItem.$errors = {};
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
        function isLineItemValid(lineItem) {
            var valid = true;

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
                if(!isLineItemValid(lineItem)) isValid = false;
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
