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

describe('openlmisCurrencyFilter', function() {

    beforeEach(function() {
        module('openlmis-currency');

        inject(function($injector) {
            this.localeService = $injector.get('localeService');
            this.$filter = $injector.get('$filter');
        });

        this.localeSettings = {
            groupingSeparator: ',',
            groupingSize: 3,
            decimalSeparator: '.'
        };

        spyOn(this.localeService, 'getFromStorage').andReturn(this.localeSettings);
    });

    it('should format money with currency symbol on left', function() {
        this.localeSettings.currencySymbol = '$';
        this.localeSettings.currencySymbolSide = 'left';
        this.localeSettings.currencyDecimalPlaces = 2;

        expect(this.$filter('openlmisCurrency')(23.43)).toEqual('$23.43');
    });

    it('should format money with proper separation for USD', function() {
        this.localeSettings.currencySymbol = '$';
        this.localeSettings.currencySymbolSide = 'left';
        this.localeSettings.currencyDecimalPlaces = 2;

        expect(this.$filter('openlmisCurrency')(23333333333.43)).toEqual('$23,333,333,333.43');
    });

    it('should format money with proper separation for PLN', function() {
        this.localeSettings.currencySymbol = 'zł';
        this.localeSettings.currencySymbolSide = 'right';
        this.localeSettings.currencyDecimalPlaces = 2;
        this.localeSettings.groupingSeparator = ' ';
        this.localeSettings.decimalSeparator = ',';

        expect(this.$filter('openlmisCurrency')(23333333333.43)).toEqual('23 333 333 333,43\u00A0zł');
    });

    it('should format money with groupingSize', function() {
        this.localeSettings.currencySymbol = 'zł';
        this.localeSettings.currencySymbolSide = 'right';
        this.localeSettings.currencyDecimalPlaces = 2;
        this.localeSettings.groupingSeparator = ' ';
        this.localeSettings.decimalSeparator = ',';
        this.localeSettings.groupingSize = 2;

        expect(this.$filter('openlmisCurrency')(23333.43)).toEqual('2 33 33,43\u00A0zł');
    });

    it('should format money with currency symbol on right', function() {
        this.localeSettings.currencySymbol = 'zł';
        this.localeSettings.currencySymbolSide = 'right';
        this.localeSettings.currencyDecimalPlaces = 2;

        expect(this.$filter('openlmisCurrency')(23.43)).toEqual('23.43\u00A0zł');
    });

    it('should properly round up decimal places', function() {
        this.localeSettings.currencySymbol = 'zł';
        this.localeSettings.currencySymbolSide = 'right';
        this.localeSettings.currencyDecimalPlaces = 2;

        expect(this.$filter('openlmisCurrency')(23.439999997)).toEqual('23.44\u00A0zł');
    });

    it('should properly round up money values', function() {
        this.localeSettings.currencySymbol = '¥';
        this.localeSettings.currencySymbolSide = 'right';
        this.localeSettings.currencyDecimalPlaces = 0;

        expect(this.$filter('openlmisCurrency')(22223.5)).toEqual('22,224\u00A0¥');
    });

    it('should properly round down money values', function() {
        this.localeSettings.currencySymbol = '¥';
        this.localeSettings.currencySymbolSide = 'right';
        this.localeSettings.currencyDecimalPlaces = 0;

        expect(this.$filter('openlmisCurrency')(22223.49)).toEqual('22,223\u00A0¥');
    });

    it('should handle null value', function() {
        expect(this.$filter('openlmisCurrency')(null)).toEqual(undefined);
    });

    it('should handle undefined value', function() {
        expect(this.$filter('openlmisCurrency')(undefined)).toEqual(undefined);
    });

});
