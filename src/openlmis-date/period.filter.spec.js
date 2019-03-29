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

describe('periodFilter', function() {

    var $filter, period, localeSettings = {}, offset;

    beforeEach(function() {
        var localeServiceSpy = {
            getFromStorage: function() {
                return localeSettings;
            }
        };

        var momentSpy = {
            tz: function() {
                return {
                    format: function() {
                        return offset;
                    }
                };
            }
        };

        localeSettings['timeZoneId'] = 'UTC';
        localeSettings['dateFormat'] = 'M/d/yy';
        offset = '-07:00';

        module('openlmis-date', function($provide) {
            $provide.service('localeService', function() {
                return localeServiceSpy;
            });
            $provide.service('moment', function() {
                return momentSpy;
            });
        });

        inject(function($injector) {
            $filter = $injector.get('$filter');
        });

        period = {
            name: 'PeriodName',
            startDate: '2017-01-01',
            endDate: '2017-01-31'
        };
    });

    it('should return period string with name', function() {
        expect($filter('period')(period, true)).toEqual('PeriodName (1/1/17 - 1/31/17)');
    });

    it('should return period string without name', function() {
        expect($filter('period')(period, false)).toEqual('1/1/17 - 1/31/17');
    });
});