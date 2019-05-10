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

describe('Characters left controller', function() {
    var element, input, scope, $timeout, vm;

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($compile, $rootScope, _$timeout_) {
        $timeout = _$timeout_;

        var markup = '<div>' +
            '<input type="text" characters-left ng-maxlength="5" ng-model="example" />' +
            '<span>{{example}}</span>' +
        '</div>';

        scope = $rootScope.$new();
        scope.example = 'test';

        element = $compile(markup)(scope);
        angular.element('body').append(element);

        scope.$apply();
        $timeout.flush();

        input = element.find('input');

        vm = input.controller('charactersLeft');
    }));

    it('has charactersLeftElement set by directive element', function() {
        expect(vm.charactersLeftElement).not.toBe(null);
    });

    it('has maxlength set by directive element', function() {
        expect(vm.maxlength).toBe(5);
    });

    it('calculates the number of characters left', function() {
        vm.updateCharactersLeft();

        expect(vm.areCharactersLeft).toBe(true);
        expect(vm.charactersLeft).toBe(1);

        scope.example = 'Longer word';
        input.keypress();
        scope.$apply();
        $timeout.flush();

        expect(vm.areCharactersLeft).toBe(false);
        expect(vm.charactersLeft).toBe(-6);
    });

});