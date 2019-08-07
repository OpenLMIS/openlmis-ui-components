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

describe('openlmisBsDatetimeFilter', function() {

    beforeEach(function() {
        module('openlmis-datetime');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
        });

        this.openlmisBsDatetimeFilter = this.$filter('openlmisBsDatetime');
    });

    it('should return a string for valid date', function() {
        expect(this.openlmisBsDatetimeFilter('2019-06-18T09:40:07.825Z')).toEqual('06/18/2019 9:40 AM');
    });

    it('should return undefined if date time is undefined', function() {
        expect(this.openlmisBsDatetimeFilter()).toBeUndefined();
    });

});