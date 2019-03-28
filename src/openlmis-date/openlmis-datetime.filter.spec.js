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

describe('openlmisDatetimeFilter', function() {

    var $filter, localeSettings = {}, offset = '-07:00';

    beforeEach(function() {
        angular.mock.module('openlmis-date', function($provide) {
            $provide.constant('DEFAULT_DATETIME_FORMAT', 'dd/MM/yyyy HH:mm:ss');
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
        localeSettings['dateTimeFormat'] = 'dd/MM/yyyy HH:mm:ssZ';
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

    it('should return date in format and timezone specified', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', 'medium', 'UTC')).toEqual('Oct 1, 2017 12:55:12 PM');
    });

    it('should return date in format specified and timezone from setting if set', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', 'short')).toEqual('10/1/17 5:55 AM');
    });

    it('should return date in format specified and timezone UTC if setting not set', function() {
        localeSettings['timeZoneId'] = undefined;

        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', 'short')).toEqual('10/1/17 12:55 PM');
    });

    it('should return date in timezone specified and format from setting if set', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', undefined, 'UTC'))
            .toEqual('01/10/2017 12:55:12+0000');
    });

    it('should return date in timezone specified and default format if setting not set', function() {
        localeSettings['dateTimeFormat'] = undefined;

        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', undefined, 'UTC')).toEqual('01/10/2017 12:55:12');
    });

    it('should return date in format and timezone from settings if set', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z')).toEqual('01/10/2017 05:55:12-0700');
    });

    it('should return date in default format and timezone UTC if settings not set', function() {
        localeSettings['timeZoneId'] = undefined;
        localeSettings['dateTimeFormat'] = undefined;

        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z')).toEqual('01/10/2017 12:55:12');
    });
});