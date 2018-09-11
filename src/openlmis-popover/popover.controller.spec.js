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

describe('OpenLMIS Popover Controller', function() {
    var popoverCtrl, $compile, $rootScope;

    beforeEach(module('openlmis-popover'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(inject(function($controller) {
        popoverCtrl = $controller('PopoverController');
    }));

    it('can register HTML elements, and return them as a list', function() {
        var element = angular.element('<p>Example</p>');

        expect(popoverCtrl.getElements()).toEqual([]);

        popoverCtrl.addElement(element);

        expect(popoverCtrl.getElements()).toEqual([element]);
    });

    it('allows HTML elements to be removed', function() {
        var element = angular.element('<p>Example</p>'),
            secondElement = angular.element('<p>Foo</p>');

        popoverCtrl.addElement(element);
        popoverCtrl.addElement(secondElement);

        expect(popoverCtrl.getElements()).toEqual([element, secondElement]);

        var returnValue = popoverCtrl.removeElement(element);
        expect(returnValue).toBe(true);
        expect(popoverCtrl.getElements()).toEqual([secondElement]);

        // Make sure we can't remove an item twice
        returnValue = popoverCtrl.removeElement(element);
        expect(returnValue).toBe(false);

        // Make sure removing can identitify dynamic elements
        var scope = $rootScope.$new(),
            dynamicElement = $compile('<p>{{value}}</p>')(scope);
        scope.value = 'Cool example string';
        scope.$apply();

        popoverCtrl.addElement(dynamicElement);
        expect(popoverCtrl.getElements()).toEqual([secondElement, dynamicElement]);

        scope.value = 'Changing the dynamic element should not matter - because DYNAMIC';
        scope.$apply();

        popoverCtrl.removeElement(dynamicElement);
        expect(popoverCtrl.getElements()).toEqual([secondElement]);

        // Removing the last element
        popoverCtrl.removeElement(secondElement);
        expect(popoverCtrl.getElements()).toEqual([]);
    });

    it('will keep the list of HTML elements ordered by priority', function() {
        var element = angular.element('<p>Example</p>'),
            secondElement = angular.element('<p>Foo</p>'),
            thirdElement = angular.element('<p>Baz</p>');

        popoverCtrl.addElement(element, 11);
        popoverCtrl.addElement(secondElement);
        popoverCtrl.addElement(thirdElement, 5);

        expect(popoverCtrl.getElements()).toEqual([thirdElement, secondElement, element]);
    });

});