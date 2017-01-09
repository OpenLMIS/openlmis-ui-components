/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('RequisitionCtrl', function() {

    var $rootScope, $q, $state, Notification, confirmService, vm, requisition, deferred;

    beforeEach(function() {
        module('requisition-view');

        module(function($provide) {
            var confirmSpy = jasmine.createSpy('confirmService').andCallFake(function(argumentObject) {
                    return $q.when(true);
                }),
                authorizationServiceSpy = jasmine.createSpyObj('AuthorizationService', ['hasRight']);

            $provide.service('confirmService', function() {
                return confirmSpy;
            });

            $provide.service('AuthorizationService', function() {
                return authorizationServiceSpy;
            });
        });

        inject(function (_$rootScope_, $controller, _$q_, _$state_, _Notification_, _confirmService_) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $q = _$q_;
            Notification = _Notification_;
            confirmService = _confirmService_;

            deferred = $q.defer();
            requisition = {
                id: '1',
                status: 'INITIATED',
                program: {
                    id: '2',
                    periodsSkippable: true
                },
                $skip: function() {
                    return deferred.promise;
                },
                $isInitiated: function() {
                    return this.status === 'INITIATED';
                }
            }

            vm = $controller('RequisitionCtrl', {requisition: requisition});
        });
    });

    it('should display skip button', function() {
        expect(vm.displaySkip()).toBe(true);
    });

    it('should not display skip button if program does not allow skipping periods', function() {
        vm.requisition.program.periodsSkippable = false;
        expect(vm.displaySkip()).toBe(false);
    });

    it('should display skip button if requisition is not in initiated status', function() {
        vm.requisition.status = 'SUBMITTED';
        expect(vm.displaySkip()).toBe(false);
    });

    it('should display message when successfully skiped requisition', function() {
        var notificationSpy = jasmine.createSpy(),
            stateGoSpy = jasmine.createSpy();

        spyOn(Notification, 'success').andCallFake(notificationSpy);
        spyOn($state, 'go').andCallFake(stateGoSpy);

        vm.skipRnr();

        deferred.resolve();
        $rootScope.$apply();

        expect(notificationSpy).toHaveBeenCalledWith('msg.rnr.skip.success');
        expect(stateGoSpy).toHaveBeenCalledWith('requisitions.initRnr');
    });

    it('should diplay error message when skip requisition failed', function() {
        var notificationSpy = jasmine.createSpy();

        spyOn(Notification, 'error').andCallFake(notificationSpy);

        vm.skipRnr();

        deferred.reject();
        $rootScope.$apply();

        expect(notificationSpy).toHaveBeenCalledWith('msg.rnr.skip.failure');
    });
});
