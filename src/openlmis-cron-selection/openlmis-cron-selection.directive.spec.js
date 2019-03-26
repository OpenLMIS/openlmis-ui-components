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

describe('<openlmis-cron-selection/>', function() {

    beforeEach(function() {
        module('openlmis-cron-selection');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
            this.messageService = $injector.get('messageService');
        });

        this.compileElement = compileElement;

        this.scope = this.$rootScope.$new();
        this.scope.cronExpression = '0 30 13 * * *';

        var translations = {
            'openlmisCronSelection.weekly': 'weekly',
            'openlmisCronSelection.daily': 'daily',
            'openlmisCronSelection.hourOutOfRange': 'hourOutOfRange',
            'openlmisCronSelection.minuteOutOfRange': 'minuteOutOfRange',
            'openlmisCronSelection.invalidCron': 'invalidCron',
            'openlmisCronSelection.sunday': 'sunday',
            'openlmisCronSelection.monday': 'monday',
            'openlmisCronSelection.tuesday': 'tuesday',
            'openlmisCronSelection.wednesday': 'wednesday',
            'openlmisCronSelection.thursday': 'thursday',
            'openlmisCronSelection.friday': 'friday',
            'openlmisCronSelection.saturday': 'saturday',
            'openlmisForm.required': 'required'
        };

        spyOn(this.messageService, 'get').andCallFake(function(key) {
            return translations[key];
        });
    });

    function compileElement(markup) {
        var element = this.$compile(markup || '<openlmis-cron-selection ng-model="cronExpression"/>')(this.scope);
        this.$rootScope.$apply();
        return element;
    }

    describe('occurrence selector', function() {

        it('should show selector for daily/weekly', function() {
            var element = this.compileElement();

            var occurrentSelect = element.find('#occurrence');

            expect(occurrentSelect.first()).toBeDefined();
            expect(occurrentSelect.find('option[label="daily"]').get(0)).toBeDefined();
            expect(occurrentSelect.find('option[label="weekly"]').get(0)).toBeDefined();
        });

        it('should set occurrence to weekly if initial cron expression is weekly', function() {
            this.scope.cronExpression = '0 30 13 * * 3';

            var element = this.compileElement();

            expect(element.find('#occurrence').val()).toEqual('string:Weekly');
        });

        it('should set occurrence to daily if initial cron expression is daily', function() {
            var element = this.compileElement();

            expect(element.find('#occurrence').val()).toEqual('string:Daily');
        });

        it('should update model after changing from daily to weekly', function() {
            var element = this.compileElement();

            element.find('select#occurrence').val('string:Weekly')
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 13 * * 0');
        });

        it('should update model after changing from weekly to daily', function() {
            this.scope.cronExpression = '0 30 13 * * 1';

            var element = this.compileElement();

            element.find('select#occurrence').val('string:Daily')
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 13 * * *');
        });

        it('should update model to undefined if occurrence is not selected', function() {
            var element = this.compileElement();

            element.find('select#occurrence').val('')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should be required', function() {
            var element = this.compileElement();

            expect(element.find('select#occurrence')
                .prop('required')).toBe(true);
        });

    });

    describe('weekday selector', function() {

        it('should show weekday selector if weekly is selected', function() {
            var element = this.compileElement();

            expect(element.find('select#weekday').parents('.ng-hide')
                .get(0)).toBeDefined();

            element.find('#occurrence').val('string:Weekly')
                .change();
            this.$rootScope.$apply();

            expect(element.find('select#weekday').parents('.ng-hide')
                .get(0)).toBeUndefined();

            var weekdaySelect = element.find('select#weekday');

            expect(weekdaySelect.find('option[label="sunday"]').get(0)).toBeDefined();
            expect(weekdaySelect.find('option[label="monday"]').get(0)).toBeDefined();
            expect(weekdaySelect.find('option[label="tuesday"]').get(0)).toBeDefined();
            expect(weekdaySelect.find('option[label="wednesday"]').get(0)).toBeDefined();
            expect(weekdaySelect.find('option[label="thursday"]').get(0)).toBeDefined();
            expect(weekdaySelect.find('option[label="friday"]').get(0)).toBeDefined();
            expect(weekdaySelect.find('option[label="saturday"]').get(0)).toBeDefined();
        });

        it('should not show weekday selector if daily is selected', function() {
            var element = this.compileElement();

            expect(element.find('select#weekday').parents('.ng-hide')
                .get(0)).toBeDefined();

            element.find('#occurrence').val('string:Daily')
                .change();
            this.$rootScope.$apply();

            expect(element.find('select#weekday').parents('.ng-hide')
                .get(0)).toBeDefined();
        });

        it('should set weekday for initial cron expression', function() {
            this.scope.cronExpression = '0 30 13 * * 1';

            var element = this.compileElement();

            var weekdayValue = element.find('#weekday').val();

            expect(element.find('#weekday').find('[value=\'' + weekdayValue + '\']')
                .attr('label')).toEqual('monday');
        });

        it('should update model after changing weekday', function() {
            this.scope.cronExpression = '0 30 13 * * 1';

            var element = this.compileElement();

            var value = element.find('select#weekday').find('[label="tuesday"]')
                .attr('value');

            element.find('select#weekday').val(value)
                .change();
            this.$rootScope.$apply();

            expect(this.scope.cronExpression).toEqual('0 30 13 * * 2');
        });

        it('should update model to undefined if weekday is not selected', function() {
            this.scope.cronExpression = '0 30 13 * * 4';

            var element = this.compileElement();

            element.find('select#weekday').val('')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should update model after selecting Sunday', function() {
            this.scope.cronExpression = '0 30 13 * * 4';

            var element = this.compileElement();

            element.find('select#weekday').val('string:openlmisCronSelection.sunday')
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 13 * * 0');
        });

        it('should make weekday selection required if weekly digest is selected', function() {
            this.scope.cronExpression = '0 30 13 * * 4';

            var element = this.compileElement();

            expect(element.find('select#weekday')
                .prop('required')).toBe(true);
        });

        it('should make weekday selection optional if daily digest is selected', function() {
            var element = this.compileElement();

            expect(element.find('select#weekday')
                .prop('required')).toBe(false);
        });

    });

    describe('hour input', function() {

        it('should show hour input', function() {
            var element = this.compileElement();

            expect(element.find('input#hour').get(0)).toBeDefined();
        });

        it('should set hour for initial cron expression', function() {
            var element = this.compileElement();

            expect(element.find('input#hour').val()).toEqual('13');
        });

        it('should update model after changing hour', function() {
            var element = this.compileElement();

            element.find('input#hour').val('12')
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 12 * * *');
        });

        it('should update model to undefined if hour is not selected', function() {
            var element = this.compileElement();

            element.find('input#hour').val('')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should update model after setting hour to 0', function() {
            var element = this.compileElement();

            element.find('input#hour').val('0')
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 0 * * *');
        });

        it('should update model to undefined after changing hour to 24', function() {
            var element = this.compileElement();

            element.find('input#hour').val('24')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should update model to undefined after changing hour to over 24', function() {
            var element = this.compileElement();

            element.find('input#hour').val('600')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should update model to undefined after changing hour to negative number', function() {
            var element = this.compileElement();

            element.find('input#hour').val('-1')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should be required', function() {
            var element = this.compileElement();

            expect(element.find('input#hour')
                .prop('required')).toBe(true);
        });

        it('should show error after changing hour to 24', function() {
            var element = this.compileElement();

            element
                .find('input#hour')
                .val('24')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing hour to over 24', function() {
            var element = this.compileElement();

            element
                .find('input#hour')
                .val('600')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing hour to negative number', function() {
            var element = this.compileElement();

            element
                .find('input#hour')
                .val('-1')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeDefined();
        });

        it('should not show hour our of range error for undefined hour', function() {
            var element = this.compileElement();

            element
                .find('input#hour')
                .val('')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeUndefined();
        });

    });

    describe('minute input', function() {

        it('should show minute input', function() {
            var element = this.compileElement();

            expect(element.find('input#minute').get(0)).toBeDefined();
        });

        it('should set minutes for initial cron expression', function() {
            var element = this.compileElement();

            expect(element.find('input#minute').val()).toEqual('30');
        });

        it('should update model after changing minute', function() {
            var element = this.compileElement();

            element.find('input#minute').val('45')
                .change();

            expect(this.scope.cronExpression).toEqual('0 45 13 * * *');
        });

        it('should update model to undefined if minute is not selected', function() {
            var element = this.compileElement();

            element.find('input#minute').val('')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should update model after setting minute to 0', function() {
            var element = this.compileElement();

            element.find('input#minute').val('0')
                .change();

            expect(this.scope.cronExpression).toEqual('0 0 13 * * *');
        });

        it('should update model to undefined if minute is set to 60', function() {
            var element = this.compileElement();

            element.find('input#minute').val('60')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should update model to undefined after changing minute to over 60', function() {
            var element = this.compileElement();

            element.find('input#minute').val('600')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should update model to undefined after changing minute to negative number', function() {
            var element = this.compileElement();

            element.find('input#minute').val('-1')
                .change();

            expect(this.scope.cronExpression).toBeUndefined();
        });

        it('should be required', function() {
            var element = this.compileElement();

            expect(element.find('input#minute')
                .prop('required')).toBe(true);
        });

        it('should show error after changing minute to 60', function() {
            var element = this.compileElement();

            element
                .find('input#minute')
                .val('60')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing minute to over 60', function() {
            var element = this.compileElement();

            element
                .find('input#minute')
                .val('600')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing minute to negative number', function() {
            var element = this.compileElement();

            element
                .find('input#minute')
                .val('-1')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeDefined();
        });

        it('should not show minute our of range error for undefined minute', function() {
            var element = this.compileElement();

            element
                .find('input#minute')
                .val('')
                .change();
            this.$rootScope.$apply();

            expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeUndefined();
        });

    });

    describe('cron expression input', function() {

        it('should be shown if the initial expression is too complex', function() {
            this.scope.cronExpression = '0 0/15 * * * *';

            var element = this.compileElement();

            expect(element.find('input#cronExpression').parents('.ng-hide')
                .get(0)).toBeUndefined();
        });

        it('should not be shown if the initial expression is not too complex', function() {
            this.scope.cronExpression = '0 0 13 * * 3';

            var element = this.compileElement();

            expect(element.find('input#cronExpression').parents('.ng-hide')
                .get(0)).toBeDefined();
        });

        it('should set initial value', function() {
            this.scope.cronExpression = '0 0 13 * * 3';

            var element = this.compileElement();

            expect(element.find('input#cronExpression').val()).toEqual(this.scope.cronExpression);
        });

        it('should update model if valid cron is entered', function() {
            this.scope.cronExpression = '0 0/15 * * * *';

            var element = this.compileElement();

            element
                .find('input#cronExpression')
                .val('0 0/16 * * * 6')
                .change();

            expect(this.scope.cronExpression).toEqual('0 0/16 * * * 6');
        });

        it('should hide regular controls if cron is too complex', function() {
            this.scope.cronExpression = '0 0/15 * * * *';

            var element = this.compileElement();

            expect(element.find('select#occurrence').parents('.ng-hide')
                .get(0)).toBeDefined();

            expect(element.find('select#weekday').parents('.ng-hide')
                .get(0)).toBeDefined();

            expect(element.find('input#hour').parents('.ng-hide')
                .get(0)).toBeDefined();

            expect(element.find('input#minute').parents('.ng-hide')
                .get(0)).toBeDefined();
        });

        it('should hide error for regular controls if cron is too complex', function() {
            this.scope.cronExpression = '0 0/15 * * * *';

            var element = this.compileElement();

            expect(element.find('*:contains("required")').get(0)).toBeUndefined();
        });

        it('should show errors for invalid cron expression', function() {
            this.scope.cronExpression = '* * * * *';

            var element = this.compileElement();

            expect(element.find('*:contains("invalidCron")').get(0)).toBeDefined();
        });

    });

    it('should be restricted to element', function() {
        var markup = '<div openlmis-cron-selection ng-model="cronExpression"></div>';

        var element = this.compileElement(markup);

        expect(element.find('#occurrence').get(0)).toBeUndefined();

        markup = '<div class="openlmis-cron-selection" ng-model="cronExpression"></div>';

        element = this.compileElement(markup);

        expect(element.find('#occurrence').get(0)).toBeUndefined();
    });

});