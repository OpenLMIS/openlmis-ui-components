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

describe('UuidGenerator', function() {

    var UuidGenerator, generator;

    beforeEach(function() {
        module('openlmis-uuid');

        inject(function($injector) {
            UuidGenerator = $injector.get('UuidGenerator');
        });

        generator = new UuidGenerator();
    });

    describe('generate', function() {
        
        it('should generate UUIDv4', function() {
            var regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
                result = generator.generate();

            expect(regex.test(result.toUpperCase())).toBe(true);
        });
    });
});
