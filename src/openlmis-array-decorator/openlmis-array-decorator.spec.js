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

        this.objectsArray = [{
            id: 2
        }, {
            id: 0
        }, {
            id: 2
        }, {
            id: 1
        }, {
            id: 3
        }];

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
            var result = this.decoratedObjectsArray.filterById(2);

            expect(result).toEqual([
                this.objectsArray[0],
                this.objectsArray[2]
            ]);
        });

        it('should return object with ID equal to 0 if 0 is given', function() {
            var result = this.decoratedObjectsArray.filterById(0);

            expect(result).toEqual([
                this.objectsArray[1]
            ]);
        });

        it('should return empty list if no object matches', function() {
            var result = this.decoratedObjectsArray.filterById(5);

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

});