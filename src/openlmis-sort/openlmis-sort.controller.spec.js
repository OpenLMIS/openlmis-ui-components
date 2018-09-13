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

describe('SortController', function() {

    var vm, $state, $controller, $stateParams;

    beforeEach(function() {
        module('openlmis-sort');

        inject(function($injector) {
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
        });

        $stateParams = {
            sort: 'username'
        };

        vm = $controller('SortController', {
            $stateParams: $stateParams
        });
        vm.options = {
            username: 'some.message.1',
            'firstName,asc': 'some.message.2'
        };
        vm.onChange = jasmine.createSpy();
        vm.externalSort = true;

        spyOn($state, 'go').andReturn();
    });

    describe('init', function() {

        it('should throw error if on change method is not a function', function() {
            vm.onChange = 'some-string';

            expect(function() {
                vm.$onInit();
            }).toThrow(new Error('Parameter onChange is not a function!'));
        });

        it('should set sort selection to one from state parameters', function() {
            vm.$onInit();

            expect(vm.sort).toEqual($stateParams.sort);
        });

        it('should set externalSort to default true value', function() {
            vm.externalSort = undefined;
            vm.$onInit();

            expect(vm.externalSort).toEqual(true);

            vm.externalSort = null;
            vm.$onInit();

            expect(vm.externalSort).toEqual(true);
        });

        it('should set stateParamName to default if its null', function() {
            vm.stateParamName = undefined;
            vm.$onInit();

            expect(vm.stateParamName).toEqual('sort');

            vm.stateParamName = 'customStateParamName';
            vm.$onInit();

            expect(vm.stateParamName).toEqual('customStateParamName');
        });
    });

    describe('changeSort', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('assign new sort value', function() {
            vm.changeSort('username');

            expect(vm.sort).toEqual('username');
        });

        it('call onChange method with newly selected sort as parameter', function() {
            vm.changeSort('username');

            expect(vm.onChange).toHaveBeenCalledWith('username');
        });

        it('call state go based on externalSort value', function() {
            $state.current.name = 'current.state';
            $stateParams.sort = 'username';
            vm.changeSort('username');

            expect($state.go).toHaveBeenCalledWith('current.state', $stateParams, {
                reload: vm.externalSort,
                notify: vm.externalSort
            });
        });
    });

    describe('getCurrentSortDisplay', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should return proper display message if exists in options', function() {
            vm.sort = 'username';

            expect(vm.getCurrentSortDisplay()).toEqual(vm.options[vm.sort]);

            vm.sort = 'firstName,asc';

            expect(vm.getCurrentSortDisplay()).toEqual(vm.options[vm.sort]);
        });

        it('should return undefined if sort does not exists in options', function() {
            vm.sort = 'some-sort-value';

            expect(vm.getCurrentSortDisplay()).toEqual(undefined);
        });
    });
});
