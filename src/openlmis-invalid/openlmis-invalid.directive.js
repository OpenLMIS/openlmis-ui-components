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
     * @restrict A
     * @name openlmis-invalid.directive:openlmis-invalid
     *
     * @description
     * Watches for invalid messages in the openlmis-invalid controller. If the 
     * controller has any messages to display, then:
     * - An error message element is prepended to the element
     * - The .is-invalid class is added to the element
     */

    angular
        .module('openlmis-invalid')
        .directive('openlmisInvalid', directive);

    directive.$inject = ['$compile', '$templateCache'];

    function directive($compile, $templateCache) {
        return {
            link: link,
            restrict: 'A',
            priority: 10,
            controller: 'OpenlmisInvalidController'
        };

        function link(scope, element, attrs, openlmisInvalidCtrl) {
            var messageScope = scope.$new(),
                messageElement;

            scope.$watch(getAttributeError, updateErrors);
            scope.$watchCollection(function() {
                return openlmisInvalidCtrl.getMessages();
            }, updateErrors);
            scope.$watchCollection(canShowErrors, updateErrors);

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
                if (attrs.hasOwnProperty('openlmisInvalid') &&
                    attrs.openlmisInvalid != '' &&
                    attrs.openlmisInvalid != 'false') {
                    return attrs.openlmisInvalid;
                }
                return false;
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
                var messages = [],
                    message = getAttributeError();

                if (message) {
                    messages.push(message);
                }

                angular.forEach(openlmisInvalidCtrl.getMessages(), function(value) {
                    messages.push(value);
                });

                if (messages.length > 0) {
                    showErrors(messages);
                } else {
                    clearErrors();
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-invalid.directive:openlmis-invalid
             * @name clearErrors
             * 
             * @description
             * Removes and destroys the error message span, if it exists. This
             * method triggers the event openlmisInvalid.hide
             */
            function clearErrors() {
                element.removeClass('is-invalid');

                element.trigger('openlmisInvalid.hide', [messageElement]);

                if (messageElement) {
                    messageElement.remove();
                    messageElement = undefined;
                }
            }

            /**
             * @ngdoc method
             * @methodOf openlmis-invalid.directive:openlmis-invalid
             * @name showErrors
             *
             * @description
             * Renders an invalid message element with the set of messages.
             * This method triggers the event openlmisInvalid.show
             *
             * @param  {Array} messages List of messages to show
             */
            function showErrors(messages) {
                if (!canShowErrors()) {
                    return ;
                }

                element.addClass('is-invalid');
                messageScope.messages = messages;

                if (!messageElement) {
                    var html = $templateCache.get('openlmis-invalid/openlmis-invalid.html');
                    messageElement = $compile(html)(messageScope);

                    element.trigger('openlmisInvalid.show', [messageElement]);
                }
            }

            /**
             * @ngdoc event
             * @name openlmisInvalid.show
             * @eventOf openlmis-invalid.directive:openlmis-invalid
             *
             * @description
             * Event is triggered when an openlmisInvalid element is able to
             * place an error message on the screen.
             */
            element.on('openlmisInvalid.show', placeErrorMessage);
            function placeErrorMessage(event, messageElement) {
                if (!event.isDefaultPrevented()) {
                    element.prepend(messageElement);
                }
            }

            function canShowErrors() {
                return !openlmisInvalidCtrl.isHidden();
            }
        }

    }

})();
