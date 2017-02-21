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

describe("confirmService", function() {

    var timeout, confirmService, rootScope, Bootbox;

    beforeEach(module('openlmis-modal'));

    beforeEach(inject(function(_$rootScope_, _confirmService_, bootbox) {
        confirmService = _confirmService_;
        rootScope = _$rootScope_;
        Bootbox = bootbox;
    }));

    it('should show bootbox dialog when calling destroy', function() {
        var cancelCallback,
            promiseResolveSpy = jasmine.createSpy(),
            promiseRejectSpy = jasmine.createSpy(),
            promise,
            buttonClass;

        spyOn(Bootbox, 'dialog').andCallFake(function(argumentObject) {
            buttonClass = argumentObject.buttons.success.className;
            cancelCallback = argumentObject.buttons.cancel.callback;
            return {};
        });

        promise = confirmService.confirmDestroy('some.message').then(promiseResolveSpy, promiseRejectSpy);

        expect(buttonClass).toEqual('danger');
        expect(promiseResolveSpy).not.toHaveBeenCalled();
        expect(promiseRejectSpy).not.toHaveBeenCalled();

        cancelCallback();
        rootScope.$apply();

        expect(promiseResolveSpy).not.toHaveBeenCalled();
        expect(promiseRejectSpy).toHaveBeenCalled();

    });

    it('should show bootbox dialog when calling confirm', function() {
        var confirmCallback,
            promiseSpy = jasmine.createSpy(),
            promise,
            button = 'button.message',
            buttonMessage;

        spyOn(Bootbox, 'dialog').andCallFake(function(argumentObject) {
            confirmCallback = argumentObject.buttons.success.callback;
            buttonMessage = argumentObject.buttons.success.label;
            return {};
        });

        promise = confirmService.confirm('some.message', button).then(promiseSpy);

        expect(buttonMessage).toEqual(button);
        expect(promiseSpy).not.toHaveBeenCalled();

        confirmCallback();
        rootScope.$apply();

        expect(promiseSpy).toHaveBeenCalled();
    });
});
