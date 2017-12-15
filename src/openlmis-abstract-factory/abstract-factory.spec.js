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

describe('AbstractFactory', function() {

    var AbstractFactory;

    beforeEach(function() {
        module('openlmis-abstract-factory');

        inject(function($injector) {
            AbstractFactory = $injector.get('AbstractFactory');
        });
    });

    describe('constructor', function() {

        it('should throw exception when trying to instantiate without passing argument', function() {
            expect(function() {
                return new AbstractFactory();
            }).toThrow();
        });

        it('should throw exception when trying to instantiate by passing object', function() {
            expect(function() {
                return new AbstractFactory({});
            }).toThrow();
        });

        it('should instantiate Function was passed', function() {
            expect(function() {
                return new AbstractFactory(function() {});
            }).not.toThrow();
        });

    });

    describe('buildFromResponseArray', function() {

        var dateFactory, dateResponses, dates;

        beforeEach(function() {
            dateFactory = new AbstractFactory(function() {});

            dateResponses = [
                '2015-06-13T12:22:20Z',
                '2016-06-13T12:22:20Z',
                '2017-06-13T12:22:20Z'
            ];

            dates = {};
            dates[dateResponses[0]] = new Date();
            dates[dateResponses[1]] = new Date();
            dates[dateResponses[2]] = new Date();

            spyOn(dateFactory, 'buildFromResponse').andCallFake(function(dateResponse) {
                return dates[dateResponse];
            });
        });

        it('should call buildFromResponse for each response', function() {
            dateFactory.buildFromResponseArray(dateResponses);

            expect(dateFactory.buildFromResponse).toHaveBeenCalledWith(dateResponses[0]);
            expect(dateFactory.buildFromResponse).toHaveBeenCalledWith(dateResponses[1]);
            expect(dateFactory.buildFromResponse).toHaveBeenCalledWith(dateResponses[2]);
        });

        it('should return a list class instances', function() {
            var result = dateFactory.buildFromResponseArray(dateResponses);

            expect(result[0]).toEqual(dates[dateResponses[0]]);
            expect(result[1]).toEqual(dates[dateResponses[1]]);
            expect(result[2]).toEqual(dates[dateResponses[2]]);
        });

    });

});
