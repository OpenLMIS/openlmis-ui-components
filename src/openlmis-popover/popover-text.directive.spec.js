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

    beforeEach(function() {
        module('openlmis-popover');

        inject(function($injector) {
            this.$templateCache = $injector.get('$templateCache');
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
        });

        spyOn(this.$templateCache, 'get').andReturn('<div>{{text}}</div>');

        this.$scope = this.$rootScope.$new();

        var markup = '<button openlmis-popover="{{popoverText}}" />';
        this.element = this.$compile(markup)(this.$scope);
        this.$scope.$apply();

        this.popoverCtrl = this.element.controller('openlmisPopover');

        spyOn(this.popoverCtrl, 'addElement').andCallThrough();
        spyOn(this.popoverCtrl, 'removeElement').andCallThrough();
    });

    it('adds a text element to the popover controller', function() {
        this.$scope.popoverText = 'Hello World!';
        this.$scope.$apply();

        expect(this.popoverCtrl.addElement).toHaveBeenCalled();
    });

    it('allows the text to be updated without re-adding the element', function() {
        this.$scope.popoverText = 'Hello World!';
        this.$scope.$apply();

        expect(this.popoverCtrl.getElements()[0].text()).toBe('Hello World!');

        this.$scope.popoverText = 'Foo Bar';
        this.$scope.$apply();

        expect(this.popoverCtrl.getElements()[0].text()).toBe('Foo Bar');
        expect(this.popoverCtrl.addElement.calls.length).toBe(1);
    });

    it('will remove the text element from the popover controller if the popover attribute is empty (ie "")',
        function() {
            this.$scope.popoverText = 'Hello World!';
            this.$scope.$apply();

            expect(this.popoverCtrl.addElement).toHaveBeenCalled();

            this.$scope.popoverText = '';
            this.$scope.$apply();

            expect(this.popoverCtrl.removeElement).toHaveBeenCalled();
        });
});
