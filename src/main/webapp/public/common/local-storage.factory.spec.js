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
        itemStorage.put(item1);

        expect(itemStorage.get(item1.id)).toEqual(item1);
    });

    it('should get all facilies', function() {
        itemStorage.put(item1);
        itemStorage.put(item2);

        expect(itemStorage.getAll()).toEqual([item1, item2]);
    });

    it('should clear all facilies', function() {
        expect(itemStorage.getAll()).toEqual([]);

        itemStorage.put(item1);
        itemStorage.put(item2);

        expect(itemStorage.getAll()).toEqual([item1, item2]);

        itemStorage.clearAll();

        expect(itemStorage.getAll()).toEqual([]);
    });

    it('should not change item in storage after getting it and modify it outside the storage factory', function() {
        var object;

        itemStorage.put(item1);
        object = itemStorage.get(item1.id);

        expect(object).toEqual(item1);

        object.name = 'wasd';

        expect(itemStorage.get(item1.id).name).toEqual(item1.name);
        expect(itemStorage.get(item1.id).name).toEqual('item1');
    });

    it('should set index for item if it has no id', function() {
        var index;

        item1.id = undefined;
        index = itemStorage.put(item1);

        expect(itemStorage.get(index)).toEqual(item1);
    });
});
