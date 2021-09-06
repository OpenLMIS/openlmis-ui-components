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
        angular.module('provider-inject-module', [
            'openlmis-modal-state'
        ]).config(function(modalStateProvider, $stateProvider) {
            suite.modalStateProvider = modalStateProvider;
            suite.$stateProvider = $stateProvider;

        });

        module('provider-inject-module');
        module('openlmis-modal-state');

        inject(function($injector) {
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.$location = $injector.get('$location');
            this.$state = $injector.get('$state');
        });

        this.dialogSpy = jasmine.createSpyObj('dialog', ['hide']);

        spyOn(this.$stateProvider, 'state').and.callThrough();
        spyOn(this.openlmisModalService, 'createDialog').and.returnValue(this.dialogSpy);

        this.goToUrl = function(url) {
            this.$location.url(url);
            this.$rootScope.$apply();
        };
        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    it('should register state without template url', function() {
        this.modalStateProvider.state('some.state', {
            templateUrl: 'some-url'
        });

        expect(this.$stateProvider.state.calls.first().args[1].templateUrl).toBeUndefined();
    });

    it('should register state without controller', function() {
        this.modalStateProvider.state('some.state', {
            controller: 'SomeController'
        });

        expect(this.$stateProvider.state.calls.first().args[1].templateUrl).toBeUndefined();
    });

    it('should register state without controllerAs', function() {
        this.modalStateProvider.state('some.state', {
            controllerAs: 'as'
        });

        expect(this.$stateProvider.state.calls.first().args[1].templateUrl).toBeUndefined();
    });

    describe('state', function() {

        beforeEach(function() {
            this.modalStateProvider.state('someState', {
                url: '/someState',
                resolve: {
                    keyOne: function() {
                        return 'valueOne';
                    }
                }
            });

            this.modalStateProvider.state('someOtherState', {
                url: '/someOtherState'
            });

            this.modalStateProvider.state('someState.someChildState', {
                url: '/someChildState',
                parentResolves: ['keyOne'],
                resolve: {
                    keyTwo: function(keyOne) {
                        return keyOne + ' plus valueTwo';
                    }
                }
            });
        });

        it('should open modal on enter', function() {
            this.goToUrl('/someState');

            expect(this.openlmisModalService.createDialog).toHaveBeenCalled();
        });

        it('should close modal on exit', function() {
            this.goToUrl('/someState');
            this.goToUrl('/someOtherState');

            expect(this.dialogSpy.hide).toHaveBeenCalled();
        });

        it('should resolve values', function() {
            this.goToUrl('/someState');

            expect(this.getResolvedValue('keyOne')).toEqual('valueOne');
        });

        it('should make parent state resolves available to children', function() {
            this.goToUrl('/someState/someChildState');

            expect(this.getResolvedValue('keyTwo')).toEqual('valueOne plus valueTwo');
        });

    });

});
