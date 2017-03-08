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

describe('categoryFactory', function() {

    var categoryFactory, products;

    beforeEach(function() {
        module('requisition-non-full-supply');

        inject(function($injector) {
            categoryFactory = $injector.get('categoryFactory');
        });

        products = [{
            $visible: true,
            programs: [{
                programId: '1',
                orderableCategoryDisplayName: 'Category Two'
            }, {
                programId: '2',
                orderableCategoryDisplayName: 'Category Three'
            }]
        }, {
            programs: [{
                programId: '4',
                orderableCategoryDisplayName: 'Category Four'
            }, {
                programId: '1',
                orderableCategoryDisplayName: 'Category Two'
            }]
        }, {
            $visible: true,
            programs: [{
                programId: '1',
                orderableCategoryDisplayName: 'Category One'
            }, {
                programId: '3',
                orderableCategoryDisplayName: 'Category Three'
            }]
        }];
    });

    it('should group products by categories', function() {
        expect(categoryFactory.groupProducts(products, '1')).toEqual([{
            name: 'Category Two',
            products: [
                products[0],
                products[1]
            ]
        }, {
            name: 'Category One',
            products: [
                products[2]
            ]
        }]);
    });

    it('should make product visible if the visibility is not set', function() {
        var result = categoryFactory.groupProducts(products, '1');

        expect(result[0].products[1].$visible).toEqual(true);
    });

});
