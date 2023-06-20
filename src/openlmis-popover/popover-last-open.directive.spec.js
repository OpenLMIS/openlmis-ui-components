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
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        spyOn(this.jQuery.prototype, 'popover').andCallThrough();

        this.$scope = this.$rootScope.$new();

        this.$scope.popoverTitle = 'Popover Title';
        this.$scope.popoverClass = 'example-class';

        var html = '<div openlmis-popover popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}" >' +
                '... other stuff ....' +
            '</div>';
        this.element = this.$compile(html)(this.$scope);
        angular.element('body').append(this.element);

        var otherHtml = '<div openlmis-popover>Something...</div>';
        this.otherElement = this.$compile(otherHtml)(this.$scope);
        angular.element('body').append(this.otherElement);

        this.popoverCtrl = this.element.controller('openlmisPopover');
        spyOn(this.popoverCtrl, 'getElements').andReturn([angular.element('<p>Hello World!</p>')]);

        this.otherPopoverCtrl = this.otherElement.controller('openlmisPopover');
        spyOn(this.otherPopoverCtrl, 'getElements').andReturn([angular.element('<p>Example</p>')]);

        this.$scope.$apply();
    });

    it('closes one popover, when the other opens', function() {
        spyOn(this.popoverCtrl, 'close').andCallThrough();

        this.popoverCtrl.open();
        this.otherPopoverCtrl.open();

        expect(this.popoverCtrl.close).toHaveBeenCalled();
    });

});
