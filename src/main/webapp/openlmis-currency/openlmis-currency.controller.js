/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-currency.currencyController
     *
     * @description
     * Responsible for managing currency element.
     */
    angular
        .module('openlmis-currency')
        .controller('CurrencyController', controller);

    controller.$inject = ['$scope', 'currencyService'];

    function controller($scope, currencyService) {

        var vm = this;

        $scope.$watch('value', formatValue);

        /**
         * @ngdoc method
         * @name changePage
         * @methodOf openlmis-currency.currencyController
         *
         * @description
         * Format the current money value with settings.
         */
        function formatValue() {
            currencyService.get().then(function(settings) {
                var currencyValue = $scope.value.toFixed(settings.currencyDecimalPlaces);
                if (settings.currencySymbolSide === 'right') {
                    vm.valueCurrency = currencyValue + ' ' + settings.currencySymbol;
                } else {
                    vm.valueCurrency = settings.currencySymbol + ' ' + currencyValue;
                }
            });
        }
    }

})();
