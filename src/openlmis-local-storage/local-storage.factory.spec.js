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

describe('localStorageFactory', function() {

    beforeEach(function() {
        module('openlmis-local-storage');

        inject(function($injector) {
            this.localStorageService = $injector.get('localStorageService');
            this.localStorageFactory = $injector.get('localStorageFactory');
        });

        this.items = [{
            id: 1,
            name: 'item1'
        },
        {
            id: 2,
            name: 'item2'
        }];

        var items = this.items;
        spyOn(this.localStorageService, 'add');
        spyOn(this.localStorageService, 'get').andCallFake(function(resourceName) {
            return resourceName === 'items' ? items : undefined;
        });

        this.itemsLocalStorage = this.localStorageFactory('items');

        this.compare = function(a, b) {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        };
    });

    describe('put', function() {

        beforeEach(function() {
            this.item = {
                id: 3,
                name: 'item3'
            };
        });

        it('should put item', function() {
            this.itemsLocalStorage.put(this.item);

            expect(this.items.length).toBe(3);
            expect(this.items[2]).toEqual(this.item);
        });

        it('should update object if item with the same id exist', function() {
            this.item.id = 1;

            this.itemsLocalStorage.put(this.item);

            expect(this.items.length).toBe(2);
            expect(this.items[1]).toEqual(this.item);
        });

        it('should update storage', function() {
            this.itemsLocalStorage.put(this.item);

            expect(this.localStorageService.add).toHaveBeenCalledWith('items', angular.toJson(this.items));
        });

        it('should not modify the storage object, unless the object is explicitly updated', function() {
            this.itemsLocalStorage.put(this.item);

            var firstItem = this.itemsLocalStorage.getBy('id', 3);

            expect(firstItem.name).toEqual('item3');

            // don't save this change
            firstItem.name = 'foo bar';

            var secondItem = this.itemsLocalStorage.getBy('id', 3);

            expect(secondItem.name).toEqual('item3');

            secondItem.name = 'foo baz';
            // just saved the item
            this.itemsLocalStorage.put(secondItem);

            var thirdItem = this.itemsLocalStorage.getBy('id', 3);
            // a newly pulled item got the changes
            expect(thirdItem.name).toEqual('foo baz');
        });

    });

    describe('putAll', function() {

        beforeEach(function() {
            this.putAllItems = [{
                id: 3,
                name: 'item3'
            },
            {
                id: 4,
                name: 'item4'
            }];
        });

        it('should put all items', function() {
            this.itemsLocalStorage.putAll(this.putAllItems);

            expect(this.putAllItems.length).toBe(2);
        });

        it('should update storage', function() {
            this.itemsLocalStorage.putAll(this.putAllItems);

            expect(this.localStorageService.add).toHaveBeenCalledWith('items', angular.toJson(this.putAllItems));
        });
    });

    describe('getBy', function() {

        it('should get item by id', function() {
            var result = this.itemsLocalStorage.getBy('id', 1);

            expect(result).toEqual(this.items[0]);
        });

        it('should get item by name', function() {
            var result = this.itemsLocalStorage.getBy('name', 'item2');

            expect(result).toEqual(this.items[1]);
        });

    });

    describe('clearAll', function() {

        it('should remove all items', function() {
            this.itemsLocalStorage.clearAll();

            expect(this.items.length).toBe(0);
        });

        it('should update storage', function() {
            this.itemsLocalStorage.clearAll();

            expect(this.localStorageService.add).toHaveBeenCalledWith('items', angular.toJson(this.items));
        });

    });

    describe('getAll', function() {

        it('should get all items', function() {
            var result = this.itemsLocalStorage.getAll();
            result.sort(this.compare);

            expect(result.length).toBe(2);
            expect(result[0]).toEqual(this.items[0]);
            expect(result[1]).toEqual(this.items[1]);
        });
    });

    describe('search', function() {

        it('should search with default filter by id', function() {
            var result = this.itemsLocalStorage.search({
                id: this.items[0].id
            });

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(this.items[0]);
        });

        it('should search with default filter by name', function() {
            var result = this.itemsLocalStorage.search({
                name: this.items[1].name
            });

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(this.items[1]);
        });

        it('should search with default filter by name and id', function() {
            var result = this.itemsLocalStorage.search({
                name: this.items[1].name,
                id: this.items[1].id
            });

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(this.items[1]);
        });

        it('should failed to search with default filter by wrong name', function() {
            var result = this.itemsLocalStorage.search({
                name: this.items[0].name,
                id: this.items[1].id
            });

            expect(result.length).toBe(0);
        });
    });

    describe('removeBy', function() {

        it('should remove item by id', function() {
            var result,
                id = this.items[0].id;

            this.itemsLocalStorage.removeBy('id', id);
            result = this.itemsLocalStorage.getAll();

            expect(this.itemsLocalStorage.getBy('id', id)).toBe(undefined);
            expect(result.length).toBe(1);
        });

        it('should remove item by name', function() {
            var result,
                name = this.items[0].name;

            this.itemsLocalStorage.removeBy('name', name);
            result = this.itemsLocalStorage.getAll();

            expect(this.itemsLocalStorage.getBy('name', name)).toBe(undefined);
            expect(result.length).toBe(1);
        });

        it('should not remove item with wrong value', function() {
            var result;

            this.itemsLocalStorage.removeBy('name', 'otherName');
            result = this.itemsLocalStorage.getAll();
            result.sort(this.compare);

            expect(result.length).toBe(2);
            expect(result[0]).toEqual(this.items[0]);
            expect(result[1]).toEqual(this.items[1]);
        });
    });
});
