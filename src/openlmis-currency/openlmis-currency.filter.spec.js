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

    var localeSettings = {};

    beforeEach(function() {
        var localeServiceSpy = {
            getFromStorage: function() {
                return localeSettings;
            }
        };

        localeSettings['groupingSeparator'] = ',';
        localeSettings['groupingSize'] = 3;
        localeSettings['decimalSeparator'] = '.';

        module('openlmis-currency', function($provide) {
            $provide.service('localeService', function() {
                return localeServiceSpy;
            });
        });
    });

    it('should format money with currency symbol on left', inject(function($filter) {
        localeSettings['currencySymbol'] = '$';
        localeSettings['currencySymbolSide'] = 'left';
        localeSettings['currencyDecimalPlaces'] = 2;

        expect($filter('openlmisCurrency')(23.43)).toEqual('$23.43');
    }));

    it('should format money with proper separation for USD', inject(function($filter) {
        localeSettings['currencySymbol'] = '$';
        localeSettings['currencySymbolSide'] = 'left';
        localeSettings['currencyDecimalPlaces'] = 2;

        expect($filter('openlmisCurrency')(23333333333.43)).toEqual('$23,333,333,333.43');
    }));

    it('should format money with proper separation for PLN', inject(function($filter) {
        localeSettings['currencySymbol'] = 'zł';
        localeSettings['currencySymbolSide'] = 'right';
        localeSettings['currencyDecimalPlaces'] = 2;
        localeSettings['groupingSeparator'] = ' ';
        localeSettings['decimalSeparator'] = ',';

        expect($filter('openlmisCurrency')(23333333333.43)).toEqual('23 333 333 333,43\u00A0zł');
    }));

    it('should format money with groupingSize', inject(function($filter) {
        localeSettings['currencySymbol'] = 'zł';
        localeSettings['currencySymbolSide'] = 'right';
        localeSettings['currencyDecimalPlaces'] = 2;
        localeSettings['groupingSeparator'] = ' ';
        localeSettings['decimalSeparator'] = ',';
        localeSettings['groupingSize'] = 2;

        expect($filter('openlmisCurrency')(23333.43)).toEqual('2 33 33,43\u00A0zł');
    }));

    it('should format money with currency symbol on right', inject(function($filter) {
        localeSettings['currencySymbol'] = 'zł';
        localeSettings['currencySymbolSide'] = 'right';
        localeSettings['currencyDecimalPlaces'] = 2;

        expect($filter('openlmisCurrency')(23.43)).toEqual('23.43\u00A0zł');
    }));

    it('should properly round up decimal places', inject(function($filter) {
        localeSettings['currencySymbol'] = 'zł';
        localeSettings['currencySymbolSide'] = 'right';
        localeSettings['currencyDecimalPlaces'] = 2;

        expect($filter('openlmisCurrency')(23.439999997)).toEqual('23.44\u00A0zł');
    }));

    it('should properly round up money values', inject(function($filter) {
        localeSettings['currencySymbol'] = '¥';
        localeSettings['currencySymbolSide'] = 'right';
        localeSettings['currencyDecimalPlaces'] = 0;

        expect($filter('openlmisCurrency')(22223.5)).toEqual('22,224\u00A0¥');
    }));

    it('should properly round down money values', inject(function($filter) {
        localeSettings['currencySymbol'] = '¥';
        localeSettings['currencySymbolSide'] = 'right';
        localeSettings['currencyDecimalPlaces'] = 0;

        expect($filter('openlmisCurrency')(22223.49)).toEqual('22,223\u00A0¥');
    }));

    it('should handle null value', inject(function($filter) {
        expect($filter('openlmisCurrency')(null)).toEqual(undefined);
    }));

    it('should handle undefined value', inject(function($filter) {
        expect($filter('openlmisCurrency')(undefined)).toEqual(undefined);
    }));

});
