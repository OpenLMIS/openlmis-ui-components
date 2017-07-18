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

describe('AdjustmentsModalController', function() {

    var vm, $controller, $q, $rootScope, modalDeferred, adjustments, reasons, title, message,
        isDisabled, summaries, preSave, preCancel;

    beforeEach(function() {
        module('openlmis-adjustments');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
        });

        modalDeferred = $q.defer();

        reasons = [{
            name: 'Reason One'
        }, {
            name: 'Reason Two'
        }, {
            name: 'Reason Three'
        }];

        adjustments = [{
            reason: reasons[0],
            quantity: 10
        }, {
            reason: reasons[1],
            quantity: 11
        }];

        title = 'some title';

        message = 'some message';

        isDisabled = true;

        summaries = {
            'keyOne': function() {},
            'keyTwo': function() {}
        };

        spyOn(modalDeferred, 'resolve');
        spyOn(modalDeferred, 'reject');
    });

    describe('$onInit', function() {

        beforeEach(function() {
            initController();
        });

        it('should expose title', function() {
            vm.$onInit();

            expect(vm.title).toBe(title);
        });

        it('should expose message', function() {
            vm.$onInit();

            expect(vm.message).toBe(message);
        });

        it('should expose isDisabled', function() {
            vm.$onInit();

            expect(vm.isDisabled).toBe(isDisabled);
        });

        it('should expose adjustments', function() {
            vm.$onInit();

            expect(vm.adjustments).toBe(adjustments);
        });

        it('should expose reasons', function() {
            vm.$onInit();

            expect(vm.reasons).toBe(reasons);
        });

        it('should expose summaries', function() {
            vm.$onInit();

            expect(vm.summaries).toBe(summaries);
        });

    });

    describe('addAdjustment', function() {

        beforeEach(function() {
            initController();

            vm.$onInit();

            vm.reason = vm.reasons[0];
            vm.quantity = 13;
        });

        it('should add adjustment to the adjustment list', function() {
            vm.addAdjustment();

            expect(vm.adjustments[2]).toEqual({
                reason: reasons[0],
                quantity: 13
            });
        });

        it('should clear quantity', function() {
            expect(vm.quantity).not.toBeUndefined();

            vm.addAdjustment();

            expect(vm.quantity).toBeUndefined();
        });

        it('should clear reason', function() {
            expect(vm.reason).not.toBeUndefined();

            vm.addAdjustment();

            expect(vm.reason).toBeUndefined();
        });

    });

    describe('removeAdjustment', function() {

        beforeEach(function() {
            initController();
            vm.$onInit();
        });

        it('should remove adjustment from the adjustment list', function() {
            expect(vm.adjustments.length).toBe(2);

            vm.removeAdjustment(vm.adjustments[0]);

            expect(vm.adjustments).toEqual([{
                reason: reasons[1],
                quantity: 11
            }]);
        });

        it('should not remove adjustment if it is not on the list', function() {
            expect(vm.adjustments.length).toBe(2);

            vm.removeAdjustment({
                reason: reasons[1],
                quantity: 3
            });

            expect(vm.adjustments.length).toBe(2);
        });

        it('should not remove adjustment if it is undefined', function() {
            expect(vm.adjustments.length).toBe(2);

            vm.removeAdjustment(undefined);

            expect(vm.adjustments.length).toBe(2);
        });

    });

    describe('save', function() {

        it('should resolve modalDeferred if preSave is not defined', function() {
            initController();
            vm.$onInit();

            vm.save();

            expect(modalDeferred.resolve).toHaveBeenCalledWith(vm.adjustments);
        });

        it('should call preSave function before resolving modalDeferred', function() {
            var preSaveDeferred = $q.defer();

            preSave = jasmine.createSpy();
            preSave.andReturn(preSaveDeferred.promise);

            initController();
            vm.$onInit();

            vm.save();

            expect(preSave).toHaveBeenCalledWith(vm.adjustments);
            expect(modalDeferred.resolve).not.toHaveBeenCalled();

            preSaveDeferred.resolve();
            $rootScope.$apply();

            expect(modalDeferred.resolve).toHaveBeenCalledWith(vm.adjustments);
        });

        it('should not resolve modalDeferred if preSave promise was rejected', function() {
            var preSaveDeferred = $q.defer();

            preSave = jasmine.createSpy('preSaveSpy');
            preSave.andReturn(preSaveDeferred.promise);

            initController();
            vm.$onInit();

            vm.save();

            expect(preSave).toHaveBeenCalledWith(vm.adjustments);
            expect(modalDeferred.resolve).not.toHaveBeenCalled();

            preSaveDeferred.reject();
            $rootScope.$apply();

            expect(modalDeferred.resolve).not.toHaveBeenCalled();
        });

    });

    describe('cancel', function() {

        it('should reject modalDeferred if preCancel is not defined', function() {
            initController();
            vm.$onInit();

            vm.cancel();

            expect(modalDeferred.reject).toHaveBeenCalled();
        });

        it('should call preCancel function before closing modal', function() {
            var preCancelDeferred = $q.defer();

            preCancel = jasmine.createSpy('preCancelSpy');
            preCancel.andReturn(preCancelDeferred.promise);

            initController();
            vm.$onInit();

            vm.cancel();

            expect(preCancel).toHaveBeenCalledWith(vm.adjustments);
            expect(modalDeferred.reject).not.toHaveBeenCalled();

            preCancelDeferred.resolve();
            $rootScope.$apply();

            expect(modalDeferred.reject).toHaveBeenCalled();
        });

        it('should not reject modalDeferred if preCancel promise was rejected', function() {
            var preCancelDeferred = $q.defer();

            preCancel = jasmine.createSpy('preCancelSpy');
            preCancel.andReturn(preCancelDeferred.promise);

            initController();
            vm.$onInit();

            vm.cancel();

            expect(preCancel).toHaveBeenCalledWith(vm.adjustments);
            expect(modalDeferred.reject).not.toHaveBeenCalled();

            preCancelDeferred.reject();
            $rootScope.$apply();

            expect(modalDeferred.reject).not.toHaveBeenCalled();
        });

    });

    function initController() {
        vm = $controller('AdjustmentsModalController', {
            modalDeferred: modalDeferred,
            adjustments: adjustments,
            reasons: reasons,
            title: title,
            message: message,
            isDisabled: isDisabled,
            summaries: summaries,
            preSave: preSave,
            preCancel: preCancel
        });
    }

});
