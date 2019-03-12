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
        angular.mock.module('openlmis-config', function($provide) {
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
        });

        var mockLocale = undefined,
            context = this;
        spyOn(this.messageService, 'populate').andCallFake(function(lang) {
            var deferred = context.$q.defer();
            if (lang === 'fail') {
                deferred.reject();
            } else {
                mockLocale = lang;
                context.$rootScope.$broadcast('openlmis.messages.populated');
                deferred.resolve();
            }
            return deferred.promise;
        });
        spyOn(this.messageService, 'getCurrentLocale').andCallFake(function() {
            return mockLocale;
        });

        this.window = {
            location: jasmine.createSpyObj('location', ['reload'])
        };

        spyOn(this.notificationService, 'success');
        spyOn(this.alertService, 'error');
    });

    describe('shows loaded languages', function() {
        var controller;

        beforeEach(inject(function($rootScope, $controller) {
            var $scope = $rootScope.$new();
            controller = $controller('LocaleController', {
                $scope: $scope,
                messageService: this.messageService,
                alertService: this.alertService,
                notificationService: this.notificationService,
                $window: this.window
            });
            controller.$onInit();
        }));

        it('in a sorted order', function() {
            expect(controller.locales.length).toBe(2);
            expect(controller.locales[0]).toBe('en');
        });

        it('gets the locale name', function() {
            expect(controller.getLocaleName('en')).toBe('English');
            expect(controller.getLocaleName('foo')).toBe('foo');
        });
    });

    describe('on start up', function() {
        var $scope, controller;

        beforeEach(inject(function($rootScope) {
            $scope = $rootScope.$new();
        }));

        it('loads the default locale when messageService locale not set', inject(function($controller) {
            controller = $controller('LocaleController', {
                $scope: $scope,
                messageService: this.messageService,
                alertService: this.alertService,
                notificationService: this.notificationService,
                $window: this.window
            });
            controller.$onInit();

            expect(this.messageService.populate).toHaveBeenCalled();
        }));

        it('does\'t load the default locale when the messageService locale is set', inject(function($controller) {
            this.messageService.populate('foo');

            controller = $controller('LocaleController', {
                $scope: $scope,
                messageService: this.messageService,
                alertService: this.alertService,
                notificationService: this.notificationService,
                $window: this.window
            });

            // messageService.populate was only called at top
            expect(this.messageService.populate.calls.length).toBe(1);
        }));
    });

    describe('while running', function() {
        var $scope, controller;

        beforeEach(inject(function($rootScope, $controller) {
            $scope = $rootScope.$new();
            this.messageService.currentLocale = 'javascript';

            controller = $controller('LocaleController', {
                $scope: $scope,
                messageService: this.messageService,
                alertService: this.alertService,
                notificationService: this.notificationService,
                $window: this.window
            });
        }));

        it('can change locale', function() {
            controller.selectedLocale = 'some';

            controller.changeLocale('pt');
            $scope.$apply();

            expect(this.messageService.populate).toHaveBeenCalledWith('pt');
            expect(this.window.location.reload).toHaveBeenCalled();
        });

        it('will throw an error if changing locale is unsuccessful', function() {
            // spy on populate will reject on fail...
            controller.changeLocale('fail');
            $scope.$apply();

            expect(this.alertService.error).toHaveBeenCalled();
        });
    });

});
