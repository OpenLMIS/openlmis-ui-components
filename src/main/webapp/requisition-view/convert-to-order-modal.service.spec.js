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

describe("convertToOrderModalService", function() {

    var convertToOrderModalService, loadingModalServiceSpy, $ngBootbox, $rootScope, $compile,
        requisitionServiceSpy, templateRequestSpy, templateSpy, compiledTemplateSpy, scope, $state,
        type, facility, program, requisition, requisitions;

    beforeEach(function() {
        type = {
            name: 'facilityType'
        };

        facility = {
            id: '1',
            name: 'facility',
            type: type
        };

        program = {
            id: '1',
            name: 'program'
        };

        requisition = {
            id: '1',
            name: 'requisition',
            status: 'INITIATED',
            supplyingFacility: supplyingDepotSpy(0),
            program: program,
            facility: facility
        };

        requisitions = {
            content: [{
                requisition: requisition,
                supplyingDepots: [
                    supplyingDepotSpy(0),
                    supplyingDepotSpy(1),
                    supplyingDepotSpy(2),
                    supplyingDepotSpy(3)
                ]
            }]
        };

        module('requisition-view', function($provide) {
            loadingModalServiceSpy = jasmine.createSpyObj('loadingModalService', ['open', 'close']);
            $provide.factory('loadingModalService', function() {
                return loadingModalServiceSpy;
            });

            requisitionServiceSpy = jasmine.createSpyObj('requisitionService', [
                'forConvert', 'convertToOrder'
            ]);
            $provide.factory('requisitionService', function() {
                return requisitionServiceSpy;
            });

            templateRequestSpy = jasmine.createSpy('$templateRequest');
            $provide.factory('$templateRequest', function() {
                return templateRequestSpy;
            });
        });

        inject(function(_convertToOrderModalService_, _$ngBootbox_, _$rootScope_, $templateRequest,
                        $q, _$compile_, _$state_) {

            convertToOrderModalService = _convertToOrderModalService_;
            $ngBootbox = _$ngBootbox_;
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $state = _$state_;

            templateSpy = jasmine.createSpy('template');
            compiledTemplateSpy = jasmine.createSpy('compiledTemplate');

            spyOn($ngBootbox, 'customDialog');
            spyOn($ngBootbox, 'hideAll');
            spyOn($state, 'reload');

            scope = {};

            templateRequestSpy.andReturn(templateSpy);
            spyOn($rootScope, '$new').andReturn(scope);
            requisitionServiceSpy.forConvert.andReturn($q.when(requisitions));
            requisitionServiceSpy.convertToOrder.andReturn($q.when(requisitions));
        });
    });

    describe('show', function() {

        it('should request template', function() {
            convertToOrderModalService.show(requisition);
            $rootScope.$apply();

            expect(templateRequestSpy)
                .toHaveBeenCalledWith('requisition-view/convert-to-order-modal.html');
        });

        it('should open modal', function() {
            convertToOrderModalService.show(requisition);
            $rootScope.$apply();

            expect($ngBootbox.customDialog).toHaveBeenCalled();
        });

        it('should fetch requisitions for convert', function() {
            convertToOrderModalService.show(requisition);
            $rootScope.$apply();

            expect(requisitionServiceSpy.forConvert).toHaveBeenCalled();
        });

        it('should display loading modal while modal is loading', function() {
            convertToOrderModalService.show(requisition);

            expect(loadingModalServiceSpy.open).toHaveBeenCalled();
            expect(loadingModalServiceSpy.close).not.toHaveBeenCalled();

            $rootScope.$apply();

            expect(loadingModalServiceSpy.close).toHaveBeenCalled();
        });

        it('should expose requisition through vm', function() {
            convertToOrderModalService.show(requisition);
            $rootScope.$apply();

            expect(scope.vm.requisition).toBe(requisition);
        });

        it('should expose requisitions wth depots through vm', function() {
            convertToOrderModalService.show(requisition);
            $rootScope.$apply();

            expect(scope.vm.requisitionWithDepots).toEqual(requisitions.content[0]);
        });

    });

    describe('vm.convertRnr', function() {

        var vm, modalPromise;

        beforeEach(function() {
            modalPromise = convertToOrderModalService.show(requisition);
            $rootScope.$apply();
            scope.vm.convertRnr();
            $rootScope.$apply();
            vm = scope.vm;
        })

        it('should convert to order', function() {
            expect(requisitionServiceSpy.convertToOrder)
                .toHaveBeenCalledWith(requisitions.content);
        });

        it('should close modal', function() {
            expect($ngBootbox.hideAll).toHaveBeenCalled();
        });

        it('should reload state', function() {
            expect($state.reload).toHaveBeenCalled();
        });

        it('should resolve promise', function() {
            var resolved;

            modalPromise.then(function() {
                resolved = true;
            });

            $rootScope.$apply();

            expect(resolved).toBe(true);
        });

    });

    function supplyingDepotSpy(id) {
        return {
            $id: id
        };
    }
});
