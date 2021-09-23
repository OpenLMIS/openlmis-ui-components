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

describe('Characters left directive', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
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

        this.charactersLeftCtrl = this.input.controller('charactersLeft');
        spyOn(this.charactersLeftCtrl, 'updateCharactersLeft').andCallThrough();
    });

    it('displays the characters left element when element is focused', function() {
        expect(this.element.find('.characters-left').length).toBe(0);

        this.input.focus();
        this.scope.$apply();

        expect(this.element.find('.characters-left').length).toBe(1);

        this.input.blur();
        this.scope.$apply();

        expect(this.element.find('.characters-left').length).toBe(0);
    });

    it('will debounce changes to update characters left', function() {
        this.input.focus();

        this.scope.example = 'text';
        this.input.keypress();
        this.scope.$apply();

        this.scope.example = 'test';
        this.input.keypress();
        this.scope.$apply();

        this.$timeout.flush();

        // Has done multiple changes, but only one call to updateCharactersLeft
        expect(this.charactersLeftCtrl.updateCharactersLeft.calls.length).toBe(1);

        this.scope.example = 'foo';
        this.input.keypress();
        this.scope.$apply();
        this.$timeout.flush();
        // Another change, just to make sure it works
        expect(this.charactersLeftCtrl.updateCharactersLeft.calls.length).toBe(2);
    });

    it('shows an error state when the model value is longer than the allowed length', function() {
        this.input.focus();
        this.scope.example = 'Long text';
        this.input.keypress();
        this.scope.$apply();
        this.$timeout.flush();

        expect(this.element.find('.characters-left').hasClass('is-invalid')).toBe(true);

        this.scope.example = 'four';
        this.input.keypress();
        this.scope.$apply();
        this.$timeout.flush();

        expect(this.element.find('.characters-left').hasClass('is-invalid')).toBe(false);
    });

    it('hides characters-left element when characters-left attribute is "false"', function() {
        this.input.attr('characters-left', 'false');

        this.input.focus();
        this.scope.$apply();

        expect(this.element.find('.characters-left').length).toBe(0);
    });
});