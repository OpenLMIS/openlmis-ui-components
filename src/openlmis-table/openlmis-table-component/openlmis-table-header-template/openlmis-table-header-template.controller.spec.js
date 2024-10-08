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

describe('openlmisTableHeaderTemplateController', function() {
    var $controller, $compile, $scope, $timeout, uniqueIdService, jQueryMock;

    beforeEach(module('openlmis-table'));

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function(_$controller_, _$compile_, _$rootScope_, _$timeout_, _uniqueIdService_) {
        $controller = _$controller_;
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
        uniqueIdService = _uniqueIdService_;

        jQueryMock = jasmine.createSpy('jQuery').andReturn({
            append: jasmine.createSpy('append')
        });

        spyOn(uniqueIdService, 'generate').andReturn('unique-id');
    }));

    describe('$onInit', function() {
        it('should generate a unique divId', function() {
            var ctrl = $controller('openlmisTableHeaderTemplateController', {
                $scope: $scope,
                $compile: $compile,
                $timeout: $timeout,
                uniqueIdService: uniqueIdService,
                jQuery: jQueryMock
            });

            ctrl.headerConfig = {};

            ctrl.$onInit();

            expect(ctrl.divId).toEqual('unique-id');
            expect(uniqueIdService.generate).toHaveBeenCalled();
        });

        it('should call injectHtmlContent if headerConfig.template is defined', function() {
            var ctrl = $controller('openlmisTableHeaderTemplateController', {
                $scope: $scope,
                $compile: $compile,
                $timeout: $timeout,
                uniqueIdService: uniqueIdService,
                jQuery: jQueryMock
            });

            ctrl.headerConfig = {
                template: jasmine.createSpy('template').andReturn('<div></div>')
            };

            spyOn(ctrl, 'injectHtmlContent').andCallThrough();

            ctrl.$onInit();
            $timeout.flush();

            expect(ctrl.injectHtmlContent).toHaveBeenCalled();
        });

        it('should not call injectHtmlContent if headerConfig.template is undefined', function() {
            var ctrl = $controller('openlmisTableHeaderTemplateController', {
                $scope: $scope,
                $compile: $compile,
                $timeout: $timeout,
                uniqueIdService: uniqueIdService,
                jQuery: jQueryMock
            });

            ctrl.headerConfig = {
                template: undefined
            };

            spyOn(ctrl, 'injectHtmlContent');

            ctrl.$onInit();
            $timeout.flush();

            expect(ctrl.injectHtmlContent).not.toHaveBeenCalled();
        });
    });

    describe('injectHtmlContent', function() {
        it('should compile and append the HTML content if compilation is successful', function() {
            var ctrl = $controller('openlmisTableHeaderTemplateController', {
                $scope: $scope,
                $compile: $compile,
                $timeout: $timeout,
                uniqueIdService: uniqueIdService,
                jQuery: jQueryMock
            });

            ctrl.divId = 'unique-id';
            ctrl.headerConfig = {
                template: jasmine.createSpy('template').andReturn('<div></div>')
            };

            var compiledElement = angular.element('<div></div>');
            spyOn($compile, 'call').andReturn(function() {
                return compiledElement;
            });

            ctrl.injectHtmlContent();

            expect(jQueryMock).toHaveBeenCalledWith('#unique-id');
        });

        it('should append the raw HTML content if compilation fails', function() {
            var ctrl = $controller('openlmisTableHeaderTemplateController', {
                $scope: $scope,
                $compile: $compile,
                $timeout: $timeout,
                uniqueIdService: uniqueIdService,
                jQuery: jQueryMock
            });

            ctrl.divId = 'unique-id';
            ctrl.headerConfig = {
                template: jasmine.createSpy('template').andReturn('<div>Raw HTML</div>')
            };

            spyOn($compile, 'call').andReturn(angular.element([]));

            var appendSpy = jasmine.createSpy('append');
            jQueryMock.andReturn({
                append: appendSpy
            });

            ctrl.injectHtmlContent();

            expect(jQueryMock).toHaveBeenCalledWith('#unique-id');
        });
    });
});
