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

describe('modalStateProvider', function() {

    beforeEach(function() {
        var suite = this;
        angular.module('fake-module', [
            'openlmis-modal-state'
        ]).config(function(modalStateProvider, $stateProvider) {
            suite.modalStateProvider = modalStateProvider;
            suite.$stateProvider = $stateProvider;
        });

        module('openlmis-modal-state', 'fake-module');

        inject(function($injector) {
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
        });

        this.dialogSpy = jasmine.createSpyObj('dialog', ['hide']);

        spyOn(this.$stateProvider, 'state').andCallThrough();
        spyOn(this.openlmisModalService, 'createDialog').andReturn(this.dialogSpy);
    });

    it('should register state without template url', function() {
        this.modalStateProvider.state('some.state', {
            templateUrl: 'some-url'
        });

        expect(this.$stateProvider.state.calls[0].args[1].templateUrl).toBeUndefined();
    });

    it('should register state without controller', function() {
        this.modalStateProvider.state('some.state', {
            controller: 'SomeController'
        });

        expect(this.$stateProvider.state.calls[0].args[1].templateUrl).toBeUndefined();
    });

    it('should register state without controllerAs', function() {
        this.modalStateProvider.state('some.state', {
            controllerAs: 'as'
        });

        expect(this.$stateProvider.state.calls[0].args[1].templateUrl).toBeUndefined();
    });

    describe('state', function() {

        beforeEach(function() {
            this.modalStateProvider.state('some.state', {});
            this.state = this.$stateProvider.state.calls[0].args[1];
        });

        it('should open modal on enter', function() {
            this.state.onEnter(this.openlmisModalService);

            expect(this.openlmisModalService.createDialog).toHaveBeenCalled();
        });

        it('should close modal on exit', function() {
            this.state.onEnter(this.openlmisModalService);
            this.state.onExit();

            expect(this.dialogSpy.hide).toHaveBeenCalled();
        });

    });

    describe('modal', function() {

        beforeEach(function() {
            this.modalStateProvider.state('some.state', {
                resolve: {
                    someObject: function() {}
                },
                parentResolves: ['someParentObject']
            });

            this.someObject = {
                id: 'some-object-id'
            };

            this.someParentObject = {
                id: 'some-parent-object-id'
            };

            this.$stateProvider.state.calls[0].args[1]
                .onEnter(this.openlmisModalService, this.someObject, this.someParentObject);

            this.modal = this.openlmisModalService.createDialog.calls[0].args[0];
        });

        it('should pass resolved values', function() {
            var result;

            this.$q.when(this.modal.resolve.someObject()).then(function(someObject) {
                result = someObject;
            });
            this.$rootScope.$apply();

            expect(result).toEqual(this.someObject);
        });

        it('should pass parent resolved values', function() {
            var result;

            this.$q.when(this.modal.resolve.someParentObject()).then(function(someParentObject) {
                result = someParentObject;
            });
            this.$rootScope.$apply();

            expect(result).toEqual(this.someParentObject);
        });

    });

});
