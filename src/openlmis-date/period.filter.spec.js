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

    beforeEach(function() {
        module('openlmis-date');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
            this.localeService = $injector.get('localeService');
            this.moment = $injector.get('moment');
        });

        this.localeSettings = {
            timeZoneId: 'UTC',
            dateFormat: 'M/d/yy'
        };

        this.period = {
            name: 'PeriodName',
            startDate: '2017-01-01',
            endDate: '2017-01-31'
        };

        this.periodFilter = this.$filter('period');

        spyOn(this.localeService, 'getFromStorage').and.returnValue(this.localeSettings);
        spyOn(this.moment, 'tz').and.callThrough();
    });

    it('should return period string with name', function() {
        expect(this.periodFilter(this.period, true)).toEqual('PeriodName (1/1/17 - 1/31/17)');
    });

    it('should return period string without name', function() {
        expect(this.periodFilter(this.period, false)).toEqual('1/1/17 - 1/31/17');
    });
});
