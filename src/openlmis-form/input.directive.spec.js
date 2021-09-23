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

describe('Input directive', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.uniqueIdService = $injector.get('uniqueIdService');
        });

        this.scope = this.$rootScope.$new();

        spyOn(this.uniqueIdService, 'generate').andReturn('ABC');
    });

    it('makes a unique ID, if not already set', function() {
        var markup = '<input />',
            element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('id')).toBe('ABC');

        markup = '<input id="" />';
        element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('id')).toBe('ABC');

        markup = '<input id="preset-id" />';
        element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('id')).toBe('preset-id');
    });

    it('sets the name property to the ng-model property value, if not already set', function() {
        var markup = '<input ng-model="foo" />',
            element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('name')).toBe('foo');

        markup = '<input ng-model="foo" name="preset" />';
        element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('name')).toBe('preset');
    });

    it('sets the name property to the id property value, if not already set', function() {
        var markup = '<input id="foo" />',
            element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('name')).toBe('input-foo');

        markup = '<input id="foo" name="preset" />';
        element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('name')).toBe('preset');
    });

    it('works with select elements', function() {
        var markup = '<select />',
            element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('id')).toBe('ABC');
        expect(element.attr('name')).toBe('input-ABC');
    });

    it('works with textarea elements', function() {
        var markup = '<textarea />',
            element = this.$compile(markup)(this.scope);
        this.scope.$apply();

        expect(element.attr('id')).toBe('ABC');
        expect(element.attr('name')).toBe('input-ABC');
    });

});