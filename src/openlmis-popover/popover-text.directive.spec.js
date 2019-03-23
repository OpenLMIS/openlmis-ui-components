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

describe('Popover Text Directive', function() {

    var element, $scope, popoverCtrl, $templateCache, $rootScope, $compile;

    beforeEach(function() {
        module('openlmis-popover');

        inject(function($injector) {
            $templateCache = $injector.get('$templateCache');
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
        });

        spyOn($templateCache, 'get').and.returnValue('<div>{{text}}</div>');

        $scope = $rootScope.$new();

        var markup = '<button popover="{{popoverText}}" />';
        element = $compile(markup)($scope);
        $scope.$apply();

        popoverCtrl = element.controller('popover');

        spyOn(popoverCtrl, 'addElement').and.callThrough();
        spyOn(popoverCtrl, 'removeElement').and.callThrough();
    });

    it('adds a text element to the popover controller', function() {
        $scope.popoverText = 'Hello World!';
        $scope.$apply();

        expect(popoverCtrl.addElement).toHaveBeenCalled();
    });

    it('allows the text to be updated without re-adding the element', function() {
        $scope.popoverText = 'Hello World!';
        $scope.$apply();

        expect(popoverCtrl.getElements()[0].text()).toBe('Hello World!');

        $scope.popoverText = 'Foo Bar';
        $scope.$apply();

        expect(popoverCtrl.getElements()[0].text()).toBe('Foo Bar');
        expect(popoverCtrl.addElement.calls.count()).toBe(1);
    });

    it('will remove the text element from the popover controller if the popover attribute is empty (ie "")',
        function() {
            $scope.popoverText = 'Hello World!';
            $scope.$apply();

            expect(popoverCtrl.addElement).toHaveBeenCalled();

            $scope.popoverText = '';
            $scope.$apply();

            expect(popoverCtrl.removeElement).toHaveBeenCalled();
        });
});
