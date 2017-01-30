/*
* This program is part of the OpenLMIS logistics management information system platform software.
* Copyright © 2013 VillageReach
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
*  
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
*/

ddescribe("MessageService", function () {
    var $rootScope, messageService;
    beforeEach(function(){

        angular.mock.module("openlmis-config", function($provide){
            $provide.constant('OPENLMIS_MESSAGES', {
                "en": {
                    "language.name": "English",
                    "sample": "message"
                },
                "test": {
                    "language.name": "Test",
                    "sample": "foo"
                }
            })
        })

    });
    beforeEach(module('openlmis-i18n'));

    beforeEach(inject(function (_$rootScope_, _messageService_) {
        $rootScope = _$rootScope_;
        messageService = _messageService_;

        spyOn($rootScope, '$broadcast');
    }));

    it("loads a default languge when first populated", function(){
        expect(messageService.getCurrentLocale()).toBe("en");
    });

    it("returns existing translation", function(){
        expect(messageService.get('sample')).toBe('message');
    });

    it("returns the message string when a translation doesn't exist", function(){
       expect(messageService.get('foobar')).toBe('foobar');
    });

    it("can change the current locale", function(){
        messageService.populate('test');
        expect(messageService.getCurrentLocale()).toBe('test');

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
