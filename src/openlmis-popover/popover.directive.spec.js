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

    var scope, element, popover, popoverCtrl, jQuery, $compile, $rootScope;

    beforeEach(function() {
        module('openlmis-popover');
        module('openlmis-templates');

        inject(function($injector) {
            jQuery = $injector.get('jQuery');
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
        });

        spyOn(jQuery.prototype, 'popover').andCallThrough();

        scope = $rootScope.$new();

        scope.popoverTitle = 'Popover Title';
        scope.popoverClass = 'example-class';

        var html = '<div popover popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}" >' +
            '... other stuff ....' +
            '</div>';
        element = $compile(html)(scope);

        angular.element('body').append(element);

        popoverCtrl = element.controller('popover');
        spyOn(popoverCtrl, 'getElements').andReturn([angular.element('<p>Hello World!</p>')]);

        scope.$apply();

        popover = jQuery.prototype.popover.mostRecentCall.args[0].template;
    });

    it('adds a popover when the popover directive is added', function() {
        expect(jQuery.prototype.popover).toHaveBeenCalled();
    });

    it('triggers openlmisPopover.change when content from PopoverController changes', function() {
        var num = 0;
        element.on('openlmisPopover.change', function() {
            num += 1;
        });

        popoverCtrl.getElements.andReturn([]);
        scope.$apply();

        expect(num).toBe(1);
    });

    it('adds the .has-popover class to the element when there is content from PopoverController', function() {
        expect(element.hasClass('has-popover')).toBe(true);

        popoverCtrl.getElements.andReturn([]);
        scope.$apply();

        expect(element.hasClass('has-popover')).toBe(false);
    });

    it('gets popover content from PopoverController', function() {
        var elements = [angular.element('<p>Test</p>')];
        popoverCtrl.getElements.andReturn(elements);

        // this is what updates the popover content
        element.popover('show');

        expect(popoverCtrl.getElements).toHaveBeenCalled();
        expect(popover.find('.popover-content').text()).toBe('Test');

        elements.push(angular.element('<p>Example</p>'));

        element.popover('show');

        expect(popover.find('.popover-content').text()).toBe('TestExample');
    });

    it('adds an open method to popoverCtrl', function() {
        expect(popoverCtrl.open).not.toBeFalsy();

        var opened = false;
        element.on('openlmisPopover.open', function() {
            opened = true;
        });

        popoverCtrl.open();

        expect(opened).toBe(true);
    });

    it('adds a close method to popoverCtrl', function() {
        expect(popoverCtrl.close).not.toBeFalsy();

        var closed = false;
        element.on('openlmisPopover.close', function() {
            closed = true;
        });

        popoverCtrl.close();

        expect(closed).toBe(true);
    });

    it('adds the popoverScope to the PopoverController', function() {
        expect(popoverCtrl.popoverScope).not.toBeFalsy();
        expect(popoverCtrl.popoverScope.$apply).not.toBeFalsy();
    });

    it('adds a close function to the PopoverController', function() {
        expect(popoverCtrl.popoverScope.closePopover).not.toBeFalsy();

        var closed = false;
        element.on('openlmisPopover.close', function() {
            closed = true;
        });

        popoverCtrl.popoverScope.closePopover();

        expect(closed).toBe(true);
    });

    it('exposes an updateTabIndex method on popoverCtrl', function() {
        expect(popoverCtrl.updateTabIndex).not.toBeFalsy();
    });

    it('it changes the elements tabindex when the popover controllers content changes', function() {
        expect(element.attr('tabindex')).toBe('0');

        popoverCtrl.getElements.andReturn([]);
        scope.$apply();

        expect(element.attr('tabindex')).toBe('-1');
    });

});
