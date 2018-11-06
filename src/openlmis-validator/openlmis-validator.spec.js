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

describe('OpenlmisValidator', function() {

    beforeEach(function() {
        module('openlmis-validator');

        var OpenlmisValidator;
        inject(function($injector) {
            OpenlmisValidator = $injector.get('OpenlmisValidator');
        });

        this.openlmisValidator = new OpenlmisValidator();
    });

    describe('validateExists', function() {

        beforeEach(function() {
            this.message = 'Value must be defined';
        });

        it('should throw exception with the given message when value is null', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateExists(null, message);
            }).toThrow(this.message);
        });

        it('should throw exception with the given message when value is undefined', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateExists(undefined, message);
            }).toThrow(this.message);
        });

        it('should not throw exception for 0', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateExists(0, message);
            }).not.toThrow();
        });

        it('should not throw exception if value is defined', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateExists({}, message);
            }).not.toThrow();
        });

        it('should throw exception if error message is undefined', function() {
            var openlmisValidator = this.openlmisValidator;

            expect(function() {
                openlmisValidator.validateExists({}, undefined);
            }).toThrow('Given error message must be defined');
        });

        it('should throw exception if error message is null', function() {
            var openlmisValidator = this.openlmisValidator;

            expect(function() {
                openlmisValidator.validateExists({}, null);
            }).toThrow('Given error message must be defined');
        });

    });

    describe('validateInstanceOf', function() {

        beforeEach(function() {
            this.message = 'Given object must be an instance of Array';
        });

        it('should throw exception if object is not an instance of the given class', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateInstanceOf('Not an Array', Array, message);
            }).toThrow(message);
        });

        it('should throw exception if class is undefined', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateInstanceOf([], undefined, message);
            }).toThrow('Given class must be defined');
        });

        it('should throw exception if class is null', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateInstanceOf([], null, message);
            }).toThrow('Given class must be defined');
        });

        it('should throw exception if error message is undefined', function() {
            var openlmisValidator = this.openlmisValidator;

            expect(function() {
                openlmisValidator.validateInstanceOf([], Array, undefined);
            }).toThrow('Given error message must be defined');
        });

        it('should throw exception if error message is null', function() {
            var openlmisValidator = this.openlmisValidator;

            expect(function() {
                openlmisValidator.validateInstanceOf([], Array, null);
            }).toThrow('Given error message must be defined');
        });

    });

    describe('validateLesserThan', function() {

        beforeEach(function() {
            this.message = 'Given number must be lesser than maximum';
        });

        it('should throw exception if the given number is greater than the given maximum', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(3, 2, message);
            }).toThrow(message);
        });

        it('should throw exception if the given number is equal to the given maximum', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(2, 2, message);
            }).toThrow(message);
        });

        it('should throw exception if 0 is equal to maximum', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(0, 0, message);
            }).toThrow(message);
        });

        it('should throw exception if 0 is greater than maximum', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(0, -1, message);
            }).toThrow();
        });

        it('should throw exception if the given number is undefined', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(undefined, 2, message);
            }).toThrow('Given number must be defined');
        });

        it('should throw exception if the given number is null', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(null, 2, message);
            }).toThrow('Given number must be defined');
        });

        it('should throw exception if the given maximum is undefined', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(2, undefined, message);
            }).toThrow('Given maximum must be defined');
        });

        it('should throw exception if the given maximum is null', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(2, null, message);
            }).toThrow('Given maximum must be defined');
        });

        it('should throw exception if the given error message is undefined', function() {
            var openlmisValidator = this.openlmisValidator;

            expect(function() {
                openlmisValidator.validateLesserThan(2, 2, undefined);
            }).toThrow('Given error message must be defined');
        });

        it('should throw exception if the given error message is null', function() {
            var openlmisValidator = this.openlmisValidator;

            expect(function() {
                openlmisValidator.validateLesserThan(2, 2, null);
            }).toThrow('Given error message must be defined');
        });

        it('should not throw exception if 0 is lesser than maximum', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(0, 2, message);
            }).not.toThrow();
        });

        it('should not throw exception if 0 if number is lesser than maximum', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateLesserThan(1, 2, message);
            }).not.toThrow();
        });

    });

    describe('validateObjectWithIdDoesNotExist', function() {

        beforeEach(function() {
            this.message = 'Object with the given ID exists';
            this.objects = [{
                id: 0
            }, {
                id: 1
            }];
        });

        it('should throw exception if object with the given ID is already in the list', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message,
                objects = this.objects;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(objects, 1, message);
            }).toThrow(message);
        });

        it('should not throw exception if object with the given ID is not in the list', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message,
                objects = this.objects;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(objects, 3, message);
            }).not.toThrow();
        });

        it('should throw exception if objects list is null', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(null, 3, message);
            }).toThrow('Given objects must be defined');
        });

        it('should throw exception if objects list is undefined', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(undefined, 3, message);
            }).toThrow('Given objects must be defined');
        });

        it('should throw exception if ID is null', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message,
                objects = this.objects;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(objects, null, message);
            }).toThrow('Given ID must be defined');
        });

        it('should throw exception if ID is undefined', function() {
            var openlmisValidator = this.openlmisValidator,
                message = this.message,
                objects = this.objects;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(objects, undefined, message);
            }).toThrow('Given ID must be defined');
        });

        it('should throw exception if error message is null', function() {
            var openlmisValidator = this.openlmisValidator,
                objects = this.objects;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(objects, 0, null);
            }).toThrow('Given error message must be defined');
        });

        it('should throw exception if error message is undefined', function() {
            var openlmisValidator = this.openlmisValidator,
                objects = this.objects;

            expect(function() {
                openlmisValidator.validateObjectWithIdDoesNotExist(objects, 0, undefined);
            }).toThrow('Given error message must be defined');
        });

    });

});