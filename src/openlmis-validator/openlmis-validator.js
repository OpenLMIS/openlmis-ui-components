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

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-validator.OpenlmisValidator
     * 
     * @description
     * Class responsible for doing all sorts of validation so they don't have to be duplicated in a lot of places.
     */
    angular
        .module('openlmis-validator')
        .factory('OpenlmisValidator', OpenlmisValidator);

    function OpenlmisValidator() {

        OpenlmisValidator.prototype.validateExists = validateExists;
        OpenlmisValidator.prototype.validateInstanceOf = validateInstanceOf;
        OpenlmisValidator.prototype.validateLesserThan = validateLesserThan;
        OpenlmisValidator.prototype.validateObjectWithIdDoesNotExist = validateObjectWithIdDoesNotExist;

        return OpenlmisValidator;

        function OpenlmisValidator() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-validator.OpenlmisValidator
         * @name validateExists
         * 
         * @description
         * Checks whether the given value exists and if it doesn't, throws an exception with the given message.
         * 
         * @param {Object} value         the value to be validate
         * @param {String} errorMessage  the error message to be thrown when value is null or undefined
         */
        function validateExists(value, errorMessage) {
            if (!errorMessage) {
                throw 'Given error message must be defined';
            }

            if (value === null || value === undefined) {
                throw errorMessage;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-validator.OpenlmisValidator
         * @name validateInstanceOf
         * 
         * @description
         * Checks whether the given object is an instance of the given class and if it isn't, throws an exception with
         * the given message.
         * 
         * @param {Object} object        the object to be validate
         * @param {Object} clazz         the to class to be tested for
         * @param {String} errorMessage  the error message to be thrown when object is not an instance of the given
         *                               class
         */
        function validateInstanceOf(object, clazz, errorMessage) {
            this.validateExists(clazz, 'Given class must be defined');
            this.validateExists(errorMessage, 'Given error message must be defined');

            if (!(object instanceof clazz)) {
                throw errorMessage;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-validator.OpenlmisValidator
         * @name validateInstanceOf
         * 
         * @description
         * Checks whether the given number is lesser than the given maximum and if it is, throws an exception with the
         * given message.
         * 
         * @param {int} number           the number to be validate
         * @param {int} max              the maximum that can't be reached
         * @param {String} errorMessage  the error message to be thrown when number is bigger or equal to max
         */
        function validateLesserThan(number, max, errorMessage) {
            this.validateExists(number, 'Given number must be defined');
            this.validateExists(max, 'Given maximum must be defined');
            this.validateExists(errorMessage, 'Given error message must be defined');

            if (number >= max) {
                throw errorMessage;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-validator.OpenlmisValidator
         * @name validateObjectWithIdDoesNotExist
         * 
         * @description
         * Checks whether object with the given ID already exists in the given array.
         * 
         * @param {int} objects          the objects array
         * @param {int} id               the id of to be tested
         * @param {String} errorMessage  the error message to be thrown when object with the given ID already exists in
         *                               the array
         */
        function validateObjectWithIdDoesNotExist(objects, id, errorMessage) {
            this.validateExists(objects, 'Given objects must be defined');
            this.validateExists(id, 'Given ID must be defined');
            this.validateExists(errorMessage, 'Given error message must be defined');
            var filtered = objects
                .map(function(object) {
                    return object.id;
                })
                .indexOf(id);

            if (filtered > -1) {
                throw errorMessage;
            }
        }

    }

})();