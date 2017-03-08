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

    var localStorageFactory, items, itemStorage, localStorageServiceSpy;

    beforeEach(function() {
        items = [
            {
                id: 1,
                name: 'item1'
            },
            {
                id: 2,
                name: 'item2'
            }
        ];

        module('openlmis-local-storage', function($provide) {
            localStorageServiceSpy = jasmine.createSpyObj('localStorageService', ['add', 'get']);
            localStorageServiceSpy.get.andCallFake(function(resourceName) {
                return resourceName === 'items' ? items : undefined;
            })
            $provide.factory('localStorageService', function() {
                return localStorageServiceSpy;
            });
        });

        inject(function(_localStorageFactory_) {
            localStorageFactory = _localStorageFactory_;
        });

        itemStorage = localStorageFactory('items');
    });

    describe('put', function() {

        var item;

        beforeEach(function() {
            item = {
                id: 3,
                name: 'item3'
            };
        })

        it('should put item', function() {
            itemStorage.put(item);

            expect(items.length).toBe(3);
            expect(items[2]).toEqual(item);
        });

        it('should update object if item with the same id exist', function() {
            item.id = 1;

            itemStorage.put(item);

            expect(items.length).toBe(2);
            expect(items[1]).toEqual(item);
        })

        it('should update storage', function() {
            itemStorage.put(item);

            expect(localStorageServiceSpy.add).toHaveBeenCalledWith('items', angular.toJson(items));
        });

        it('should not modify the storage object, unless the object is explicitly updated', function(){
            itemStorage.put(item);

            var firstItem = itemStorage.getBy('id', 3);
            expect(firstItem.name).toEqual('item3');

            firstItem.name = "foo bar"; // don't save this change

            var secondItem = itemStorage.getBy('id', 3);
            expect(secondItem.name).toEqual('item3');

            secondItem.name = "foo baz";
            itemStorage.put(secondItem); // just saved the item

            var thirdItem = itemStorage.getBy('id', 3);
            expect(thirdItem.name).toEqual('foo baz'); // a newly pulled item got the changes
        });

    });

    describe('getBy', function() {

        it('should get item by id', function() {
            var result = itemStorage.getBy('id', 1);

            expect(result).toEqual(items[0]);
        });

        it('should get item by name', function() {
            var result = itemStorage.getBy('name', 'item2');

            expect(result).toEqual(items[1]);
        });

    });

    describe('clearAll', function() {

        it('should remove all items', function() {
            itemStorage.clearAll();

            expect(items.length).toBe(0);
        });

        it('should update storage', function() {
            itemStorage.clearAll();

            expect(localStorageServiceSpy.add).toHaveBeenCalledWith('items', angular.toJson(items));
        })

    });

    describe('getAll', function() {

        it('should get all items', function() {
            var result = itemStorage.getAll();
            result.sort(compare);

            expect(result.length).toBe(2);
            expect(result[0]).toEqual(items[0]);
            expect(result[1]).toEqual(items[1]);
        });
    });

    describe('search', function() {

        it('should search with default filter by id', function() {
            var result = itemStorage.search({id: items[0].id});

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(items[0]);
        });

        it('should search with default filter by name', function() {
            var result = itemStorage.search({name: items[1].name});

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(items[1]);
        });

        it('should search with default filter by name and id', function() {
            var result = itemStorage.search({name: items[1].name, id: items[1].id});

            expect(result.length).toBe(1);
            expect(result[0]).toEqual(items[1]);
        });

        it('should failed to search with default filter by wrong name', function() {
            var result = itemStorage.search({name: items[0].name, id: items[1].id});

            expect(result.length).toBe(0);
        });
    });

    describe('removeBy', function() {

        it('should remove item by id', function() {
            var result,
                id = items[0].id;

            itemStorage.removeBy('id', id);
            result = itemStorage.getAll();

            expect(itemStorage.getBy('id', id)).toBe(undefined);
            expect(result.length).toBe(1);
        });

        it('should remove item by name', function() {
            var result,
                name = items[0].name;

            itemStorage.removeBy('name', name);
            result = itemStorage.getAll();

            expect(itemStorage.getBy('name', name)).toBe(undefined);
            expect(result.length).toBe(1);
        });

        it('should not remove item with wrong value', function() {
            var result;

            itemStorage.removeBy('name', 'otherName');
            result = itemStorage.getAll();
            result.sort(compare);

            expect(result.length).toBe(2);
            expect(result[0]).toEqual(items[0]);
            expect(result[1]).toEqual(items[1]);
        });
    });

    function compare(a, b) {
        if (a.id < b.id)
            return -1;
        if (a.id > b.id)
            return 1;
        return 0;
    }
});
