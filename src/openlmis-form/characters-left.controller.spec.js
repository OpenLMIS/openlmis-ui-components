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

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
            this.$timeout = $injector.get('$timeout');
        });

        var markup = '<div>' +
            '<input type="text" characters-left ng-maxlength="5" ng-model="example" />' +
            '<span>{{example}}</span>' +
            '</div>';

        this.scope = this.$rootScope.$new();
        this.scope.example = 'test';

        this.element = this.$compile(markup)(this.scope);
        angular.element('body').append(this.element);

        this.scope.$apply();
        this.$timeout.flush();

        this.input = this.element.find('input');

        this.vm = this.input.controller('charactersLeft');
    });

    it('has charactersLeftElement set by directive element', function() {
        expect(this.vm.charactersLeftElement).not.toBe(null);
    });

    it('has maxlength set by directive element', function() {
        expect(this.vm.maxlength).toBe(5);
    });

    it('calculates the number of characters left', function() {
        this.vm.updateCharactersLeft();

        expect(this.vm.areCharactersLeft).toBe(true);
        expect(this.vm.charactersLeft).toBe(1);

        this.scope.example = 'Longer word';
        this.input.keypress();
        this.scope.$apply();
        this.$timeout.flush();

        expect(this.vm.areCharactersLeft).toBe(false);
        expect(this.vm.charactersLeft).toBe(-6);
    });

});