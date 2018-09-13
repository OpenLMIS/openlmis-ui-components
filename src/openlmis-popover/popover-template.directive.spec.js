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
    var element, scope, popoverCtrl, templateURL;

    beforeEach(module('openlmis-popover'));

    beforeEach(inject(function($templateCache) {
        var html = '<div><p ng-if="!clicks">No clicks</p><p ng-if="clicks">{{clicks}} clicks</p>';

        templateURL = 'example/popover.html';
        $templateCache.put(templateURL, html);
    }));

    beforeEach(inject(function($compile, $rootScope) {
        var html = '<button popover popover-template="{{templateURL}}">Example</button>';

        scope = $rootScope.$new();
        scope.templateURL = templateURL;

        element = $compile(html)(scope);
        angular.element('body').append(element);

        popoverCtrl = element.controller('popover');
        spyOn(popoverCtrl, 'addElement').andCallThrough();
        spyOn(popoverCtrl, 'removeElement').andCallThrough();

        scope.$apply();
    }));

    it('adds the rendered templateURL into the element\'s popover', function() {
        expect(popoverCtrl.addElement).toHaveBeenCalled();

        var addedElement = popoverCtrl.addElement.mostRecentCall.args[0];

        expect(addedElement.text()).toBe('No clicks');

        // Make sure scope updates are applied to the element
        scope.clicks = 2;
        scope.$apply();

        expect(addedElement.text()).toBe('2 clicks');
    });

    it('re-renders the tempalte if the template URL is changed', inject(function($templateCache) {
        var newTemplateHtml = '<p>Example</p>',
            newTemplateUrl = 'example/example.html';
        $templateCache.put(newTemplateUrl, newTemplateHtml);

        scope.templateURL = newTemplateUrl;
        scope.$apply();

        expect(popoverCtrl.removeElement).toHaveBeenCalled();

        var removedElement = popoverCtrl.removeElement.mostRecentCall.args[0];

        expect(removedElement.text()).toBe('No clicks');

        expect(popoverCtrl.addElement).toHaveBeenCalled();

        var addedElement = popoverCtrl.addElement.mostRecentCall.args[0];

        expect(addedElement.text()).toBe('Example');
    }));

    it('removes the rendered template when the attribute is changed to an empty string', function() {
        scope.templateURL = '';
        scope.$apply();

        expect(popoverCtrl.removeElement).toHaveBeenCalled();

        var removedElement = popoverCtrl.removeElement.mostRecentCall.args[0];

        expect(removedElement.text()).toBe('No clicks');
    });
});
