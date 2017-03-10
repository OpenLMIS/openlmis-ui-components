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

    var $filter, DEFAULT_DATE_FORMAT;

    beforeEach(function() {

        angular.mock.module("openlmis-date", function($provide){
            $provide.constant('DEFAULT_DATE_FORMAT', 'shortDate');
        });

        module('openlmis-date');

        inject(function(_$filter_, _DEFAULT_DATE_FORMAT_) {
           $filter = _$filter_;
           DEFAULT_DATE_FORMAT = _DEFAULT_DATE_FORMAT_;
        });
    });

    it('should return date in shortDate format', function() {
        expect($filter('openlmisDate')('2017-10-01', 'shortDate')).toEqual('10/1/17');
    });

    it('should return date in longDate format', function() {
        expect($filter('openlmisDate')('2017-10-01', 'longDate')).toEqual('October 1, 2017');
    });

    it('should return date in fullDate format', function() {
        expect($filter('openlmisDate')('2017-10-01', 'fullDate')).toEqual('Sunday, October 1, 2017');
    });

    it('should return date in default format', function() {
        expect($filter('openlmisDate')('2017-10-01')).toEqual('10/1/17');
    });
});