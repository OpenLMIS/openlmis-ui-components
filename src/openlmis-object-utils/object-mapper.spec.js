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

describe('ObjectMapper', function() {

    var ObjectMapper, $rootScope, objectMapper, objectList;

    beforeEach(function() {
        module('openlmis-object-utils');

        inject(function($injector) {
            ObjectMapper = $injector.get('ObjectMapper');
            $rootScope = $injector.get('$rootScope');
        });

        objectList = [
            { id: '1', name: 'Name1'},
            { id: '2', name: 'Name2'}
        ];

        objectMapper = new ObjectMapper();
    });

    describe('get', function() {

        it('should map objects', function() {
            var result;

            objectMapper.get(objectList)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(result).not.toBeUndefined();
            expect(result[objectList[0].id]).toEqual(objectList[0].name);
            expect(result[objectList[1].id]).toEqual(objectList[1].name);
        });

    });

});