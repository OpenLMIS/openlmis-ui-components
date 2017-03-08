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


describe("MessageService", function () {
    var $rootScope, messageService, localStorageService, getLocaleSpy;
    beforeEach(function(){

        angular.mock.module("openlmis-config", function($provide){
            $provide.constant('DEFAULT_LANGUAGE', 'en');

            $provide.constant('OPENLMIS_MESSAGES', {
                "en": {
                    "language.name": "English",
                    "sample": "message",
                    "messageWithParam": "hello ${name}!",
                    "messageWithParams": "Object with id: ${id}, status: ${status}",
                    "messageWithParams2": "Object with id: ${0}, status: ${1}"
                },
                "test": {
                    "language.name": "Test",
                    "sample": "foo"
                }
            })
        })

    });
    beforeEach(module('openlmis-i18n'));

    beforeEach(inject(function (_$rootScope_, _messageService_, _localStorageService_) {
        $rootScope = _$rootScope_;
        messageService = _messageService_;
        localStorageService = _localStorageService_;

        getLocaleSpy = spyOn(localStorageService, 'get');
        getLocaleSpy.andReturn('en');
        spyOn(localStorageService, 'add');
        spyOn($rootScope, '$broadcast');
    }));

    it("loads a default languge when populated without any parameters", function(){
        messageService.populate();
        expect(localStorageService.add).toHaveBeenCalledWith('current_locale', 'en');
    });

    it("returns existing translation", function(){
        expect(messageService.get('sample')).toBe('message');
    });

    it("returns the message string when a translation doesn't exist", function(){
       expect(messageService.get('foobar')).toBe('foobar');
    });

    it("returns the message string with parameter", function(){
        var person = {name: 'Jane'};
        var expected = 'hello Jane!';
        expect(messageService.get('messageWithParam', person)).toBe(expected);
    });

    it("returns the message string with multiple parameters", function(){
        var object = {id: '123', status:'NEW'};
        var expected = 'Object with id: 123, status: NEW';
        expect(messageService.get('messageWithParams', object)).toBe(expected);
    });

    it("returns the message string with parameters in array", function() {
       var array = ['123', 'NEW'];
       var expected = 'Object with id: 123, status: NEW';
       expect(messageService.get('messageWithParams2', array)).toBe(expected);
    });

    it("can change the current locale", function(){
        messageService.populate('test');
        getLocaleSpy.andReturn('test');

        expect(localStorageService.add).toHaveBeenCalledWith('current_locale', 'test');
        expect(messageService.get('sample')).toBe('foo');
    });

    it("broadcasts an event when the locale is successfully changed", function(){
        messageService.populate('test');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('openlmis.messages.populated');
    });

    it("resolves a promise when the locale is changed", function(){
        var success = false;

        var promise = messageService.populate('test');
        promise.then(function(){
            success = true;
        });

        $rootScope.$apply();

        expect(success).toBe(true);
    });

    it("rejects the promise when locale isn't changed", function(){
        var success = false;

        var promise = messageService.populate('foo');
        promise.catch(function(){
            success = true;
        });

        $rootScope.$apply();

        expect(success).toBe(true);
    });
});
