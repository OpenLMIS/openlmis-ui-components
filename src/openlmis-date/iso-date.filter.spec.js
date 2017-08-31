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

describe('isoDate', function() {

    var $filter;

    beforeEach(function() {
        module('openlmis-date');

        inject(function($injector) {
           $filter = $injector.get('$filter');
        });
    });

    it('should return ISO string without time part', function() {
        var date = new Date();
        expect($filter('isoDate')(date)).toEqual($filter('date')(date, 'yyyy-MM-dd'));
    });

    it('should return null if given parameter is null', function() {
        var date = null;
        expect($filter('isoDate')(date)).toBe(null);
    });

    it('should return parameter value if given parameter is not Date object', function() {
        var date = '2017-12-8';
        expect($filter('isoDate')(date)).toBe(date);
    });
});
