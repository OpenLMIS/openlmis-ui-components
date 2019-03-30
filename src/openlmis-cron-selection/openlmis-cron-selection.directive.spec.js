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

ddescribe('<openlmis-cron-selection/>', function() {

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
        this.scope.ngRequired = true;
        this.scope.ngDisabled = false;

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
        var defaultMarkup = '<openlmis-cron-selection ' +
            'ng-model="cronExpression" ' +
            'ng-required="ngRequired" ' +
            'ng-disabled="ngDisabled"/>';

        var element = this.$compile(markup || defaultMarkup)(this.scope);
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

            var value = element.find('#occurrence').val();

            expect(element.find('[value=\'' + value + '\']')
                .attr('label')).toEqual('weekly');
        });

        it('should set occurrence to daily if initial cron expression is daily', function() {
            var element = this.compileElement();

            var value = element.find('#occurrence').val();

            expect(element.find('[value=\'' + value + '\']')
                .attr('label')).toEqual('daily');
        });

        it('should not set occurrence if initial cron is empty ', function() {
            this.scope.cronExpression = '';

            var element = this.compileElement();

            expect(element.find('select#occurrence').val()).toBeFalsy();
        });

        it('should update model after changing from daily to weekly', function() {
            var element = this.compileElement();

            var value = element.find('[label="weekly"]').attr('value');

            element.find('select#occurrence').val(value)
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 13 * * 0');
        });

        it('should update model after changing from weekly to daily', function() {
            this.scope.cronExpression = '0 30 13 * * 1';

            var element = this.compileElement();

            var value = element.find('[label="daily"]').attr('value');

            element.find('select#occurrence').val(value)
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 13 * * *');
        });

        it('should update model to empty string if occurrence is not selected', function() {
            var element = this.compileElement();

            element.find('select#occurrence').val('')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

    });

    describe('weekday selector', function() {

        it('should show weekday selector if weekly is selected', function() {
            var element = this.compileElement();

            expect(element.find('select#weekday').parents('.ng-hide')
                .get(0)).toBeDefined();

            var value = element.find('[label="weekly"]').attr('value');
            element.find('select#occurrence').val(value)
                .change();

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

            expect(this.scope.cronExpression).toEqual('0 30 13 * * 2');
        });

        it('should update model to empty string if weekday is not selected', function() {
            this.scope.cronExpression = '0 30 13 * * 4';

            var element = this.compileElement();

            element.find('select#weekday').val('')
                .change();

            expect(this.scope.cronExpression).toBe('');
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
            this.scope.isRequired = 'true';

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

        it('should update model to empty string if hour is not selected', function() {
            var element = this.compileElement();

            element.find('input#hour').val('')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should update model after setting hour to 0', function() {
            var element = this.compileElement();

            element.find('input#hour').val('0')
                .change();

            expect(this.scope.cronExpression).toEqual('0 30 0 * * *');
        });

        it('should update model to empty string after changing hour to 24', function() {
            var element = this.compileElement();

            element.find('input#hour').val('24')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should update model to empty string after changing hour to over 24', function() {
            var element = this.compileElement();

            element.find('input#hour').val('600')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should update model to empty string after changing hour to negative number', function() {
            var element = this.compileElement();

            element.find('input#hour').val('-1')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should show error after changing hour to 24', function() {
            var element = this.compileElement();

            element.find('input#hour').val('24')
                .change();

            expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing hour to over 24', function() {
            var element = this.compileElement();

            element.find('input#hour').val('600')
                .change();

            expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing hour to negative number', function() {
            var element = this.compileElement();

            element.find('input#hour').val('-1')
                .change();

            expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeDefined();
        });

        it('should not show hour our of range error for undefined hour', function() {
            var element = this.compileElement();

            element.find('input#hour').val('')
                .change();

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

        it('should update model to empty string if minute is not selected', function() {
            var element = this.compileElement();

            element.find('input#minute').val('')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should update model after setting minute to 0', function() {
            var element = this.compileElement();

            element.find('input#minute').val('0')
                .change();

            expect(this.scope.cronExpression).toEqual('0 0 13 * * *');
        });

        it('should update model to empty string if minute is set to 60', function() {
            var element = this.compileElement();

            element.find('input#minute').val('60')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should update model to empty string after changing minute to over 60', function() {
            var element = this.compileElement();

            element.find('input#minute').val('600')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should update model to empty string after changing minute to negative number', function() {
            var element = this.compileElement();

            element.find('input#minute').val('-1')
                .change();

            expect(this.scope.cronExpression).toBe('');
        });

        it('should show error after changing minute to 60', function() {
            var element = this.compileElement();

            element.find('input#minute').val('60')
                .change();

            expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing minute to over 60', function() {
            var element = this.compileElement();

            element.find('input#minute').val('600')
                .change();

            expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeDefined();
        });

        it('should show error after changing minute to negative number', function() {
            var element = this.compileElement();

            element.find('input#minute').val('-1')
                .change();

            expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeDefined();
        });

        it('should not show minute our of range error for undefined minute', function() {
            var element = this.compileElement();

            element.find('input#minute').val('')
                .change();

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

            element.find('input#cronExpression').val('0 0/16 * * * 6')
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

        it('should not validate cron for empty field', function() {
            this.scope.cronExpression = '* * * * *';

            var element = this.compileElement();

            element.find('input#cronExpression').val('')
                .change();
            this.scope.$digest();

            expect(element.find('*:contains("invalidCron")').get(0)).toBeUndefined();
        });

    });

    it('should show regular controls for undefined cron', function() {
        this.scope.cronExpression = undefined;

        var element = this.compileElement();

        expect(element.find('select#occurrence').parents('.ng-hide')
            .get(0)).toBeUndefined();

        expect(element.find('input#cronExpression').parents('.ng-hide')
            .get(0)).toBeDefined();
    });

    it('should show regular controls for empty cron', function() {
        this.scope.cronExpression = '';

        var element = this.compileElement();

        expect(element.find('select#occurrence').parents('.ng-hide')
            .get(0)).toBeUndefined();

        expect(element.find('input#cronExpression').parents('.ng-hide')
            .get(0)).toBeDefined();
    });

    it('should be restricted to element', function() {
        var markup = '<div openlmis-cron-selection ng-model="cronExpression"></div>';

        var element = this.compileElement(markup);

        expect(element.find('#occurrence').get(0)).toBeUndefined();

        markup = '<div class="openlmis-cron-selection" ng-model="cronExpression"></div>';

        element = this.compileElement(markup);

        expect(element.find('#occurrence').get(0)).toBeUndefined();
    });

    it('should make all fields disabled if directive is marked as disabled', function() {
        this.scope.ngDisabled = true;

        var element = this.compileElement();

        expect(element.find('select#occurrence')
            .prop('disabled')).toBe(true);

        expect(element.find('select#weekday')
            .prop('disabled')).toBe(true);

        expect(element.find('input#hour')
            .prop('disabled')).toBe(true);

        expect(element.find('input#minute')
            .prop('disabled')).toBe(true);

        expect(element.find('input#cronExpression')
            .prop('disabled')).toBe(true);
    });

    it('should make all fields enabled if directive is marked as enabled', function() {
        this.scope.ngDisabled = false;

        var element = this.compileElement();

        expect(element.find('select#occurrence')
            .prop('disabled')).toBe(false);

        expect(element.find('select#weekday')
            .prop('disabled')).toBe(false);

        expect(element.find('input#hour')
            .prop('disabled')).toBe(false);

        expect(element.find('input#minute')
            .prop('disabled')).toBe(false);

        expect(element.find('input#cronExpression')
            .prop('disabled')).toBe(false);
    });

    it('should make all regular controls required if directive is marked as required for simple cron', function() {
        this.scope.cronExpression = '0 0 0 * * 4';

        var element = this.compileElement();

        expect(element.find('select#occurrence')
            .prop('required')).toBe(true);

        expect(element.find('select#weekday')
            .prop('required')).toBe(true);

        expect(element.find('input#hour')
            .prop('required')).toBe(true);

        expect(element.find('input#minute')
            .prop('required')).toBe(true);

        expect(element.find('input#cronExpression')
            .prop('required')).toBe(false);
    });

    it('should make cron expression input required if directive is marked as required for complex cron', function() {
        this.scope.cronExpression = '0 0 0/5 * * 4';

        var element = this.compileElement();

        expect(element.find('select#occurrence')
            .prop('required')).toBe(false);

        expect(element.find('select#weekday')
            .prop('required')).toBe(false);

        expect(element.find('input#hour')
            .prop('required')).toBe(false);

        expect(element.find('input#minute')
            .prop('required')).toBe(false);

        expect(element.find('input#cronExpression')
            .prop('required')).toBe(true);
    });

    it('should make all fields optional if directive is marked as optional', function() {
        this.scope.ngRequired = false;

        var element = this.compileElement();

        expect(element.find('select#occurrence')
            .prop('required')).toBe(false);

        expect(element.find('select#weekday')
            .prop('required')).toBe(false);

        expect(element.find('input#hour')
            .prop('required')).toBe(false);

        expect(element.find('input#minute')
            .prop('required')).toBe(false);

        expect(element.find('input#cronExpression')
            .prop('required')).toBe(false);
    });

    it('should make all fields optional if directive is marked as disabled', function() {
        this.scope.ngDisabled = true;

        var element = this.compileElement();

        expect(element.find('select#occurrence')
            .prop('required')).toBe(false);

        expect(element.find('select#weekday')
            .prop('required')).toBe(false);

        expect(element.find('input#hour')
            .prop('required')).toBe(false);

        expect(element.find('input#minute')
            .prop('required')).toBe(false);

        expect(element.find('input#cronExpression')
            .prop('required')).toBe(false);
    });

    it('should disable validations for disabled fields for simple cron', function() {
        this.scope.ngDisabled = false;

        var element = this.compileElement();

        element.find('input#hour').val('123')
            .change();
        element.find('input#minute').val('123')
            .change();

        this.scope.ngDisabled = true;
        this.$rootScope.$apply();

        expect(element.find('*:contains("hourOutOfRange")').get(0)).toBeUndefined();
        expect(element.find('*:contains("minuteOutOfRange")').get(0)).toBeUndefined();
    });

    it('should disable validations for disabled fields for complex cron', function() {
        this.scope.ngDisabled = false;
        this.scope.cronExpression = '0 0/15 0 * * *';

        var element = this.compileElement();

        element.find('input#cronExpression').val('Totally invalid cron expression')
            .change();

        this.scope.ngDisabled = true;
        this.$rootScope.$apply();

        expect(element.find('*:contains("invalidCron")').get(0)).toBeUndefined();
    });

    it('should be valid when disabled', function() {
        this.scope.ngDisabled = true;
        this.scope.cronExpression = undefined;

        var element = this.compileElement();

        expect(element.controller('ngModel').$valid).toBe(true);
    });

    it('should be valid when optional', function() {
        this.scope.ngRequired = false;
        this.scope.cronExpression = undefined;

        var element = this.compileElement();

        expect(element.controller('ngModel').$valid).toBe(true);
    });

});