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


describe('RequisitionViewController', function() {

    var $scope, $q, $state, notificationService, confirmService, vm, requisition,
        loadingModalService, deferred, requisitionUrlFactoryMock, requisitionValidatorMock,
        fullSupplyItems, nonFullSupplyItems, authorizationServiceSpy;

    beforeEach(function() {
        module('requisition-view');

        module(function($provide) {

            var confirmSpy = jasmine.createSpyObj('confirmService', ['confirm']);

            authorizationServiceSpy = jasmine.createSpyObj('authorizationService', ['hasRight']),

            requisitionValidatorMock = jasmine.createSpyObj('requisitionValidator', [
                'areLineItemsValid'
            ]);
            requisitionUrlFactoryMock = jasmine.createSpy();

            $provide.service('confirmService', function() {
                return confirmSpy;
            });

            $provide.service('authorizationService', function() {
                return authorizationServiceSpy;
            });

            $provide.factory('requisitionUrlFactory', function() {
                return requisitionUrlFactoryMock;
            });

            $provide.factory('requisitionValidator', function() {
                return requisitionValidatorMock;
            });
        });

        inject(function(_$rootScope_, $controller, _$q_, _$state_, _notificationService_,
                        _confirmService_, _loadingModalService_) {

            $scope = _$rootScope_.$new();
            $state = _$state_;
            $q = _$q_;
            notificationService = _notificationService_;
            confirmService = _confirmService_;
            loadingModalService = _loadingModalService_;

            confirmService.confirm.andCallFake(function() {
                return $q.when(true);
            });

            deferred = $q.defer();
            requisition = jasmine.createSpyObj('requisition',
                ['$skip', '$isInitiated', '$isSubmitted', '$isAuthorized', '$isInApproval', '$isReleased', '$save']);
            requisition.id = '1';
            requisition.program = {
                id: '2',
                periodsSkippable: true
            };
            requisition.$isInitiated.andReturn(true);
            requisition.$isReleased.andReturn(false);
            requisition.$skip.andReturn(deferred.promise);
            requisition.$save.andReturn(deferred.promise);

            vm = $controller('RequisitionViewController', {$scope: $scope, requisition: requisition});
        });

        requisitionUrlFactoryMock.andCallFake(function(url) {
            return 'http://some.url' + url;
        });

        fullSupplyItems = [{
            skipped: '',
            $program: {
                fullSupply: true
            }
        }];

        nonFullSupplyItems = [{
            skipped: '',
            $program: {
                fullSupply: false
            }
        }];

        requisition.requisitionLineItems = fullSupplyItems.concat(nonFullSupplyItems);
    });

    it('should display skip button', function() {
        expect(vm.displaySkip()).toBe(true);
    });

    it('should not display skip button if program does not allow skipping periods', function() {
        vm.requisition.program.periodsSkippable = false;
        expect(vm.displaySkip()).toBe(false);
    });

    it('should not display skip button if requisition has emergency type', function() {
        vm.requisition.emergency = true;
        expect(vm.displaySkip()).toBe(false);
    });

    it('should display skip button if requisition is not in initiated status', function() {
        vm.requisition.$isInitiated.andReturn(false);
        expect(vm.displaySkip()).toBe(false);
    });

    it('should display message when successfully skipped requisition', function() {
        var notificationServiceSpy = jasmine.createSpy(),
            stateGoSpy = jasmine.createSpy(),
            loadingDeferred = $q.defer();


        spyOn(notificationService, 'success').andCallFake(notificationServiceSpy);
        spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
        spyOn($state, 'go').andCallFake(stateGoSpy);

        vm.skipRnr();

        deferred.resolve();
        $scope.$apply();
        loadingDeferred.resolve();
        $scope.$apply();

        expect(notificationServiceSpy).toHaveBeenCalledWith('msg.requisitionSkipped');
        expect(stateGoSpy).toHaveBeenCalledWith('requisitions.initRnr');
    });

    it('should display error message when skip requisition failed', function() {
        var notificationServiceSpy = jasmine.createSpy();

        spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);

        vm.skipRnr();

        deferred.reject();
        $scope.$apply();

        expect(notificationServiceSpy).toHaveBeenCalledWith('msg.failedToSkipRequisition');
    });

    it('getPrintUrl should prepare URL correctly', function() {
        expect(vm.getPrintUrl()).toEqual('http://some.url/api/requisitions/1/print');
    });

    it('should display sync button when initiated', function() {
        authorizationServiceSpy.hasRight.andReturn(true);

        vm.requisition.$isInitiated.andReturn(true);
        vm.requisition.$isSubmitted.andReturn(false);
        vm.requisition.$isAuthorized.andReturn(false);
        vm.requisition.$isInApproval.andReturn(false);

        expect(vm.displaySync()).toBe(true);
    });

    it('should display sync button when submitted', function() {
        authorizationServiceSpy.hasRight.andReturn(true);

        vm.requisition.$isInitiated.andReturn(false);
        vm.requisition.$isSubmitted.andReturn(true);
        vm.requisition.$isAuthorized.andReturn(false);
        vm.requisition.$isInApproval.andReturn(true);

        expect(vm.displaySync()).toBe(true);
    });

    it('should display sync button when authorized', function() {
        authorizationServiceSpy.hasRight.andReturn(true);

        vm.requisition.$isInitiated.andReturn(false);
        vm.requisition.$isSubmitted.andReturn(false);
        vm.requisition.$isAuthorized.andReturn(true);
        vm.requisition.$isInApproval.andReturn(true);

        expect(vm.displaySync()).toBe(true);
    });

    it('should display sync button in approval', function() {
        authorizationServiceSpy.hasRight.andReturn(true);

        vm.requisition.$isInitiated.andReturn(false);
        vm.requisition.$isSubmitted.andReturn(false);
        vm.requisition.$isAuthorized.andReturn(false);
        vm.requisition.$isInApproval.andReturn(true);

        expect(vm.displaySync()).toBe(true);
    });

    it('should not display sync button', function() {
        vm.requisition.$isInitiated.andReturn(false);
        vm.requisition.$isSubmitted.andReturn(false);
        vm.requisition.$isAuthorized.andReturn(false);
        vm.requisition.$isInApproval.andReturn(false);
        expect(vm.displaySync()).toBe(false);
    });

    describe('Sync error handling', function() {

        it('should reload requisition when conflict response received', function() {
            verifyReloadOnErrorAndNotificationSent(409, 'msg.requisitionVersionError')
        });

        it('should reload requisition when forbidden response received', function() {
            verifyReloadOnErrorAndNotificationSent(403, 'msg.requisitionUpdateForbidden')
        });

        it('should not reload requisition when bad request response received', function() {
            verifyNoReloadOnError(400);
        });

        it('should not reload requisition when internal server error request response received', function() {
            verifyNoReloadOnError(500);
        });

        function verifyReloadOnErrorAndNotificationSent(responseStatus, messageKey) {
          var notificationServiceSpy = jasmine.createSpy(),
              stateSpy = jasmine.createSpy(),
              conflictResponse = { status: responseStatus };

          spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);
          spyOn($state, 'reload').andCallFake(stateSpy);

          vm.syncRnr();

          deferred.reject(conflictResponse);
          $scope.$apply();

          expect(notificationServiceSpy).toHaveBeenCalledWith(messageKey);
          expect(stateSpy).toHaveBeenCalled();
        }

        function verifyNoReloadOnError(responseStatus) {
            var notificationServiceSpy = jasmine.createSpy(),
                stateSpy = jasmine.createSpy(),
                conflictResponse = { status: responseStatus };

            spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);
            spyOn($state, 'reload').andCallFake(stateSpy);

            vm.syncRnr();

            deferred.reject(conflictResponse);
            $scope.$apply();

            expect(notificationServiceSpy).toHaveBeenCalledWith('msg.failedToSyncRequisition');
            expect(stateSpy).not.toHaveBeenCalled();
        }
    });

    describe('isFullSupplyTabValid', function() {

        it('should return true if all line items are valid', function() {
            requisitionValidatorMock.areLineItemsValid.andCallFake(function(lineItems) {
                return lineItems[0] === fullSupplyItems[0];
            });

            expect(vm.isFullSupplyTabValid()).toBe(true);
            expect(requisitionValidatorMock.areLineItemsValid)
                .toHaveBeenCalledWith([fullSupplyItems[0]]);
        });

        it('should return true if all line items are valid', function() {
            requisitionValidatorMock.areLineItemsValid.andCallFake(function(lineItems) {
                return lineItems[0] !== fullSupplyItems[0];
            });

            expect(vm.isFullSupplyTabValid()).toBe(false);
            expect(requisitionValidatorMock.areLineItemsValid)
                .toHaveBeenCalledWith([fullSupplyItems[0]]);
        });

    });

    describe('isNonFullSupplyTabValid', function() {

        it('should return true if all line items are valid', function() {
            requisitionValidatorMock.areLineItemsValid.andCallFake(function(lineItems) {
                return lineItems[0] === nonFullSupplyItems[0];
            });

            expect(vm.isNonFullSupplyTabValid()).toBe(true);
            expect(requisitionValidatorMock.areLineItemsValid)
                .toHaveBeenCalledWith([nonFullSupplyItems[0]]);
        });

        it('should return true if all line items are valid', function() {
            requisitionValidatorMock.areLineItemsValid.andCallFake(function(lineItems) {
                return lineItems[0] !== nonFullSupplyItems[0];
            });

            expect(vm.isNonFullSupplyTabValid()).toBe(false);
            expect(requisitionValidatorMock.areLineItemsValid)
                .toHaveBeenCalledWith([nonFullSupplyItems[0]]);
        });

    });
});
