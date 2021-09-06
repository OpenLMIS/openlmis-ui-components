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

    beforeEach(function() {
        module('openlmis-date');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
            this.localeService = $injector.get('localeService');
            this.moment = $injector.get('moment');
        });

        this.localeSettings = {
            timeZoneId: 'America/Los_Angeles',
            dateTimeFormat: 'dd/MM/yyyy HH:mm:ssZ'
        };

        this.openlmisDateTimeFilter = this.$filter('openlmisDatetime');

        spyOn(this.localeService, 'getFromStorage').and.returnValue(this.localeSettings);
        spyOn(this.moment, 'tz').and.callThrough();
    });

    it('should return date in format and timezone specified', function() {
        expect(this.openlmisDateTimeFilter('2017-10-01T12:55:12Z', 'medium', 'UTC')).toEqual('Oct 1, 2017 12:55:12 PM');
    });

    it('should return date in format specified and timezone from setting', function() {
        expect(this.openlmisDateTimeFilter('2017-10-01T12:55:12Z', 'short')).toEqual('10/1/17 12:55 PM');
    });

    it('should return date in timezone specified and format from setting', function() {
        expect(this.openlmisDateTimeFilter('2017-10-01T12:55:12Z', undefined, 'UTC'))
            .toEqual('01/10/2017 12:55:12+0000');
    });

    it('should return date in format and timezone from settings', function() {
        expect(this.openlmisDateTimeFilter('2017-10-01T12:55:12Z')).toEqual('01/10/2017 12:55:12+0000');
    });
});
