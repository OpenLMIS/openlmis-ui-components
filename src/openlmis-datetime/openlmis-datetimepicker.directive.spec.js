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

describe('openlmisDatetimePicker directive', function() {

    beforeEach(function() {
        module('openlmis-datetime');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.moment = $injector.get('moment');
        });

        this.$scope = this.$rootScope.$new();

        this.compileMarkup = function(markup) {
            this.element = this.$compile(markup)(this.$scope);
            this.$rootScope.$apply();
        };
    });

    it('should show initial value', function() {
        this.$scope.datetime = '2019-06-18T09:40:07.825Z';

        this.compileMarkup('<input type="text" openlmis-datetimepicker ng-model="datetime"/>');

        expect(this.element.val()).toEqual('06/18/2019 9:40 AM');
    });

    it('should update model after user enters date', function() {
        this.compileMarkup('<input type="text" openlmis-datetimepicker ng-model="datetime"/>');

        this.element.triggerHandler({
            type: 'dp.change',
            date: this.moment('2019-06-18T09:40:07.825Z')
        });

        expect(this.$scope.datetime).toEqual('2019-06-18T09:40:07.825Z');
    });

    it('should set min date', function() {
        this.$scope.minDate = '2019-06-18T09:40:07.825Z';

        this.compileMarkup('<input type="text" openlmis-datetimepicker ng-model="datetime" min-date="minDate"/>');

        expect(this.element.data('DateTimePicker').minDate()).toEqual(this.moment('2019-06-18T09:40:07.825Z'));
    });

    it('should set max date', function() {
        this.$scope.maxDate = '2019-06-18T09:40:07.825Z';

        this.compileMarkup('<input type="text" openlmis-datetimepicker ng-model="datetime" max-date="maxDate"/>');

        expect(this.element.data('DateTimePicker').maxDate()).toEqual(this.moment('2019-06-18T09:40:07.825Z'));
    });

    afterEach(function() {
        this.element.remove();
        this.element = undefined;
    });

});
