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

describe('paginationFactory', function() {

    beforeEach(function() {
        module('openlmis-pagination');

        inject(function($injector) {
            this.paginationFactory = $injector.get('paginationFactory');
        });

        this.items = [
            'itemOne', 'itemTwo', 'itemThree', 'itemFour', 'itemFive', 'itemSix', 'itemSeven',
            'itemEight', 'itemNine', 'itemTen', 'itemEleven'
        ];
    });

    it('getPage should return full page', function() {
        expect(this.paginationFactory.getPage(this.items, 0, 3)).toEqual([
            this.items[0], this.items[1], this.items[2]
        ]);
    });

    it('getPage should return last page correctly', function() {
        expect(this.paginationFactory.getPage(this.items, 3, 3)).toEqual([
            this.items[9], this.items[10]
        ]);
    });

    it('getPage should return empty array if the page is out of range', function() {
        expect(this.paginationFactory.getPage(this.items, 5, 3)).toEqual([]);
    });

});
