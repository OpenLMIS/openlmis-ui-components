/*
* This program is part of the OpenLMIS logistics management information system platform software.
* Copyright © 2013 VillageReach
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
*  
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
*/

describe("LocaleController", function () {

    beforeEach(module('openlmis-locale'));

    var messageService, alertService, notificationService, openlmisLanguages;

    beforeEach(function(){
        angular.mock.module("openlmis-config", function($provide){
            $provide.constant('OPENLMIS_LANGUAGES', ['en', 'fr'])
        })
    });

    beforeEach(inject(function ($rootScope, $q, _messageService_, _alertService_,
                                _notificationService_, _OPENLMIS_LANGUAGES_) {

        messageService = _messageService_;
        alertService = _alertService_;
        notificationService = _notificationService_;
        openlmisLanguages = _OPENLMIS_LANGUAGES_;

        var mockLocale = undefined;
        spyOn(messageService, 'populate').andCallFake(function(lang){
            var deferred = $q.defer();
            if(lang == 'fail'){
                deferred.reject();
            } else {
                mockLocale = lang;
                $rootScope.$broadcast('openlmis.messages.populated');
                deferred.resolve();
            }
            return deferred.promise;
        });
        spyOn(messageService, 'getCurrentLocale').andCallFake(function(){
            return mockLocale;
        });

        spyOn(notificationService, 'success');
        spyOn(alertService, 'error');
    }));

    describe('on start up', function(){
        var scope, controller;

        beforeEach(inject(function($rootScope){
            scope = $rootScope.$new();
        }))

        it("loads list of avaliable locales", inject(function($controller) {
            var expectedLocales = ['en', 'fr'];
            controller = $controller('LocaleController', {
                $scope: scope,
                messageService: messageService,
                alertService: alertService,
                notificationService: notificationService,
                OPENLMIS_LANGUAGES: openlmisLanguages
            });

            expect(controller.locales).toEqual(expectedLocales);
        }));

        it('loads the default locale when messageService locale not set', inject(function($controller){
            controller = $controller('LocaleController', {
                $scope: scope,
                messageService: messageService,
                alertService: alertService,
                notificationService: notificationService
            });

            expect(messageService.populate).toHaveBeenCalled();
        }));

        it("does't load the default locale when the messageService locale is set", inject(function($controller){
            messageService.populate('foo');

            controller = $controller('LocaleController', {
                $scope: scope,
                messageService: messageService,
                alertService: alertService,
                notificationService: notificationService
            });

            // messageService.populate was only called at top
            expect(messageService.populate.calls.length).toBe(1);
        }));
    });

    describe('while running', function(){
        var scope, controller;

        beforeEach(inject(function($rootScope, $controller){
            scope = $rootScope.$new();
            messageService.currentLocale = 'javascript';

            controller = $controller('LocaleController', {
                $scope: scope,
                messageService: messageService,
                alertService: alertService,
                notificationService: notificationService
            });
        }));

        it("can change locale", function () {
            controller.changeLocale('pt');
            scope.$apply();

            expect(messageService.populate).toHaveBeenCalledWith('pt');
            expect(notificationService.success).toHaveBeenCalled();
        });

        it("will throw an error if changing locale is unsuccessful", function () {
            // spy on populate will reject on fail...
            controller.changeLocale('fail');
            scope.$apply();

            expect(alertService.error).toHaveBeenCalled();
        });

        it("updates selectedLocale when messages are populated", function(){
            messageService.populate('foo');
            scope.$apply();
            expect(controller.selectedLocale).toBe('foo');

            messageService.populate('bar');
            scope.$apply();
            expect(controller.selectedLocale).toBe('bar');
        });
    });

});
