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
            this.$timeout = $injector.get('$timeout');
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        spyOn(this.jQuery.prototype, 'popover').andCallThrough();

        this.$scope = this.$rootScope.$new();

        this.$scope.popoverTitle = 'Popover Title';
        this.$scope.popoverClass = 'example-class';

        var html = '<div openlmis-popover popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}">' +
                '... other stuff ....' +
            '</div>';
        this.element = this.$compile(html)(this.$scope);

        angular.element('body').append(this.element);

        this.otherElement = angular.element('<button id="other" >Other</button>');
        angular.element('body').append(this.otherElement);

        this.popoverCtrl = this.element.controller('openlmisPopover');
        spyOn(this.popoverCtrl, 'getElements').andReturn([angular.element('<p>Hello World!</p>')]);
        spyOn(this.popoverCtrl, 'open').andCallThrough();
        spyOn(this.popoverCtrl, 'close').andCallThrough();

        this.$scope.$apply();
    });

    it('opens when the element gets focus, and closes when blurred', function() {
        this.element.focus();
        this.$timeout.flush();

        expect(this.popoverCtrl.open).toHaveBeenCalled();

        this.otherElement.focus();
        this.$timeout.flush();

        expect(this.popoverCtrl.close).toHaveBeenCalled();
    });

    it('opens when the element is moused over, and closes when the mouse moves else where', function() {
        this.element.mouseover();
        this.$timeout.flush();

        expect(this.popoverCtrl.open).toHaveBeenCalled();

        this.element.mouseout();
        this.$timeout.flush();

        expect(this.popoverCtrl.close).toHaveBeenCalled();
    });

});
