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

describe('popoverTemplate directive', function() {

    beforeEach(function() {
        module('openlmis-popover');

        inject(function($injector) {
            this.$templateCache = $injector.get('$templateCache');
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        var template = '<div><p ng-if="!clicks">No clicks</p><p ng-if="clicks">{{clicks}} clicks</p>';
        this.templateURL = 'example/popover.html';
        this.$templateCache.put(this.templateURL, template);

        var html = '<button openlmis-popover popover-template="{{templateURL}}">Example</button>';

        this.scope = this.$rootScope.$new();
        this.scope.templateURL = this.templateURL;
        this.element = this.$compile(html)(this.scope);
        this.popoverCtrl = this.element.controller('openlmisPopover');

        spyOn(this.popoverCtrl, 'addElement').andCallThrough();
        spyOn(this.popoverCtrl, 'removeElement').andCallThrough();

        this.scope.$apply();
    });

    it('adds the rendered templateURL into the element\'s popover', function() {
        expect(this.popoverCtrl.addElement).toHaveBeenCalled();

        var addedElement = this.popoverCtrl.addElement.mostRecentCall.args[0];

        expect(addedElement.text()).toBe('No clicks');

        // Make sure scope updates are applied to the element
        this.scope.clicks = 2;
        this.scope.$apply();

        expect(addedElement.text()).toBe('2 clicks');
    });

    it('re-renders the template if the template URL is changed', inject(function($templateCache) {
        var newTemplateHtml = '<p>Example</p>',
            newTemplateUrl = 'example/example.html';
        $templateCache.put(newTemplateUrl, newTemplateHtml);

        this.scope.templateURL = newTemplateUrl;
        this.scope.$apply();

        expect(this.popoverCtrl.removeElement).toHaveBeenCalled();

        var removedElement = this.popoverCtrl.removeElement.mostRecentCall.args[0];

        expect(removedElement.text()).toBe('No clicks');

        expect(this.popoverCtrl.addElement).toHaveBeenCalled();

        var addedElement = this.popoverCtrl.addElement.mostRecentCall.args[0];

        expect(addedElement.text()).toBe('Example');
    }));

    it('removes the rendered template when the attribute is changed to an empty string', function() {
        this.scope.templateURL = '';
        this.scope.$apply();

        expect(this.popoverCtrl.removeElement).toHaveBeenCalled();

        var removedElement = this.popoverCtrl.removeElement.mostRecentCall.args[0];

        expect(removedElement.text()).toBe('No clicks');
    });
});
