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

describe('addProductModalService', function() {

    var addProductModalService, $q, $ngBootbox, $rootScope, $compileMock, $controllerMock,
        $templateRequestMock, compiledMock, template;

    beforeEach(function() {
        module('requisition-non-full-supply', function($provide) {
            $controllerMock = jasmine.createSpy('$controller');
            $templateRequestMock = jasmine.createSpy('$templateRequestMock');
            $compileMock = jasmine.createSpy('$compile');

            $provide.factory('$controller', function() {
                return $controllerMock;
            });

            $provide.factory('$templateRequest', function() {
                return $templateRequestMock;
            });

            $provide.factory('$compile', function() {
                return $compileMock;
            });
        });

        inject(function($injector) {
            addProductModalService = $injector.get('addProductModalService');
            $q = $injector.get('$q');
            $ngBootbox = $injector.get('$ngBootbox');
            $rootScope = $injector.get('$rootScope');
        });

        template = 'template';
        compiledMock = jasmine.createSpy('compiled');

        $templateRequestMock.andReturn($q.when(template));
        $compileMock.andReturn(compiledMock);

        spyOn($ngBootbox, 'customDialog');
    });

    it('show should should spawn new controller', function() {
        addProductModalService.show();

        expect($controllerMock).toHaveBeenCalled();
    });

    it('show should request template', function() {
        addProductModalService.show();

        expect($templateRequestMock).toHaveBeenCalled();
    });

    it('show should compile template', function() {
        var scope = {};
        spyOn($rootScope, '$new').andReturn(scope);

        addProductModalService.show();
        $rootScope.$apply();

        expect($compileMock).toHaveBeenCalledWith(angular.element(template));
        expect(compiledMock).toHaveBeenCalledWith(scope);
    });

    it('show should open modal', function() {
        addProductModalService.show();
        $rootScope.$apply();

        expect($ngBootbox.customDialog).toHaveBeenCalled();
    });

});
