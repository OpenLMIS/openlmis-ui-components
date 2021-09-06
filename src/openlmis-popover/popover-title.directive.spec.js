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

describe('PopoverDirective', function() {

    beforeEach(function() {
        module('openlmis-popover');

        inject(function($injector) {
            this.jQuery = $injector.get('jQuery');
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
        });

        spyOn(this.jQuery.prototype, 'popover').and.callThrough();

        this.$scope = this.$rootScope.$new();

        this.$scope.popoverTitle = 'Popover Title';
        this.$scope.popoverClass = 'example-class';

        var html = '<div popover popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}">' +
                '... other stuff ....' +
            '</div>';
        this.element = this.$compile(html)(this.$scope);
        this.popoverCtrl = this.element.controller('popover');

        spyOn(this.popoverCtrl, 'getElements').and.returnValue([angular.element('<p>Hello World!</p>')]);

        this.$scope.$apply();

        this.popover = this.jQuery.prototype.popover.calls.mostRecent().args[0].template;
    });

    it('allows the title element to be updated', function() {
        expect(this.popover.children('h3').text()).toBe('Popover Title');

        this.$scope.popoverTitle = 'Example Title';
        this.$scope.$apply();

        expect(this.popover.children('h3').text()).toBe('Example Title');
    });

    it('hides the title element when there is no title', function() {
        this.$scope.popoverTitle = '';
        this.$scope.$apply();

        expect(this.popover.children('h3').length).toBe(0);
    });

});
