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

describe('Select directive', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.messageService = $injector.get('messageService');
        });

        spyOn(this.messageService, 'get').andCallFake(function(key) {
            return key;
        });

        this.scope = this.$rootScope.$new();

        var context = this;
        this.makeElement = function makeElement(template) {
            var element = context.$compile(template)(context.scope);
            context.scope.$apply();
            return element;
        };
    });

    it('shows placeholder attribute as first option', function() {
        this.scope.options = [];
        var element = this.makeElement(
            '<select></select>'
        );

        var firstOption = element.children('option:first');

        expect(firstOption.hasClass('placeholder')).toBe(true);
        expect(firstOption.text()).toBe('openlmisForm.selectAnOption');
    });

    it('reads the placeholder value of an element', function() {
        this.scope.options = [];
        var element = this.makeElement(
            '<select placeholder="something"></select>'
        );

        expect(element.children('option.placeholder').text()).toBe('something');
    });

    it('won\'t overwrite a placeholder that is set as an option', function() {
        var element = this.makeElement(
            '<select placeholder="something">'
            + '<option value="">My Placeholder</option>'
            + '</select>'
        );

        expect(element.children('option.placeholder').text()).toBe('My Placeholder');
    });

    it('will not use a placeholder when no-placeholder is set', function() {
        var element = this.makeElement(
            '<select no-placeholder>'
            + '<option value="1">First element</option>'
            + '<option value="2">Second element</option>'
            + '</select>'
        );

        expect(element.children('option:first').text()).toBe('First element');
    });

});
