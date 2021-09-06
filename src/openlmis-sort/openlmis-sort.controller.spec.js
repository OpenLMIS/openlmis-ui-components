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

    beforeEach(function() {
        module('openlmis-sort');

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$controller = $injector.get('$controller');
        });

        this.$stateParams = {
            sort: 'username'
        };

        this.vm = this.$controller('SortController', {
            $stateParams: this.$stateParams
        });
        this.vm.options = {
            'some.message.1': ['username'],
            'some.message.2': ['firstName,asc'],
            'some.message.3': ['lastName,desc', 'firstName,asc']
        };
        this.vm.onChange = jasmine.createSpy();
        this.vm.externalSort = true;

        spyOn(this.$state, 'go').and.returnValue();
    });

    describe('init', function() {

        it('should throw error if on change method is not a function', function() {
            this.vm.onChange = 'some-string';

            var vm = this.vm;

            expect(function() {
                vm.$onInit();
            }).toThrow('Parameter onChange is not a function!');
        });

        it('should set sort selection to one from state parameters', function() {
            this.vm.$onInit();

            expect(this.vm.sort).toEqual(this.$stateParams.sort);
        });

        it('should set externalSort to default true value', function() {
            this.vm.externalSort = undefined;
            this.vm.$onInit();

            expect(this.vm.externalSort).toEqual(true);

            this.vm.externalSort = null;
            this.vm.$onInit();

            expect(this.vm.externalSort).toEqual(true);
        });

        it('should set stateParamName to default if its null', function() {
            this.vm.stateParamName = undefined;
            this.vm.$onInit();

            expect(this.vm.stateParamName).toEqual('sort');

            this.vm.stateParamName = 'customStateParamName';
            this.vm.$onInit();

            expect(this.vm.stateParamName).toEqual('customStateParamName');
        });
    });

    describe('changeSort', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('assign new sort value', function() {
            this.vm.changeSort('username');

            expect(this.vm.sort).toEqual('username');
        });

        it('call onChange method with newly selected sort as parameter', function() {
            this.vm.changeSort('username');

            expect(this.vm.onChange).toHaveBeenCalledWith('username');
        });

        it('call state go based on externalSort value', function() {
            this.$state.current.name = 'current.state';
            this.$stateParams.sort = 'username';
            this.vm.changeSort('username');

            expect(this.$state.go).toHaveBeenCalledWith('current.state', this.$stateParams, {
                reload: this.vm.externalSort,
                notify: this.vm.externalSort
            });
        });
    });

    describe('getCurrentSortDisplay', function() {

        beforeEach(function() {
            this.vm.$onInit();
        });

        it('should return proper display message if exists in options for non-array values', function() {
            this.vm.sort = 'username';

            expect(this.vm.getCurrentSortDisplay()).toEqual('some.message.1');

            this.vm.sort = 'firstName,asc';

            expect(this.vm.getCurrentSortDisplay()).toEqual('some.message.2');
        });

        it('should return proper display message if exists in options for array values', function() {
            this.vm.sort = ['username'];

            expect(this.vm.getCurrentSortDisplay()).toEqual('some.message.1');

            this.vm.sort = ['firstName,asc'];

            expect(this.vm.getCurrentSortDisplay()).toEqual('some.message.2');

            this.vm.sort = ['lastName,desc', 'firstName,asc'];

            expect(this.vm.getCurrentSortDisplay()).toEqual('some.message.3');
        });

        it('should return undefined if sort does not exists in options', function() {
            this.vm.sort = 'some-sort-value';

            expect(this.vm.getCurrentSortDisplay()).toEqual(undefined);
        });
    });
});
