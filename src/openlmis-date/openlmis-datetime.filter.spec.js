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

    var $filter, DEFAULT_DATETIME_FORMAT;

    beforeEach(function() {

        angular.mock.module("openlmis-date", function($provide){
            $provide.constant('DEFAULT_DATETIME_FORMAT', 'dd/MM/yyyy HH:mm:ss');
        });

        module('openlmis-date');

        inject(function(_$filter_, _DEFAULT_DATETIME_FORMAT_) {
           $filter = _$filter_;
           DEFAULT_DATETIME_FORMAT = _DEFAULT_DATETIME_FORMAT_;
        });
    });

    it('should return date in medium format', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', 'medium')).toEqual('Oct 1, 2017 12:55:12 PM');
    });

    it('should return date in short format', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', 'short')).toEqual('10/1/17 12:55 PM');
    });

    it('should return date in mediumTime format', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', 'mediumTime')).toEqual('12:55:12 PM');
    });

    it('should return date in shortTime format', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z', 'shortTime')).toEqual('12:55 PM');
    });

    it('should return date in default format', function() {
        expect($filter('openlmisDatetime')('2017-10-01T12:55:12Z')).toEqual('01/10/2017 12:55:12');
    });
});