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

describe('openlmisTableContainer', function() {
    'use strict';

    var $compile, $window, PerfectScrollbar, scope, table, windowHeight;

    beforeEach( module('openlmis-table', function($compileProvider) {
        $compileProvider.directive('table', function() {
            var def = {
                priority: 100,
                terminal: true,
                restrict: 'E'
            };
            return def;
        });
    }));

    beforeEach(module('openlmis-config'));

    beforeEach(function() {
        inject(function(_$compile_, $rootScope, _$window_, _PerfectScrollbar_) {
            $compile = _$compile_;
            $window = _$window_;
            PerfectScrollbar = _PerfectScrollbar_;
            scope = $rootScope.$new();
        });
        var originalHeight = $.prototype.height;
        spyOn($.prototype, 'height').andCallFake(function() {
            if (this[0] === $window && windowHeight !== undefined) {
                return windowHeight;
            } else {
                return originalHeight.apply(this, arguments);
            }
        });
        table = compileMarkup('<div class="openlmis-table-container"><table><tr><td><input  /></td></tr><tr><td><input /></td></tr></table></div>');

        // make horizontal scrollbar visible
        table.css('width', 200 + 'px');
        table.find('.openlmis-flex-table').css('width', 400 + 'px');
    });

    it('should initiate perfect scrollbar', function() {
        expect(table.find('.ps__scrollbar-x-rail').length).toBe(1);
    });

    it('should call update method when resizing screen', function() {
        spyOn(PerfectScrollbar, 'update');

        angular.element($window).triggerHandler('resize');
        scope.$apply();

        expect(PerfectScrollbar.update).toHaveBeenCalled();
    });

    it('should set bottom-offset property when scrolling', function() {
        var scrollbar = table.find('.ps__scrollbar-x-rail');
        expect(scrollbar.length).toBe(1);

        spyOn(scrollbar[0].style, 'setProperty');

        // when: window lacks 100px to fit table container vertically
        windowHeight = calculateContainerOffset(scrollbar) - 100;

        angular.element($window).triggerHandler('scroll');
        scope.$apply();

        // then: scrollbar should have css property --bottom-offset=100
        expect(scrollbar[0].style.setProperty).toHaveBeenCalledWith('--bottom-offset', 100);
    });

    function compileMarkup(markup) {
        var element = $compile(markup)(scope);

        angular.element('body').append(element);
        scope.$apply();

        return element;
    }

    function calculateContainerOffset(scrollbar) {
        var offset = scrollbar.parent()[0].getBoundingClientRect().bottom;
        jQuery('.openlmis-toolbar').each(function () {
            var div = jQuery(this);
            offset += div.outerHeight();
        });
        return offset;
    }
});
