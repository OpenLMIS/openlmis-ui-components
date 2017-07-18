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
     * @ngdoc directive
     * @restrict E
     * @name openlmis-invalid.directive:openlmis-invalid
     *
     * @description
     * Sets the invalid error state and message on a form or form control
     * object.
     */
    
    angular
        .module('openlmis-invalid')
        .directive('openlmisInvalid', directive);

    directive.$inject = ['$compile', '$templateRequest'];
    function directive($compile, $templateRequest) {
        return {
            link: link,
            restrict: 'A',
            controller: 'OpenlmisInvalidController'
        };

        function link(scope, element, attrs, openlmisInvalidCtrl) {
            var messageScope = scope.$new(),
                messageElement;

            scope.$watch(getAttributeError, updateErrors);
            scope.$watchCollection(openlmisInvalidCtrl.getMessages, updateErrors);
            scope.$watchCollection(canShowErrors, updateErrors);
            scope.$on('openlmisInvalid.update', updateErrors);


            /**
             * @ngdoc method
             * @methodOf openlmis-invalid.directive:openlmis-invalid
             * @name  getAttributeError
             *
             * @description
             * Returns the message in openlmisInvalid, or false if an empty
             * string or unset.
             */
            function getAttributeError() {
                if(attrs.hasOwnProperty('openlmisInvalid') && attrs.openlmisInvalid != '') {
                    return attrs.openlmisInvalid;
                } else {
                    return false;
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-invalid.directive:openlmis-invalid
             * @name  updateErrors
             *
             * @description
             * Creates a list of messages, and if there are any messages to
             * show, then it shows or clears the error message span.
             */
            function updateErrors() {
                var messages = [];

                if(getAttributeError()) {
                    messages.push(getAttributeError());
                }

                angular.forEach(openlmisInvalidCtrl.getMessages(), function(value, key) {
                    messages.push(value);
                });

                if(messages.length > 0) {
                    showErrors(messages);
                } else {
                    clearErrors();
                }
            }

            function canShowErrors() {
                if(element.attr('openlmis-invalid-hidden')) {
                    return false;
                }
                if(element.parents('[openlmis-invalid-hidden]').length > 0){
                    return false;
                }
                return true;
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-invalid.directive:openlmis-invalid
             * @name showErrors
             * 
             * @param  {Array} messages List of messages to show
             *
             * @description
             * Renders an invalid message element with the set of messages.
             */
            function showErrors(messages) {
                if(!canShowErrors()){
                    return ;
                }

                element.addClass('is-invalid');
                messageScope.messages = messages;

                if(!messageElement){
                    messageElement = true;
                    $templateRequest('openlmis-invalid/openlmis-invalid.html')
                    .then(function(html){
                        messageElement = $compile(html)(messageScope);
                        element.prepend(messageElement);
                    });
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-invalid.directive:openlmis-invalid
             * @name clearErrors
             * 
             * @description
             * Removes and destroys the error message span, if it exists.
             */
            function clearErrors() {
                element.removeClass('is-invalid');

                if(messageElement){
                    messageElement.remove();
                    messageElement = undefined;                    
                }
            }
        }

    }

})();