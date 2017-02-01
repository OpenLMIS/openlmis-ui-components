/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

describe('CurrencyController', function() {

    var $rootScope, $q, vm, currencyService, $scope;

    beforeEach(function() {
        module('openlmis-currency');

        inject(function (_$rootScope_, $controller, _$q_, _currencyService_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            currencyService = _currencyService_;

            $scope = $rootScope.$new();

            vm = $controller('CurrencyController', {$scope: $scope});
        });
    });

    it('should format money with currency symbol on left', function() {
        var currencySettings = {};
        currencySettings['currencySymbol'] = '$';
        currencySettings['currencySymbolSide'] = 'left';
        currencySettings['currencyDecimalPlaces'] = 2;

        spyOn(currencyService, 'get').andReturn($q.when(currencySettings));

        $scope.value = 23.43;
        $scope.$apply();

        expect(vm.valueCurrency).toEqual('$ 23.43');
    });

    it('should format money with currency symbol on right', function() {
        var currencySettings = {};
        currencySettings['currencySymbol'] = 'zł';
        currencySettings['currencySymbolSide'] = 'right';
        currencySettings['currencyDecimalPlaces'] = 2;

        spyOn(currencyService, 'get').andReturn($q.when(currencySettings));

        $scope.value = 23.43;
        $scope.$apply();

        expect(vm.valueCurrency).toEqual('23.43 zł');
    });

});
