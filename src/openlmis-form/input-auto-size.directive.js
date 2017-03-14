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
     * @name openlmis-form.directive:inputAutoSize
     *
     * @description
     * Adds auto-resize option to input elements.
     *
     * @example
     * ```
     * <input input-auto-resize ng-model="model"></input>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('inputAutoResize', inputAutoSize);

    inputAutoSize.$inject = ['$window'];

    function inputAutoSize($window) {
        var directive = {
            link: link,
            require: 'ngModel',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModelCtrl) {

            var minWidthSet = false,
                el = angular.element(element[0]),
                parent = angular.element(element[0].parentElement),
                watch = scope.$watch(function() {
                        return ngModelCtrl.$viewValue;
                    },
                    function(oldValue, newValue) {
                        if(!minWidthSet) {
                            $window.autosizeInput(element[0], {minWidth: true});
                            minWidthSet = true;
                            watch();
                        }
                    }
                );

            parent.on('click', function() {
                el.trigger('focus');
            });
        }
    }

})();
