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

describe('OpenlmisArrayDecorator', function() {

    beforeEach(function() {
        module('openlmis-array-decorator');

        inject(function($injector) {
            this.OpenlmisArrayDecorator = $injector.get('OpenlmisArrayDecorator');
        });

        this.object = {
            id: 2,
            property: 'other'
        };

        this.idsArray = [
            'first-id',
            'second-id',
            'first-id',
            'third-id'
        ];

        this.objectsArray = [
            this.object,
            {
                id: 0,
                property: 'Middle Property',
                definedProperty: 'not undefined'
            },
            this.object,
            {
                id: 1,
                property: 'post Property'
            },
            {
                id: 3,
                property: 'First property'
            },
            angular.copy(this.object),
            {
                id: 7,
                property: 'latter property'
            }
        ];

        spyOn(console, 'warn');
    });

    describe('constructor', function() {

        it('should throw an exception if given object is not an Array', function() {
            var OpenlmisArrayDecorator = this.OpenlmisArrayDecorator;

            expect(function() {
                new OpenlmisArrayDecorator({});
            }).toThrow('Given object is not an instance of Array');
        });

        it('should throw an exception if given object is null', function() {
            var OpenlmisArrayDecorator = this.OpenlmisArrayDecorator;

            expect(function() {
                new OpenlmisArrayDecorator(null);
            }).toThrow('Given array is undefined');
        });

        it('should throw an exception if given object is undefined', function() {
            var OpenlmisArrayDecorator = this.OpenlmisArrayDecorator;

            expect(function() {
                new OpenlmisArrayDecorator(undefined);
            }).toThrow('Given array is undefined');
        });

        it('should log warning if array already has filterById method', function() {
            var array = [];
            array.filterById = function() {};

            expect(console.warn).not.toHaveBeenCalled();

            new this.OpenlmisArrayDecorator(array);

            expect(console.warn).toHaveBeenCalledWith('Given array already has filterById method');
        });

        it('should log warning if array already has getById method', function() {
            var array = [];
            array.getById = function() {};

            expect(console.warn).not.toHaveBeenCalled();

            new this.OpenlmisArrayDecorator(array);

            expect(console.warn).toHaveBeenCalledWith('Given array already has getById method');
        });

        it('should create an instance of Array', function() {
            expect(new this.OpenlmisArrayDecorator([]) instanceof Array).toBe(true);
        });

        it('should decorate object with filterById method', function() {
            var result = new this.OpenlmisArrayDecorator([]);

            expect(result.filterById).toBeDefined();
        });

        it('should decorate object with getById method', function() {
            var result = new this.OpenlmisArrayDecorator([]);

            expect(result.getById).toBeDefined();
        });

    });

    describe('filterById', function() {

        beforeEach(function() {
            this.decoratedObjectsArray = new this.OpenlmisArrayDecorator(this.objectsArray);
        });

        it('should return objects with the given ID', function() {
            var result = this.decoratedObjectsArray.filterById(2).asArray();

            expect(result).toEqual([
                this.objectsArray[0],
                this.objectsArray[2],
                this.objectsArray[5]
            ]);
        });

        it('should return object with ID equal to 0 if 0 is given', function() {
            var result = this.decoratedObjectsArray.filterById(0).asArray();

            expect(result).toEqual([
                this.objectsArray[1]
            ]);
        });

        it('should return empty list if no object matches', function() {
            var result = this.decoratedObjectsArray.filterById(5).asArray();

            expect(result).toEqual([]);
        });

        it('should throw exception when null is given', function() {
            var decoratedObjectsArray = this.decoratedObjectsArray;

            expect(function() {
                decoratedObjectsArray.filterById(null);
            }).toThrow('Given ID is undefined');
        });

        it('should throw exception when undefined is given', function() {
            var decoratedObjectsArray = this.decoratedObjectsArray;

            expect(function() {
                decoratedObjectsArray.filterById(undefined);
            }).toThrow('Given ID is undefined');
        });

    });

    describe('getById', function() {

        beforeEach(function() {
            this.decoratedObjectsArray = new this.OpenlmisArrayDecorator(this.objectsArray);
        });

        it('should return object with the given ID', function() {
            var result = this.decoratedObjectsArray.getById(1);

            expect(result).toEqual(this.objectsArray[3]);
        });

        it('should return object with ID equal to 0 if 0 is given', function() {
            var result = this.decoratedObjectsArray.getById(0);

            expect(result).toEqual(this.objectsArray[1]);
        });

        it('should return undefined if object with the given ID does not exist', function() {
            var result = this.decoratedObjectsArray.getById(6);

            expect(result).toBeUndefined();
        });

        it('should throw exception when there are multiple objects with the same ID', function() {
            var decoratedObjectsArray = this.decoratedObjectsArray;

            expect(function() {
                decoratedObjectsArray.getById(2);
            }).toThrow('Array contains multiple objects with the same ID');
        });

        it('should throw exception when null is given', function() {
            var decoratedObjectsArray = this.decoratedObjectsArray;

            expect(function() {
                decoratedObjectsArray.getById(null);
            }).toThrow('Given ID is undefined');
        });

        it('should throw exception when undefined is given', function() {
            var decoratedObjectsArray = this.decoratedObjectsArray;

            expect(function() {
                decoratedObjectsArray.getById(undefined);
            }).toThrow('Given ID is undefined');
        });

    });

    describe('sortBy', function() {

        beforeEach(function() {
            this.decoratedObjectsArray = new this.OpenlmisArrayDecorator(angular.copy(this.objectsArray));
        });

        it('should sort by given property in alphabetical order ignoring casing', function() {
            this.decoratedObjectsArray.sortBy('property');

            expect(this.decoratedObjectsArray[0]).toEqual(this.objectsArray[4]);
            expect(this.decoratedObjectsArray[1]).toEqual(this.objectsArray[6]);
            expect(this.decoratedObjectsArray[2]).toEqual(this.objectsArray[1]);
            expect(this.decoratedObjectsArray[3]).toEqual(this.objectsArray[0]);
            expect(this.decoratedObjectsArray[4]).toEqual(this.objectsArray[2]);
            expect(this.decoratedObjectsArray[5]).toEqual(this.objectsArray[5]);
            expect(this.decoratedObjectsArray[6]).toEqual(this.objectsArray[3]);
        });

    });

    describe('getAllWithUniqueIds', function() {

        beforeEach(function() {
            this.decoratedObjectsArray = new this.OpenlmisArrayDecorator(this.objectsArray);
        });

        it('should return without duplicates', function() {
            var result = this.decoratedObjectsArray.getAllWithUniqueIds().asArray();

            expect(result).toEqual([
                this.objectsArray[0],
                this.objectsArray[1],
                this.objectsArray[3],
                this.objectsArray[4],
                this.objectsArray[6]
            ]);
        });

    });

    describe('getUnique', function() {

        beforeEach(function() {
            this.decoratedObjectsArray = new this.OpenlmisArrayDecorator(this.idsArray);
        });

        it('should return without duplicates', function() {
            var result = this.decoratedObjectsArray.getUnique();

            expect(result).toEqual([
                this.idsArray[0],
                this.idsArray[1],
                this.idsArray[3]
            ]);
        });

    });

    describe('pushAll', function() {

        beforeEach(function() {
            this.decoratedObjectsArray = new this.OpenlmisArrayDecorator(this.objectsArray);
        });

        it('should add all items from the given list to this list', function() {
            var objects = [{
                id: 'new-object-one'
            }, {
                id: 'new-object-two'
            }];

            this.decoratedObjectsArray.pushAll(objects);

            expect(this.decoratedObjectsArray.indexOf(objects[0])).toBeGreaterThan(-1);
            expect(this.decoratedObjectsArray.indexOf(objects[1])).toBeGreaterThan(-1);
        });

    });

    describe('asArray', function() {

        it('should convert the decorated array to a pure JS array', function() {
            var expected = angular.copy(this.objectsArray);

            expect(new this.OpenlmisArrayDecorator(this.objectsArray).asArray()).toEqual(expected);
        });

    });

    describe('mapTo', function() {

        beforeEach(function() {
            this.result = new this.OpenlmisArrayDecorator(this.objectsArray).mapTo('property');
        });

        it('should map objects to the given property', function() {
            expect(this.result.asArray()).toEqual([
                'other',
                'Middle Property',
                'other',
                'post Property',
                'First property',
                'other',
                'latter property'
            ]);
        });

    });

    describe('filterOutUndefined', function() {

        beforeEach(function() {
            this.decoratedObjectsArray = new this.OpenlmisArrayDecorator(this.objectsArray);
        });

        it('should return a list of objects which have the property set if the property name is defined', function() {
            expect(this.decoratedObjectsArray.filterOutUndefined('definedProperty').asArray()).toEqual([
                this.objectsArray[1]
            ]);
        });

        it('should return a list of defined object if property name was not defined', function() {
            this.decoratedObjectsArray.push(undefined);

            expect(this.decoratedObjectsArray.length).toEqual(8);

            var result = this.decoratedObjectsArray.filterOutUndefined().asArray();

            expect(result.length).toEqual(7);
            expect(result.indexOf(undefined)).toEqual(-1);
        });

    });

    describe('filter', function() {

        it('should return a decorated array', function() {
            expect(new this.OpenlmisArrayDecorator(this.objectsArray).filter(function(item) {
                return item;
            }).mapTo).not.toBeUndefined();
        });

    });

});