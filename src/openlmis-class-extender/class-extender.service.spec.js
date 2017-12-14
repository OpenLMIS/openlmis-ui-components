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

describe('classExtender', function() {

    var classExtender;

    beforeEach(function() {
        module('openlmis-class-extender');

        inject(function($injector) {
            classExtender = $injector.get('classExtender');
        });
    });

    describe('extend', function() {

        var ORIGINAL_X_VALUE = 10;

        var ParentClass, ExtendingClass;

        beforeEach(function() {
            ParentClass = function() {};

            ParentClass.prototype.getX = getX;

            function getX() {
                return ORIGINAL_X_VALUE;
            }

            ExtendingClass = function() {};
        });

        it('should extend class', function() {
            classExtender.extend(ExtendingClass, ParentClass);

            expect(new ExtendingClass().getX()).toBe(ORIGINAL_X_VALUE);
        });

        it('should throw exception if extending class is undefined', function() {
            expect(function() {
                classExtender.extend(undefined, ParentClass);
            }).toThrow('The extending class must be defined');
        });

        it('should throw exception if parent class is undefined', function() {
            expect(function() {
                classExtender.extend(ExtendingClass, undefined);
            }).toThrow('The parent class must be defined');

        });

        it('should prevent two children from sharing the same prototype object', function() {
            var extendingClassX = 20,
                otherExtendingClassX = 46;

            function OtherExtendingClass() {}

            classExtender.extend(ExtendingClass, ParentClass);
            classExtender.extend(OtherExtendingClass, ParentClass);

            ExtendingClass.prototype.getX = function() {
                return extendingClassX;
            };

            OtherExtendingClass.prototype.getX = function() {
                return otherExtendingClassX;
            };

            expect(new ExtendingClass().getX()).toBe(extendingClassX);
            expect(new OtherExtendingClass().getX()).toBe(otherExtendingClassX);
        });

    });

});
