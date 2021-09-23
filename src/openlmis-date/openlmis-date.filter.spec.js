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

    beforeEach(function() {

        module('openlmis-date');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
            this.localeService = $injector.get('localeService');
            this.moment = $injector.get('moment');
        });

        this.openlmisDateFilter = this.$filter('openlmisDate');
        this.localeSettings = {
            timeZoneId: 'UTC',
            dateFormat: 'dd/MM/yyyy'
        };

        spyOn(this.localeService, 'getFromStorage').andReturn(this.localeSettings);
        spyOn(this.moment, 'tz').andCallThrough();
    });

    it('should return date in shortDate format if specified', function() {
        expect(this.openlmisDateFilter('2017-10-01', 'shortDate', 'UTC')).toEqual('10/1/17');
    });

    it('should return date in longDate format if specified', function() {
        expect(this.openlmisDateFilter('2017-10-01', 'longDate', 'UTC')).toEqual('October 1, 2017');
    });

    it('should return date in fullDate format if specified', function() {
        expect(this.openlmisDateFilter('2017-10-01', 'fullDate', 'UTC')).toEqual('Sunday, October 1, 2017');
    });

    it('should return date in format specified and timezone from setting', function() {
        expect(this.openlmisDateFilter('2017-10-01', 'shortDate')).toEqual('10/1/17');
    });

    it('should return date in timezone specified and format from setting', function() {
        expect(this.openlmisDateFilter('2017-10-01', undefined, 'UTC')).toEqual('01/10/2017');
    });

    it('should return date in format and timezone from settings', function() {
        expect(this.openlmisDateFilter('2017-10-01')).toEqual('01/10/2017');
    });
});