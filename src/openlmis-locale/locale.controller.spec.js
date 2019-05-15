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

describe('LocaleController', function() {

    beforeEach(function() {
        module('openlmis-config', function($provide) {
            $provide.constant('OPENLMIS_LANGUAGES', {
                test: 'Test Language',
                en: 'English'
            });
        });
        module('openlmis-locale');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.messageService = $injector.get('messageService');
            this.alertService = $injector.get('alertService');
            this.notificationService = $injector.get('notificationService');
            this.$window = $injector.get('$window');
            this.$controller = $injector.get('$controller');
        });

        spyOn(this.notificationService, 'success');
        spyOn(this.alertService, 'error');
        spyOn(this.messageService, 'populate').andReturn(this.$q.resolve());
        spyOn(this.messageService, 'getCurrentLocale');

        this.$window = _.extend({}, this.$window, {
            location: jasmine.createSpyObj('location', ['reload'])
        });
        this.$scope = this.$rootScope.$new();

        this.vm = this.$controller('LocaleController', {
            $scope: this.$scope,
            $window: this.$window
        });
    });

    describe('shows loaded languages', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('in a sorted order', function() {
            expect(this.vm.locales.length).toBe(2);
            expect(this.vm.locales[0]).toBe('en');
        });

        it('gets the locale name', function() {
            expect(this.vm.getLocaleName('en')).toBe('English');
            expect(this.vm.getLocaleName('foo')).toBe('foo');
        });
    });

    describe('on start up', function() {

        it('loads the default locale when messageService locale not set', function() {
            this.vm.$onInit();

            expect(this.messageService.populate).toHaveBeenCalled();
        });

        it('does\'t load the default locale when the messageService locale is set', function() {
            this.messageService.getCurrentLocale.andReturn('en');
            this.vm.$onInit();

            // messageService.populate was only called at top
            expect(this.messageService.populate.calls.length).toBe(0);
        });
    });

    describe('while running', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('can change locale', function() {
            this.vm.selectedLocale = 'some';

            this.vm.changeLocale('pt');
            this.$scope.$apply();

            expect(this.messageService.populate).toHaveBeenCalledWith('pt');
            expect(this.$window.location.reload).toHaveBeenCalled();
        });

        it('will throw an error if changing locale is unsuccessful', function() {
            this.messageService.populate.andReturn(this.$q.reject());

            // spy on populate will reject on fail...
            this.vm.changeLocale('fail');
            this.$scope.$apply();

            expect(this.alertService.error).toHaveBeenCalled();
        });
    });

});
