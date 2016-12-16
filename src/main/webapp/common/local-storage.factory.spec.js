/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */
describe('localStorageFactory', function() {

    var localStorageFactory, item1, item2, itemStorage;

    beforeEach(function() {
        module('openlmis-core');

        inject(function(_localStorageFactory_) {
            localStorageFactory = _localStorageFactory_;
        });

        item1 = {
            id: '1',
            name: 'item1'
        };
        item2 = {
            id: '2',
            name: 'item1'
        };

        itemStorage = localStorageFactory('items');
    });

    it('should get facility by id', function() {
        itemStorage.clearAll();

        itemStorage.put(item1);

        expect(itemStorage.get(item1.id)).toEqual(item1);
    });

    it('should update an object pulled from the datastore without saving it', function(){
        itemStorage.clearAll();

        itemStorage.put({
            id: 'foo',
            name: 'Foo'
        });
        var foo = itemStorage.get('foo');
        foo.name = 'Bar';
        // NOTE: foo has not been explicitly saved 

        var otherFoo = itemStorage.get('foo');
        expect(otherFoo.name).toBe('Bar');
    });

    it('should get all facilities', function() {
        itemStorage.clearAll();

        itemStorage.put(item1);
        itemStorage.put(item2);

        expect(itemStorage.getAll().sort(compare)).toEqual([item1, item2].sort(compare));
    });

    it('should clear all facilies', function() {
        itemStorage.clearAll();

        expect(itemStorage.getAll()).toEqual([]);

        itemStorage.put(item1);
        itemStorage.put(item2);

        expect(itemStorage.getAll().sort(compare)).toEqual([item1, item2].sort(compare));

        itemStorage.clearAll();

        expect(itemStorage.getAll()).toEqual([]);
    });

    it('should set index for item if it has no id', function() {
        var index;

        item1.id = undefined;
        index = itemStorage.put(item1);

        expect(itemStorage.get(index)).toEqual(item1);
    });

    function compare(a,b) {
        if (a.id < b.id)
            return -1;
        if (a.id > b.id)
            return 1;
        return 0;
    }
});
