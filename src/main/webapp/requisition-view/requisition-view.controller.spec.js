/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('RequisitionViewController', function() {

    var $rootScope, $q, $state, notificationService, confirmService, vm, requisition,
        loadingModalService, deferred;

    beforeEach(function() {
        module('requisition-view');

        module(function($provide) {
            var confirmSpy = authorizationServiceSpy = jasmine.createSpyObj('confirmService', ['confirm']),
                authorizationServiceSpy = jasmine.createSpyObj('authorizationService', ['hasRight']);

            $provide.service('confirmService', function() {
                return confirmSpy;
            });

            $provide.service('authorizationService', function() {
                return authorizationServiceSpy;
            });
        });

        inject(function(_$rootScope_, $controller, _$q_, _$state_, _notificationService_,
                        _confirmService_, _loadingModalService_) {

            $rootScope = _$rootScope_;
            $state = _$state_;
            $q = _$q_;
            notificationService = _notificationService_;
            confirmService = _confirmService_;
            loadingModalService = _loadingModalService_;

            confirmService.confirm.andCallFake(function() {
                return $q.when(true);
            });

            deferred = $q.defer();
            requisition = jasmine.createSpyObj('requisition', ['$skip', '$isInitiated']);
            requisition.id = '1';
            requisition.program = {
                id: '2',
                periodsSkippable: true
            };
            requisition.$isInitiated.andReturn(true);
            requisition.$skip.andReturn(deferred.promise);

            vm = $controller('RequisitionViewController', {requisition: requisition});
        });
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

    it('should display message when successfully skiped requisition', function() {
        var notificationServiceSpy = jasmine.createSpy(),
            stateGoSpy = jasmine.createSpy(),
            loadingDeferred = $q.defer();


        spyOn(notificationService, 'success').andCallFake(notificationServiceSpy);
        spyOn(loadingModalService, 'open').andReturn(loadingDeferred.promise);
        spyOn($state, 'go').andCallFake(stateGoSpy);

        vm.skipRnr();

        deferred.resolve();
        $rootScope.$apply();
        loadingDeferred.resolve();
        $rootScope.$apply();

        expect(notificationServiceSpy).toHaveBeenCalledWith('msg.requisitionSkipped');
        expect(stateGoSpy).toHaveBeenCalledWith('requisitions.initRnr');
    });

    it('should diplay error message when skip requisition failed', function() {
        var notificationServiceSpy = jasmine.createSpy();

        spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);

        vm.skipRnr();

        deferred.reject();
        $rootScope.$apply();

        expect(notificationServiceSpy).toHaveBeenCalledWith('msg.requisitionSkipFailed');
    });
});
