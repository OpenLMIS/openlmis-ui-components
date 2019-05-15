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

describe('ParameterSplitter', function() {

    beforeEach(function() {
        this.prepareSuite = function() {
            var maxUriLength = this.maxUriLength;
            module('openlmis-repository', function($provide) {
                $provide.constant('MAX_URI_LENGTH', maxUriLength);
            });

            inject(function($injector) {
                this.ParameterSplitter = $injector.get('ParameterSplitter');
            });

            this.uri = '/someUri';
        };
    });

    describe('split', function() {

        it('should return params as array even without splitting', function() {
            this.maxUriLength = 200;

            this.prepareSuite();

            this.params = {
                some: 'param'
            };

            var result = new this.ParameterSplitter().split(this.uri, this.params);

            expect(result).toEqual([this.params]);
        });

        it('should split parameter with the biggest number of values', function() {
            this.maxUriLength = 100;

            this.prepareSuite();

            this.params = {
                paramOne: 'very long parameter, event longer than that paramTwo',
                paramTwo: [
                    'valueOne',
                    'valueTwo'
                ]
            };

            var result = new this.ParameterSplitter().split(this.uri, this.params);

            expect(result).toEqual([{
                paramOne: this.params.paramOne,
                paramTwo: [
                    'valueOne'
                ]
            }, {
                paramOne: this.params.paramOne,
                paramTwo: [
                    'valueTwo'
                ]
            }]);
        });

        it('should always split parameters with the biggest number of values', function() {
            this.maxUriLength = 84;

            this.prepareSuite();

            this.params = {
                paramOne: [
                    'valueOne',
                    'valueTwo',
                    'valueThree',
                    'valueFour'
                ],
                paramTwo: [
                    'valueFive',
                    'valueSix',
                    'valueSeven'
                ]
            };

            var result = new this.ParameterSplitter().split(this.uri, this.params);

            expect(result.length).toEqual(4);
            expect(result[0]).toEqual({
                paramOne: [
                    'valueOne',
                    'valueTwo'
                ],
                paramTwo: [
                    'valueFive',
                    'valueSix'
                ]
            });

            expect(result[1]).toEqual({
                paramOne: [
                    'valueOne',
                    'valueTwo'
                ],
                paramTwo: [
                    'valueSeven'
                ]
            });

            expect(result[2]).toEqual({
                paramOne: [
                    'valueThree',
                    'valueFour'
                ],
                paramTwo: [
                    'valueFive',
                    'valueSix'
                ]
            });

            expect(result[3]).toEqual({
                paramOne: [
                    'valueThree',
                    'valueFour'
                ],
                paramTwo: [
                    'valueSeven'
                ]
            });
        });

        it('should stop splitting parameters if all params have only one value', function() {
            this.maxUriLength = 2;

            this.prepareSuite();

            var result = new this.ParameterSplitter().split(this.uri, {
                some: [
                    'long',
                    'param',
                    'array',
                    'too',
                    'long',
                    'to',
                    'send',
                    'as',
                    'one',
                    'request'
                ]
            });

            expect(result.length).toBe(10);
            expect(result[0]).toEqual({
                some: ['long']
            });

            expect(result[1]).toEqual({
                some: ['param']
            });

            expect(result[2]).toEqual({
                some: ['array']
            });

            expect(result[3]).toEqual({
                some: ['too']
            });

            expect(result[4]).toEqual({
                some: ['long']
            });

            expect(result[5]).toEqual({
                some: ['to']
            });

            expect(result[6]).toEqual({
                some: ['send']
            });

            expect(result[7]).toEqual({
                some: ['as']
            });

            expect(result[8]).toEqual({
                some: ['one']
            });

            expect(result[9]).toEqual({
                some: ['request']
            });
        });

        it('should not miss any value for odd values count', function() {
            this.maxUriLength = 29;

            this.prepareSuite();

            var result = new this.ParameterSplitter().split(this.uri, {
                some: [
                    'long',
                    'param',
                    'array'
                ]
            });

            expect(result.length).toBe(2);
            expect(result[0]).toEqual({
                some: ['long', 'param']
            });

            expect(result[1]).toEqual({
                some: ['array']
            });
        });

        it('should return undefined as list if params are not given', function() {
            this.prepareSuite();

            var result = new this.ParameterSplitter().split(this.uri, undefined);

            expect(result).toEqual([undefined]);
        });

    });

});