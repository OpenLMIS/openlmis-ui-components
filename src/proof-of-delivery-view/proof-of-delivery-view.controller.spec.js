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

describe('PodViewController', function() {

    var vm, $rootScope, $state, $q, podSpy, notificationServiceMock, confirmServiceMock, confirmPromise, isValid, ORDER_STATUS, getPageMock, stateParams;

    beforeEach(function() {
        notificationServiceMock = jasmine.createSpyObj('notificationService', ['success', 'error']);
        confirmServiceMock = jasmine.createSpyObj('confirmService', ['confirm']);
        proofOfDeliveryServiceMock = jasmine.createSpyObj('proofOfDeliveryService', ['save', 'submit']);

        podSpy = jasmine.createSpyObj('pod', ['isValid', 'isLineItemValid']);
        podSpy.id = '1';
        podSpy.proofOfDeliveryLineItems = [
            {
                id: '1',
                $program: {
                    orderableCategoryDisplayName: 'firstCategory'
                }
            },
            {
                id: '2',
                $program: {
                    orderableCategoryDisplayName: 'secondCategory'
                }
            },
            {
                id: '3',
                $program: {
                    orderableCategoryDisplayName: 'secondCategory'
                }
            }
        ];
        stateParams = {
            page: 0,
            pageSize: 1
        };

        module('proof-of-delivery-view', function($provide) {
            $provide.service('notificationService', function() {
                return notificationServiceMock;
            });

            $provide.service('confirmService', function() {
                return confirmServiceMock;
            });

            $provide.service('proofOfDeliveryService', function() {
                return proofOfDeliveryServiceMock;
            });
        });

        inject(function(_$rootScope_, _$state_, _$q_, $controller, _ORDER_STATUS_) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $q = _$q_;
            ORDER_STATUS = _ORDER_STATUS_;

            vm = $controller('ProofOfDeliveryViewController', {
                pod: podSpy,
                allItems: podSpy.proofOfDeliveryLineItems
            });
            vm.items = podSpy.proofOfDeliveryLineItems;
        });

        spyOn($state, 'reload').andReturn();

        confirmPromise = $q.when();
        confirmServiceMock.confirm.andReturn(confirmPromise);
    });

    it('initialization should expose pod', function() {
        expect(vm.pod).toEqual(podSpy);
    });

    describe('savePod', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            proofOfDeliveryServiceMock.save.andReturn(deferred.promise);
        });

        it('should show confirmation modal', function() {
            callSave(true);

            expect(confirmServiceMock.confirm).toHaveBeenCalledWith('msg.orders.savePodQuestion');
        });

        it('should save pod', function() {
            callSave(true);

            expect(proofOfDeliveryServiceMock.save).toHaveBeenCalledWith(podSpy);
        });

        it('should show error notification if validation was not successful', function() {
            callSave(false);

            expect(notificationServiceMock.error).toHaveBeenCalledWith('error.podInvalid');
        });

        it('should show success notification if save was successful', function() {
            callSave(true);
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationServiceMock.success).toHaveBeenCalledWith('msg.podSaved');
        });

        it('should reload state if save was successful', function() {
            callSave(true);
            deferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should show error notification if save failed', function() {
            callSave(true);
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.podSavedFailed');
        });

        it('should not reload state if save failed', function() {
            callSave(true);
            deferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

        function callSave(isValid) {
            podSpy.isValid.andReturn(isValid);
            vm.savePod();
            $rootScope.$apply();
        }
    });

    describe('submitPod', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            proofOfDeliveryServiceMock.save.andCallFake(function() {
                return $q.when(true);
            });
            proofOfDeliveryServiceMock.submit.andReturn(deferred.promise);
        });

        it('should show confirmation modal', function() {
            callSubmit(true);

            expect(confirmServiceMock.confirm).toHaveBeenCalledWith('msg.orders.submitPodQuestion');
        });

        it('should save POD before submit', function() {
            callSubmit(true);

            expect(proofOfDeliveryServiceMock.save).toHaveBeenCalledWith(podSpy);
        });

        it('should submit pod', function() {
            callSubmit(true);

            expect(proofOfDeliveryServiceMock.submit).toHaveBeenCalledWith(podSpy.id);
        });

        it('should show error notification if validation was not successful', function() {
            callSubmit(false);

            expect(notificationServiceMock.error).toHaveBeenCalledWith('error.podInvalid');
        });

        it('should show success notification if save was successful', function() {
            callSubmit(true);
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationServiceMock.success).toHaveBeenCalledWith('msg.podSubmitted');
        });

        it('should reload state if save was successful', function() {
            callSubmit(true);
            deferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should show error notification if save failed', function() {
            callSubmit(true);
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.podSubmitFailed');
        });

        it('should not reload state if save failed', function() {
            callSubmit(true);
            deferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

        function callSubmit(isValid) {
            podSpy.isValid.andReturn(isValid);
            vm.submitPod();
            $rootScope.$apply();
        }
    });

    describe('isSubmitted', function() {

        beforeEach(function() {
            podSpy.order = {};
        });

        it('should return false if order status is oder than RECEIVED', function() {
            podSpy.order.status = ORDER_STATUS.IN_TRANSIT;
            expect(vm.isSubmitted()).toBe(false);
        });

        it('should not display submit if order status is RECEIVED', function() {
            podSpy.order.status = ORDER_STATUS.RECEIVED;
            expect(vm.isSubmitted()).toBe(true);
        });

    });

    describe('typeMessage', function() {

        var order;

        beforeEach(function() {
            podSpy.order = {};
            order = podSpy.order;
        });

        it('should return emergency if pod order is emergency', function() {
            order.emergency = true;

            var result = vm.typeMessage();

            expect(result).toEqual('label.emergency');
        });

        it('should return regular if pod order is not emergency', function() {
            order.emergency = false;

            var result = vm.typeMessage();

            expect(result).toEqual('msg.regular');
        });

    });

});
