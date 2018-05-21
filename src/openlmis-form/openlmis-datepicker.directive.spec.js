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

    'use strict';

    var $timeout, $compile, $rootScope, scope, element;

    describe('for default date format', function() {

        beforeEach(function() {
            initSuite('dd/mm/yyyy');
        });

        it('should apply template', function() {
            expect(element.html()).not.toEqual('');
        });

        it('should have datepicker element', function() {
            var elem = angular.element(element);
            expect(elem.find('input').datepicker).toBeDefined();
        });

        it('should set selected datepicker value', function() {
            var elem = angular.element(element);

            $timeout(function() {
                expect(elem.find('input').attr('value')).toEqual('31/01/2017');
            }, 100);
        });

        it('should remove timezone from selected date', function() {
            scope.startDate = new Date('2017-01-31T23:00:00.000Z');

            var elem = angular.element(element);

            $timeout(function() {
                expect(elem.find('input').attr('value')).toEqual('31/01/2017');
            }, 100);
        });

        it('should add disabled parameter', function() {
            var elem = angular.element(element);
            expect(elem.find('input').attr('disabled')).toEqual('disabled');
        });

        it('should remove disabled parameter if expression changes to false', function() {
            var elem = angular.element(element);
            expect(elem.find('input').attr('disabled')).toEqual('disabled');

            scope.isDisabled = true;
            scope.$apply();
            $timeout(function() {
                expect(elem.find('input').attr('disabled')).toEqual(undefined);
            }, 100);
        });

        it('should change scope value from Date to filtered iso string', function() {
            var elem = angular.element(element);

            $timeout(function() {
                expect(scope.startDate).toEqual('2017-12-31');
            }, 100);
        });

        it('should not set start date if it is undefined', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(getInputElement().datepicker('getStartDate')).toEqual(-Infinity);
        });

        it('should set start date if it is defined', function() {
            scope = $rootScope.$new();
            scope.startDate = '2018-03-27';

            element = compileElement();

            expect(getInputElement().datepicker('getStartDate')).toEqual(new Date(scope.startDate));
        });

        it('should set start date to infinity if min date is set to undefined', function() {
            scope = $rootScope.$new();
            scope.startDate = '2018-03-27';

            element = compileElement();

            expect(getInputElement().datepicker('getStartDate')).toEqual(new Date(scope.startDate));

            scope.startDate = undefined;
            scope.$apply();

            expect(getInputElement().datepicker('getStartDate')).toEqual(-Infinity);
        });

        it('should set start date to a date specified in the min date', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(getInputElement().datepicker('getStartDate')).toEqual(-Infinity);

            scope.startDate = '2018-03-27';
            scope.$apply();

            expect(getInputElement().datepicker('getStartDate')).toEqual(new Date(scope.startDate));
        });

        it('should not set end date if it is undefined', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(getInputElement().datepicker('getStartDate')).toEqual(-Infinity);
        });

        it('should set end date if it is defined', function() {
            scope = $rootScope.$new();
            scope.endDate = '2018-03-27';

            element = compileElement();

            expect(getInputElement().datepicker('getEndDate')).toEqual(new Date(scope.endDate));
        });

        it('should set end date to infinity if min date is set to undefined', function() {
            scope = $rootScope.$new();
            scope.endDate = '2018-03-27';

            element = compileElement();

            expect(getInputElement().datepicker('getEndDate')).toEqual(new Date(scope.endDate));

            scope.endDate = undefined;
            scope.$apply();

            expect(getInputElement().datepicker('getEndDate')).toEqual(Infinity);
        });

        it('should set end date to a date specified in the max date', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(getInputElement().datepicker('getEndDate')).toEqual(Infinity);

            scope.endDate = '2018-03-27';
            scope.$apply();

            expect(getInputElement().datepicker('getEndDate')).toEqual(new Date(scope.endDate));
        });

        it('should show error if text is not a valid date', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('some text, definitely not date').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(1);
        });

        it('should show error if day is 0', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('00/01/0000').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(1);
        });

        it('should show error if month is 0', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('01/00/0000').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(1);
        });

        it('should show error if day is over 31', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('32/01/0000').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(1);
        });

        it('should show error if month is over 12', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('31/13/0000').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(1);
        });

        it('should not show error if date is undefined', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);
        });

        it('should not show error for valid date', function() {
            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('31/12/2018').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);
        });

        it('should update scope.value if date was entered with input', function() {
            scope = $rootScope.$new();

            element = compileElement();

            element.find('input').val('31/12/2018').trigger('input');
            scope.$apply();

            expect(scope.date).toEqual('2018-12-31');
        });

        it('should update scope.value if input was cleared', function() {
            scope = $rootScope.$new();

            element = compileElement();

            element.find('input').val('31/12/2018').trigger('input');
            scope.$apply();

            expect(scope.date).toEqual('2018-12-31');
        });

        it('should set initial value if it was given', function() {
            scope = $rootScope.$new();

            scope.date = '1977-05-25';

            element = compileElement();

            expect(element.find('input').val()).toEqual('25/05/1977');
        });

    });

    describe('with custom date format', function() {

        it('should show errors if invalid date is given', function() {
            initSuite('mm/yyyy/dd');

            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('31/12/2018').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(1);
        });

        it('should not show errors if valid date is given', function() {
            initSuite('MM/yyyy/dd');

            scope = $rootScope.$new();

            element = compileElement();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);

            element.find('input').val('12/2018/31').trigger('input');
            scope.$apply();

            expect(element.find('li:contains("invalidDate")').length).toBe(0);
        });

    });

    function initSuite(dateFormat) {
        module('openlmis-templates');
        module('openlmis-form', function($provide) {
            $provide.constant('DEFAULT_DATEPICKER_FORMAT', dateFormat);
        });

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });

        scope = $rootScope.$new();

        spyOn(console, 'error');

        scope.endDate = new Date('2017-12-31T23:00:00.000Z');
        scope.startDate = new Date('2017-01-31T23:00:00.000Z');
        scope.isDisabled = true;

        element = compileElement();
    }

    afterEach(function() {
        expect(console.error).not.toHaveBeenCalled();
        scope.$destroy();
        element = undefined;
    });

    function getInputElement() {
        return element.find('input');
    }

    function compileElement() {
        var element = $compile(
            '<openlmis-datepicker input-id="startDate" value="date" min-date="startDate"' +
                'max-date="endDate" disabled="isDisabled">' +
            '</openlmis-datepicker>'
        )(scope);
        scope.$apply();
        return element;
    }
});
