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

        this.popoverCtrl = this.element.controller('openlmisPopover');
        spyOn(this.popoverCtrl, 'getElements').andReturn([angular.element('<p>Hello World!</p>')]);

        this.$scope.$apply();

        this.popover = this.jQuery.prototype.popover.mostRecentCall.args[0].template;
    });

    it('adds a popover when the popover directive is added', function() {
        expect(this.jQuery.prototype.popover).toHaveBeenCalled();
    });

    it('triggers openlmisPopover.change when content from PopoverController changes', function() {
        var num = 0;
        this.element.on('openlmisPopover.change', function() {
            num += 1;
        });

        this.popoverCtrl.getElements.andReturn([]);
        this.$scope.$apply();

        expect(num).toBe(1);
    });

    it('adds the .has-popover class to the element when there is content from PopoverController', function() {
        expect(this.element.hasClass('has-popover')).toBe(true);

        this.popoverCtrl.getElements.andReturn([]);
        this.$scope.$apply();

        expect(this.element.hasClass('has-popover')).toBe(false);
    });

    it('gets popover content from PopoverController', function() {
        var elements = [angular.element('<p>Test</p>')];
        this.popoverCtrl.getElements.andReturn(elements);

        // this is what updates the popover content
        this.element.popover('show');

        expect(this.popoverCtrl.getElements).toHaveBeenCalled();
        expect(this.popover.find('.popover-content').text()).toBe('Test');

        elements.push(angular.element('<p>Example</p>'));

        this.element.popover('show');

        expect(this.popover.find('.popover-content').text()).toBe('TestExample');
    });

    it('adds an open method to popoverCtrl', function() {
        expect(this.popoverCtrl.open).not.toBeFalsy();

        var opened = false;
        this.element.on('openlmisPopover.open', function() {
            opened = true;
        });

        this.popoverCtrl.open();

        expect(opened).toBe(true);
    });

    it('adds a close method to popoverCtrl', function() {
        expect(this.popoverCtrl.close).not.toBeFalsy();

        var closed = false;
        this.element.on('openlmisPopover.close', function() {
            closed = true;
        });

        this.popoverCtrl.close();

        expect(closed).toBe(true);
    });

    it('adds the popoverScope to the PopoverController', function() {
        expect(this.popoverCtrl.popoverScope).not.toBeFalsy();
        expect(this.popoverCtrl.popoverScope.$apply).not.toBeFalsy();
    });

    it('adds a close function to the PopoverController', function() {
        expect(this.popoverCtrl.popoverScope.closePopover).not.toBeFalsy();

        var closed = false;
        this.element.on('openlmisPopover.close', function() {
            closed = true;
        });

        this.popoverCtrl.popoverScope.closePopover();

        expect(closed).toBe(true);
    });

    it('exposes an updateTabIndex method on popoverCtrl', function() {
        expect(this.popoverCtrl.updateTabIndex).not.toBeFalsy();
    });

    it('it changes the elements tabindex when the popover controllers content changes', function() {
        expect(this.element.attr('tabindex')).toBe('0');

        this.popoverCtrl.getElements.andReturn([]);
        this.$scope.$apply();

        expect(this.element.attr('tabindex')).toBe('-1');
    });

});
