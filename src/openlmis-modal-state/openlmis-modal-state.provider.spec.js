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

    var modalStateProvider, $stateProvider, openlmisModalService, dialogSpy, $q, $rootScope;

    beforeEach(prepareSuite);

    it('should register state without template url', function() {
        modalStateProvider.state('some.state', {
            templateUrl: 'some-url'
        });

        expect($stateProvider.state.calls[0].args[1].templateUrl).toBeUndefined();
    });

    it('should register state without controller', function() {
        modalStateProvider.state('some.state', {
            controller: 'SomeController'
        });

        expect($stateProvider.state.calls[0].args[1].templateUrl).toBeUndefined();
    });

    it('should register state without controllerAs', function() {
        modalStateProvider.state('some.state', {
            controllerAs: 'as'
        });

        expect($stateProvider.state.calls[0].args[1].templateUrl).toBeUndefined();
    });

    describe('state', function() {

        var state;

        beforeEach(function() {
            modalStateProvider.state('some.state', {});
            state = $stateProvider.state.calls[0].args[1];
        });

        it('should open modal on enter', function() {
            state.onEnter(openlmisModalService);

            expect(openlmisModalService.createDialog).toHaveBeenCalled();
        });

        it('should close modal on exit', function() {
            state.onEnter(openlmisModalService);
            state.onExit();

            expect(dialogSpy.hide).toHaveBeenCalled();
        });

    });

    describe('modal', function() {

        var modal, someObject, someParentObject;

        beforeEach(function() {
            modalStateProvider.state('some.state', {
                resolve: {
                    someObject: function() {}
                },
                parentResolves: ['someParentObject']
            });

            someObject = {
                id: 'some-object-id'
            };

            someParentObject = {
                id: 'some-parent-object-id'
            };

            $stateProvider.state.calls[0].args[1]
                .onEnter(openlmisModalService, someObject, someParentObject);

            modal = openlmisModalService.createDialog.calls[0].args[0];
        });

        it('should pass resolved values', function() {
            var result;

            $q.when(modal.resolve.someObject()).then(function(someObject) {
                result = someObject;
            });
            $rootScope.$apply();

            expect(result).toEqual(someObject);
        });

        it('should pass parent resolved values', function() {
            var result;

            $q.when(modal.resolve.someParentObject()).then(function(someParentObject) {
                result = someParentObject;
            });
            $rootScope.$apply();

            expect(result).toEqual(someParentObject);
        });

    });

    function prepareSuite() {
        injectProviders(function(_modalStateProvider_, _$stateProvider_) {
            modalStateProvider = _modalStateProvider_;
            $stateProvider = _$stateProvider_;
        });

        module('openlmis-modal-state', 'fake-module');

        inject(function($injector) {
            openlmisModalService = $injector.get('openlmisModalService');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
        });

        dialogSpy = jasmine.createSpyObj('dialog', ['hide']);

        spyOn($stateProvider, 'state').andCallThrough();
        spyOn(openlmisModalService, 'createDialog').andReturn(dialogSpy);
    }

    function injectProviders(providers) {
        angular.module('fake-module', [
            'openlmis-modal-state'
        ]).config(providers);
    }

});
