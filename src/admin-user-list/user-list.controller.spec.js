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

    var vm, $state, $controller, $q, confirmSpy, usersList, stateParams;

    beforeEach(function() {
        module('admin-user-list', function($provide) {

            confirmSpy = jasmine.createSpyObj('confirmService', ['confirm']);

            $provide.service('confirmService', function() {
                return confirmSpy;
            });
        });

        inject(function (_$controller_, _$state_, _$q_) {

            $controller = _$controller_;
            $state = _$state_;
            $q = _$q_;
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
                users: usersList
            });
        });
    });

    describe('init', function() {

        beforeEach(function() {
            $controllerMock = jasmine.createSpy('$controller').andCallFake(function() {
                vm.stateParams = {};
            });

            vm = $controller('UserListController', {
                users: usersList,
                $controller: $controllerMock
            });

        });

        it('should expose openUserFormModal method', function() {
            expect(angular.isFunction(vm.openUserFormModal)).toBe(true);
        });
    });

    describe('goToCreateNewUserPage', function() {

        it('should expose goToCreateNewUser method', function() {
            expect(angular.isFunction(vm.goToCreateNewUser)).toBe(true);
        });
    });

    describe('editUser', function() {

        it('should expose editUser method', function() {
            expect(angular.isFunction(vm.editUser)).toBe(true);
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
            spyOn($state, 'go').andReturn();
        });

        it('should set lastName param', function() {
            vm.lastName = 'lastName';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('administration.users', {
                lastName: vm.lastName,
                firstName: undefined,
                email: undefined
            }, {reload: true});
        });

        it('should set firstName param', function() {
            vm.firstName = 'firstName';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('administration.users', {
                lastName: undefined,
                firstName: vm.firstName,
                email: undefined
            }, {reload: true});
        });

        it('should set email param', function() {
            vm.email = 'email';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('administration.users', {
                lastName: undefined,
                firstName: undefined,
                email: vm.email,
            }, {reload: true});
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
