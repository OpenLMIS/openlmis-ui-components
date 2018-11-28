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

    beforeEach(function() {
        module('openlmis-object-utils');

        var ObjectMapper;
        inject(function($injector) {
            ObjectMapper = $injector.get('ObjectMapper');
        });

        this.objectList = [
            {
                id: '1',
                name: 'Name1'
            }, {
                id: '2',
                name: 'Name2'
            }
        ];

        this.objectMapper = new ObjectMapper();
    });

    describe('map', function() {

        it('should map objects to id', function() {
            var result = this.objectMapper.map(this.objectList);

            expect(result[this.objectList[0].id]).toEqual(this.objectList[0]);
            expect(result[this.objectList[1].id]).toEqual(this.objectList[1]);
        });

        it('should map property to id if the property name was given', function() {
            var result = this.objectMapper.map(this.objectList, 'name');

            expect(result[this.objectList[0].id]).toEqual(this.objectList[0].name);
            expect(result[this.objectList[1].id]).toEqual(this.objectList[1].name);
        });

    });

});