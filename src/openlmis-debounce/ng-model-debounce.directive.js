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
     * @name openlmis-debounce.directive:ngModelDebounce
     *
     * @description
     * Adds a debounce to the ngModel. It will use the value defined in config.json file (500 ms by
     * default).
     */
    angular
        .module('openlmis-debounce')
        .directive('ngModel', ngModelDebounce);

    function ngModelDebounce() {
        var directive = {
            link: link,
            restrict: 'A',
            terminal: true,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            if (shouldSetDefaultDebounceOption(element)) {
                ngModel.$overrideModelOptions({
                    updateOn: 'default blur',
                    debounce: {
                        default: parseInt('@@DEFAULT_DEBOUNCE'),
                        blur: 0
                    }
                });
            }
        }

        function shouldSetDefaultDebounceOption(element) {
            var options = element.attr('ng-model-options');

            if (element.parents('tags-input').length) {
                return false;
            }

            if (options && options.contains('debounce')) {
                return false;
            }

            if (element.is('select')) {
                return false;
            }

            if (element.attr('type') === 'radio') {
                return false;
            }

            if (element.attr('type') === 'checkbox') {
                return false;
            }

            return true;
        }
    }

})();
