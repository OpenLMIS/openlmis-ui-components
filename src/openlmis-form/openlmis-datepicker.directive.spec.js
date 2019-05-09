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

describe('Datepicker directive', function() {

    beforeEach(function() {
        this.initSuite = initSuite;
        this.compileElement = compileElement;
    });

    describe('for default date format', function() {

        beforeEach(function() {
            this.initSuite('dd/mm/yyyy');
        });

        it('should have datepicker element', function() {
            var elem = angular.element(this.element);

            expect(elem.find('input').datepicker).toBeDefined();
        });

        it('should set selected datepicker value', function() {
            var elem = angular.element(this.element);

            this.$timeout(function() {
                expect(elem.attr('value')).toEqual('31/01/2017');
            }, 100);
        });

        it('should remove timezone from selected date', function() {
            this.scope.startDate = new Date('2017-01-31T23:00:00.000Z');

            var elem = angular.element(this.element);

            this.$timeout(function() {
                expect(elem.attr('value')).toEqual('31/01/2017');
            }, 100);
        });

        it('should add disabled parameter', function() {
            var elem = angular.element(this.element);

            expect(elem.attr('disabled')).toEqual('disabled');
        });

        it('should remove disabled parameter if expression changes to false', function() {
            var elem = angular.element(this.element);

            expect(elem.attr('disabled')).toEqual('disabled');

            this.scope.isDisabled = true;
            this.scope.$apply();
            this.$timeout(function() {
                expect(elem.attr('disabled')).toEqual(undefined);
            }, 100);
        });

        it('should change this.scope value from Date to filtered iso string', function() {
            this.$timeout(function() {
                expect(this.scope.startDate).toEqual('2017-12-31');
            }, 100);
        });

        it('should not set start date if it is undefined', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.datepicker('getStartDate')).toEqual(-Infinity);
        });

        it('should set start date if it is defined', function() {
            this.scope = this.$rootScope.$new();
            this.scope.startDate = '2018-03-27';

            this.element = this.compileElement();

            expect(this.element.datepicker('getStartDate')).toEqual(new Date(this.scope.startDate));
        });

        it('should set start date to infinity if min date is set to undefined', function() {
            this.scope = this.$rootScope.$new();
            this.scope.startDate = '2018-03-27';

            this.element = this.compileElement();

            expect(this.element.datepicker('getStartDate')).toEqual(new Date(this.scope.startDate));

            this.scope.startDate = undefined;
            this.scope.$apply();

            expect(this.element.datepicker('getStartDate')).toEqual(-Infinity);
        });

        it('should set start date to a date specified in the min date', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.datepicker('getStartDate')).toEqual(-Infinity);

            this.scope.startDate = '2018-03-27';
            this.scope.$apply();

            expect(this.element.datepicker('getStartDate')).toEqual(new Date(this.scope.startDate));
        });

        it('should not set end date if it is undefined', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.datepicker('getStartDate')).toEqual(-Infinity);
        });

        it('should set end date if it is defined', function() {
            this.scope = this.$rootScope.$new();
            this.scope.endDate = '2018-03-27';

            this.element = this.compileElement();

            expect(this.element.datepicker('getEndDate')).toEqual(new Date(this.scope.endDate));
        });

        it('should set end date to infinity if min date is set to undefined', function() {
            this.scope = this.$rootScope.$new();
            this.scope.endDate = '2018-03-27';

            this.element = this.compileElement();

            expect(this.element.datepicker('getEndDate')).toEqual(new Date(this.scope.endDate));

            this.scope.endDate = undefined;
            this.scope.$apply();

            expect(this.element.datepicker('getEndDate')).toEqual(Infinity);
        });

        it('should set end date to a date specified in the max date', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.datepicker('getEndDate')).toEqual(Infinity);

            this.scope.endDate = '2018-03-27';
            this.scope.$apply();

            expect(this.element.datepicker('getEndDate')).toEqual(new Date(this.scope.endDate));
        });

        it('should show error if text is not a valid date', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('some text, definitely not date').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeTruthy();
        });

        it('should show error if day is 0', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('00/01/0000').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeTruthy();
        });

        it('should show error if month is 0', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('01/00/0000').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeTruthy();
        });

        it('should show error if day is over 31', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('32/01/0000').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeTruthy();
        });

        it('should show error if month is over 12', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('31/13/0000').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeTruthy();
        });

        it('should not show error if date is undefined', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();
        });

        it('should not show error for valid date', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('31/12/2018').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();
        });

        it('should update this.scope.value if date was entered with input', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            this.element.val('31/12/2018').trigger('input');
            this.scope.$apply();

            expect(this.scope.date).toEqual('2018-12-31');
        });

        it('should update this.scope.value if input was cleared', function() {
            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            this.element.val('31/12/2018').trigger('input');
            this.scope.$apply();

            expect(this.scope.date).toEqual('2018-12-31');
        });

        it('should set initial value if it was given', function() {
            this.scope = this.$rootScope.$new();

            this.scope.date = '1977-05-25';

            this.element = this.compileElement();

            expect(this.element.val()).toEqual('25/05/1977');
        });

    });

    describe('with custom date format', function() {

        it('should show errors if invalid date is given', function() {
            this.initSuite('mm/yyyy/dd');

            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('31/12/2018').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeTruthy();
        });

        it('should not show errors if valid date is given', function() {
            this.initSuite('MM/yyyy/dd');

            this.scope = this.$rootScope.$new();

            this.element = this.compileElement();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();

            this.element.val('12/2018/31').trigger('input');
            this.scope.$apply();

            expect(this.element.controller('ngModel').$error.invalidDate).toBeFalsy();
        });

    });

    function initSuite(dateFormat) {
        module('openlmis-form', function($provide) {
            $provide.constant('DEFAULT_DATEPICKER_FORMAT', dateFormat);
        });

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.$timeout = $injector.get('$timeout');
        });

        this.scope = this.$rootScope.$new();

        spyOn(console, 'error');

        this.scope.endDate = new Date('2017-12-31T23:00:00.000Z');
        this.scope.startDate = new Date('2017-01-31T23:00:00.000Z');
        this.scope.isDisabled = true;

        this.element = this.compileElement();
    }

    afterEach(function() {
        expect(console.error).not.toHaveBeenCalled();
        this.scope.$destroy();
        this.element = undefined;
    });

    function compileElement() {
        var element = this.$compile(
            '<input type="date" id="startDate" ng-model="date" min-date="startDate"' +
                'max-date="endDate" disabled="isDisabled"/>'
        )(this.scope);
        this.scope.$apply();
        return element;
    }
});
