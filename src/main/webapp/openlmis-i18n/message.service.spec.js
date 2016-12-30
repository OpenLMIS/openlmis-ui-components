/*
* This program is part of the OpenLMIS logistics management information system platform software.
* Copyright © 2013 VillageReach
*
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
*  
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
*/

describe("MessageService", function () {

    beforeEach(module('openlmis-i18n'));

    var $rootScope, messageService, localStorageService, httpBackend;

    // beforeEach(inject(function (_$httpBackend_, _$rootScope_, _messageService_, _localStorageService_) {
    //     $rootScope = _$rootScope_;
    //     messageService = _messageService_;
    //     httpBackend = _$httpBackend_;
    //     localStorageService = _localStorageService_;

    //     localStorageService.clearAll();

    //     httpBackend.when('GET', 'messages/message_en.json')
    //     .respond(200, "hello");

    // }));

    // it("loads a default languge when first populated", function(){
    //     expect(messageService.getCurrentLocale()).toBe(null);

    //     messageService.populate()
    //     .catch(function(){
    //         // dont care
    //     });

    //     httpBackend.flush();
    //     $rootScope.$apply();

    //     expect(messageService.getCurrentLocale()).toBe("en");
    // });

    // describe("once loaded", function(){

    //     beforeEach(function(){
    //         httpBackend.when('GET', 'messages/message_en.json')
    //             .respond(200, {
    //                 sample: 'message'
    //             });

    //         messageService.populate('test')
    //         .catch(function(){});

    //         httpBackend.flush();
    //         $rootScope.$apply();
    //     });

    //     it("returns the current locale", function(){
    //         var lang = messageService.getCurrentLocale();
    //         expect(lang).toBe('test');
    //     });

    //     it("returns existing translation", function(){
    //         expect(messageService).get('sample').toBe('message');
    //     });

    //     it("returns undefined when a translation doesn't exist", function(){
    //        expect(messageService).get('foobar').toBe(undefined);
    //     });

    // });


});
