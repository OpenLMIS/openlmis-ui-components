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

describe('openlmisDateFilter', function() {

    var $filter, localeSettings = {}, offset;

    beforeEach(function() {
        angular.mock.module('openlmis-date', function($provide) {
            $provide.constant('DEFAULT_DATE_FORMAT', 'shortDate');
        });

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

        localeSettings['timeZoneId'] = 'America/Los_Angeles';
        localeSettings['dateFormat'] = 'dd/MM/yyyy';
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
    });

    it('should return date in shortDate format if specified', function() {
        expect($filter('openlmisDate')('2017-10-01', 'shortDate', 'UTC')).toEqual('10/1/17');
    });

    it('should return date in longDate format if specified', function() {
        expect($filter('openlmisDate')('2017-10-01', 'longDate', 'UTC')).toEqual('October 1, 2017');
    });

    it('should return date in fullDate format if specified', function() {
        expect($filter('openlmisDate')('2017-10-01', 'fullDate', 'UTC')).toEqual('Sunday, October 1, 2017');
    });

    it('should return date in format specified and timezone from setting if set', function() {
        expect($filter('openlmisDate')('2017-10-01', 'shortDate')).toEqual('9/30/17');
    });

    it('should return date in format specified and timezone UTC if setting not set', function() {
        localeSettings['timeZoneId'] = undefined;

        expect($filter('openlmisDate')('2017-10-01', 'shortDate')).toEqual('10/1/17');
    });

    it('should return date in timezone specified and format from setting if set', function() {
        expect($filter('openlmisDate')('2017-10-01', undefined, 'UTC')).toEqual('01/10/2017');
    });

    it('should return date in timezone specified and default format if setting not set', function() {
        localeSettings['dateFormat'] = undefined;

        expect($filter('openlmisDate')('2017-10-01', undefined, 'UTC')).toEqual('10/1/17');
    });

    it('should return date in format and timezone from settings if set', function() {
        expect($filter('openlmisDate')('2017-10-01')).toEqual('30/09/2017');
    });

    it('should return date in default format and timezone UTC if settings not set', function() {
        localeSettings['timeZoneId'] = undefined;
        localeSettings['dateFormat'] = undefined;

        expect($filter('openlmisDate')('2017-10-01')).toEqual('10/1/17');
    });
});