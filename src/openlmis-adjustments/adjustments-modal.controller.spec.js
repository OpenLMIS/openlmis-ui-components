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

    beforeEach(function() {
        module('openlmis-adjustments');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
        });

        this.modalDeferred = this.$q.defer();

        this.reasons = [{
            name: 'Reason One'
        }, {
            name: 'Reason Two'
        }, {
            name: 'Reason Three'
        }];

        this.adjustments = [{
            reason: this.reasons[0],
            quantity: 10
        }, {
            reason: this.reasons[1],
            quantity: 11
        }];

        this.title = 'some title';

        this.message = 'some message';

        this.isDisabled = true;

        this.summaries = {
            keyOne: function() {},
            keyTwo: function() {}
        };

        spyOn(this.modalDeferred, 'resolve');
        spyOn(this.modalDeferred, 'reject');

        this.initController = initController;
    });

    describe('$onInit', function() {

        beforeEach(function() {
            this.initController();
        });

        it('should expose title', function() {
            this.vm.$onInit();

            expect(this.vm.title).toBe(this.title);
        });

        it('should expose message', function() {
            this.vm.$onInit();

            expect(this.vm.message).toBe(this.message);
        });

        it('should expose isDisabled', function() {
            this.vm.$onInit();

            expect(this.vm.isDisabled).toBe(this.isDisabled);
        });

        it('should expose adjustments', function() {
            this.vm.$onInit();

            expect(this.vm.adjustments).toBe(this.adjustments);
        });

        it('should expose reasons', function() {
            this.vm.$onInit();

            expect(this.vm.reasons).toBe(this.reasons);
        });

        it('should expose summaries', function() {
            this.vm.$onInit();

            expect(this.vm.summaries).toBe(this.summaries);
        });

    });

    describe('addAdjustment', function() {

        beforeEach(function() {
            this.initController();

            this.vm.$onInit();

            this.vm.reason = this.vm.reasons[0];
            this.vm.quantity = 13;
        });

        it('should add adjustment to the adjustment list', function() {
            this.vm.addAdjustment();

            expect(this.vm.adjustments[2]).toEqual({
                reason: this.reasons[0],
                quantity: 13
            });
        });

        it('should clear quantity', function() {
            expect(this.vm.quantity).not.toBeUndefined();

            this.vm.addAdjustment();

            expect(this.vm.quantity).toBeUndefined();
        });

        it('should clear reason', function() {
            expect(this.vm.reason).not.toBeUndefined();

            this.vm.addAdjustment();

            expect(this.vm.reason).toBeUndefined();
        });

        it('should call filterReasons if provided', function() {
            this.filterReasons = jasmine.createSpy('filterReasonsSpy');

            this.initController();
            this.vm.$onInit();

            this.vm.addAdjustment();

            expect(this.filterReasons).toHaveBeenCalledWith(this.vm.adjustments);
        });

    });

    describe('removeAdjustment', function() {

        beforeEach(function() {
            this.initController();
            this.vm.$onInit();
        });

        it('should remove adjustment from the adjustment list', function() {
            expect(this.vm.adjustments.length).toBe(2);

            this.vm.removeAdjustment(this.vm.adjustments[0]);

            expect(this.vm.adjustments).toEqual([{
                reason: this.reasons[1],
                quantity: 11
            }]);
        });

        it('should not remove adjustment if it is not on the list', function() {
            expect(this.vm.adjustments.length).toBe(2);

            this.vm.removeAdjustment({
                reason: this.reasons[1],
                quantity: 3
            });

            expect(this.vm.adjustments.length).toBe(2);
        });

        it('should not remove adjustment if it is undefined', function() {
            expect(this.vm.adjustments.length).toBe(2);

            this.vm.removeAdjustment(undefined);

            expect(this.vm.adjustments.length).toBe(2);
        });

        it('should call filterReasons if provided', function() {
            this.filterReasons = jasmine.createSpy('filterReasonsSpy');

            this.initController();
            this.vm.$onInit();

            this.vm.removeAdjustment({
                reason: this.reasons[1],
                quantity: 3
            });

            expect(this.filterReasons).toHaveBeenCalledWith(this.vm.adjustments);
        });

    });

    describe('save', function() {

        it('should resolve modalDeferred if preSave is not defined', function() {
            this.initController();
            this.vm.$onInit();

            this.vm.save();

            expect(this.modalDeferred.resolve).toHaveBeenCalledWith(this.vm.adjustments);
        });

        it('should call preSave function before resolving modalDeferred', function() {
            var preSaveDeferred = this.$q.defer();

            this.preSave = jasmine.createSpy();
            this.preSave.andReturn(preSaveDeferred.promise);

            this.initController();
            this.vm.$onInit();

            this.vm.save();

            expect(this.preSave).toHaveBeenCalledWith(this.vm.adjustments);
            expect(this.modalDeferred.resolve).not.toHaveBeenCalled();

            preSaveDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.modalDeferred.resolve).toHaveBeenCalledWith(this.vm.adjustments);
        });

        it('should not resolve modalDeferred if preSave promise was rejected', function() {
            var preSaveDeferred = this.$q.defer();

            this.preSave = jasmine.createSpy('preSaveSpy');
            this.preSave.andReturn(preSaveDeferred.promise);

            this.initController();
            this.vm.$onInit();

            this.vm.save();

            expect(this.preSave).toHaveBeenCalledWith(this.vm.adjustments);
            expect(this.modalDeferred.resolve).not.toHaveBeenCalled();

            preSaveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.modalDeferred.resolve).not.toHaveBeenCalled();
        });

    });

    describe('cancel', function() {

        it('should reject modalDeferred if preCancel is not defined', function() {
            this.initController();
            this.vm.$onInit();

            this.vm.cancel();

            expect(this.modalDeferred.reject).toHaveBeenCalled();
        });

        it('should call preCancel function before closing modal', function() {
            var preCancelDeferred = this.$q.defer();

            this.preCancel = jasmine.createSpy('preCancelSpy');
            this.preCancel.andReturn(preCancelDeferred.promise);

            this.initController();
            this.vm.$onInit();

            this.vm.cancel();

            expect(this.preCancel).toHaveBeenCalledWith(this.vm.adjustments);
            expect(this.modalDeferred.reject).not.toHaveBeenCalled();

            preCancelDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.modalDeferred.reject).toHaveBeenCalled();
        });

        it('should not reject modalDeferred if preCancel promise was rejected', function() {
            var preCancelDeferred = this.$q.defer();

            this.preCancel = jasmine.createSpy('preCancelSpy');
            this.preCancel.andReturn(preCancelDeferred.promise);

            this.initController();
            this.vm.$onInit();

            this.vm.cancel();

            expect(this.preCancel).toHaveBeenCalledWith(this.vm.adjustments);
            expect(this.modalDeferred.reject).not.toHaveBeenCalled();

            preCancelDeferred.reject();
            this.$rootScope.$apply();

            expect(this.modalDeferred.reject).not.toHaveBeenCalled();
        });

    });

    function initController() {
        this.vm = this.$controller('AdjustmentsModalController', {
            modalDeferred: this.modalDeferred,
            adjustments: this.adjustments,
            reasons: this.reasons,
            title: this.title,
            message: this.message,
            isDisabled: this.isDisabled,
            summaries: this.summaries,
            preSave: this.preSave,
            preCancel: this.preCancel,
            filterReasons: this.filterReasons
        });
    }

});
