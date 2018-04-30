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
     * @name openlmis-tags-input.openlmisTagsInput
     *
     * @description
     * Directive providing a method for adding and/or selecting tags.
     */
    angular
        .module('openlmis-tags-input')
        .directive('openlmisTagsInput', directive);

    directive.$inject = ['$timeout'];

    function directive($timeout) {
        var openlmisTagsInputDirective = {
            restrict: 'E',
            controller: 'OpenlmisTagsInputController',
            controllerAs: 'tagsInputVm',
            templateUrl: 'openlmis-tags-input/openlmis-tags-input.html',
            require: 'openlmisTagsInput',
            link: link,
            scope: {
                ngModel: '=',
                availableTags: '=',
                allowNewTags: '='
            }
        };
        return openlmisTagsInputDirective;

        function link(scope, element, attrs, ctrl) {
            //This is a workaround to make the validations work in way they fit our form behavior.
            //The timeout here prevents tagsInputModelCtrl and inputModelCtrl from being undefined.
            $timeout(function() {
                var tagsInputModelCtrl = element.find('tags-input').controller('ngModel'),
                    inputModelCtrl = element.find('input').controller('ngModel'),
                    errorMessage;

                scope.$watch(function() {
                    return tagsInputModelCtrl.$valid;
                }, function() {
                    errorMessage = getErrorMessage();
                    if (errorMessage) {
                        ctrl.setErrorMessage(errorMessage);
                    }
                });

                scope.$watch(function() {
                    return inputModelCtrl.$modelValue;
                }, function() {
                    ctrl.setErrorMessage(errorMessage);
                });

                scope.$on('$destroy', function() {
                    tagsInputModelCtrl = undefined;
                    inputModelCtrl = undefined;
                });

                function getErrorMessage() {
                    if (tagsInputModelCtrl.$valid) {
                        return undefined;
                    }

                    if (isDuplicate(inputModelCtrl.$modelValue)) {
                        return 'openlmisTagsInput.duplicatedTag';
                    }

                    return 'openlmisTagsInput.invalidTagsEntered';
                }

                function isDuplicate(tag) {
                    return tagsInputModelCtrl.$modelValue.indexOf(tag) > -1;
                }
            });
        }
    }

})();