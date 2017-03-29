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

describe('UserListController', function () {

    var vm, $state, $q, $controller, $rootScope, confirmSpy, usersList, UserFormModalMock;

    beforeEach(function() {
        module('admin-user-list', function($provide) {

            confirmSpy = jasmine.createSpyObj('confirmService', ['confirm']);
            UserFormModalMock = jasmine.createSpy('UserFormModal');

            $provide.service('confirmService', function() {
                return confirmSpy;
            });


            $provide.service('UserFormModal', function() {
                return UserFormModalMock;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            usersList = [
                {
                    id: 1,
                    username: 'administrator'
                },
                {
                    id: 2,
                    username: 'user'
                }
            ];
            stateParams = {
                page: 0,
                size: 10
            };

            vm = $controller('UserListController', {
                items: usersList,
                totalItems: usersList.length,
                stateParams: stateParams
            });
        });
    });

    describe('init', function() {

        beforeEach(function() {
            $controllerMock = jasmine.createSpy('$controller').andCallFake(function() {
                vm.stateParams = {};
            });

            vm = $controller('UserListController', {
                items: usersList,
                totalItems: usersList.length,
                stateParams: stateParams,
                $controller: $controllerMock
            });

        });

        it('should extend BasePaginationController', function() {
            expect($controllerMock).toHaveBeenCalledWith('BasePaginationController', {
                vm: vm,
                items: usersList,
                totalItems: usersList.length,
                stateParams: stateParams,
                externalPagination: true,
                itemValidator: undefined
            });
        });

        it('should expose openUserFormModal method', function() {
            expect(angular.isFunction(vm.openUserFormModal)).toBe(true);
        });

    });

    describe('openUserFormModal', function() {

        var formDeferred, user;

        beforeEach(function() {
            formDeferred = $q.defer();
            UserFormModalMock.andReturn(formDeferred.promise);

            user = {
                username: "johndoe1",
                firstName: "John",
                lastName: "Doe",
                email: "johndoe1@gmail.com",
                loginRestricted: false
            };

            spyOn($state, 'reload').andReturn();
        });

        it('should open User Form Modal', function() {
            vm.openUserFormModal(user);

            expect(UserFormModalMock).toHaveBeenCalledWith(user);
        });

        it('should reload page if user creation/edition succeeded', function() {
            vm.openUserFormModal(user);
            formDeferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should not reload page if modal was dismissed', function() {
            vm.openUserFormModal(user);
            formDeferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

    });

    describe('resetUserPassword', function() {

        beforeEach(function() {
            confirmSpy.confirm.andReturn($q.when(true));
        });

        it('should expose resetUserPassword method', function() {
            expect(angular.isFunction(vm.resetUserPassword)).toBe(true);
        });

        it('should call confirmService', function() {
            vm.resetUserPassword(1);
            expect(confirmSpy.confirm).toHaveBeenCalledWith('msg.question.confirmation.resetPassword');
        });
    });

    describe('search', function() {

        beforeEach(function() {
            vm.changePage = jasmine.createSpy();
            vm.stateParams.pageSize = 1;
            vm.stateParams.page = 1;
            vm.search();
        });

        it('should change page to first one', function() {
            expect(vm.stateParams.page).toEqual(0);
        });

        it('should call change page method', function() {
            expect(vm.changePage).toHaveBeenCalled();
        });
    });
});
