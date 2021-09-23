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

describe('Unique ID Service', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.uniqueIdService = $injector.get('uniqueIdService');
        });
    });

    it('generates a unique id that is a string', function() {
        var id = this.uniqueIdService.generate();

        expect(typeof(id)).toBe('string');
    });

    describe('makes unique ids for DOM', function() {
        beforeEach(inject(function(shortid) {
            var randomIds = ['ABC', 'DEF', 'GHI'];
            spyOn(shortid, 'gen').andCallFake(function() {
                return randomIds.shift();
            });
        }));

        it('will not return an id that exists as a current DOM element', function() {
            var div = document.createElement('div');
            div.id = 'ABC';
            document.body.appendChild(div);

            var id = this.uniqueIdService.generate();

            expect(id).not.toBe('ABC');
        });
    });
});
