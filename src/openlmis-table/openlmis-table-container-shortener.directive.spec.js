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

    beforeEach(function() {
        module('openlmis-table', function($compileProvider) {
            $compileProvider.directive('table', function() {
                var def = {
                    priority: 100,
                    terminal: true,
                    restrict: 'E'
                };
                return def;
            });
        });

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.$window = $injector.get('$window');
        });

        this.$scope = this.$rootScope.$new();
        this.markup =
            '<div class="openlmis-table-container">' +
                '<table>' +
                    '<tr>' +
                        '<td><input /></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td><input /></td>' +
                    '</tr>' +
                '</table>' +
            '</div>';

        var originalHeight = $.prototype.height;
        var context = this;
        spyOn($.prototype, 'height').andCallFake(function() {
            // fake window.height() if windowHeight is provided; call through otherwise
            if (this[0] === context.$window && context.windowHeight !== undefined) {
                return context.windowHeight;
            }
            return originalHeight.apply(this, arguments);

        });

        spyOn($.prototype, 'ready').andCallFake(function() {
            // call passed in function immediately; allows to test code that's in window.ready
            if (arguments.length && typeof arguments[0] === 'function') {
                arguments[0]();
            }
        });

        this.table = this.$compile(this.markup)(this.$scope);
        this.$scope.$apply();

        // make horizontal scrollbar visible
        this.table.css('width', 200 + 'px');
        this.table.find('.openlmis-flex-table').css('width', 400 + 'px');

        this.calculateContainerOffset = function(scrollbar) {
            var offset = scrollbar.parent()[0].getBoundingClientRect().bottom;
            jQuery('.openlmis-toolbar').each(function() {
                var div = jQuery(this);
                offset += div.outerHeight();
            });
            return offset;
        };
    });

    it('should initiate perfect scrollbar', function() {
        expect(this.table.find('.ps-scrollbar-x-rail').length).toBe(1);
    });

    // it('should call update method when resizing screen', function() {
    //     spyOn(this.PerfectScrollbar, 'update');

    //     angular.element(this.$window).triggerHandler('resize');
    //     this.$scope.$apply();

    //     expect(this.PerfectScrollbar.update).toHaveBeenCalled();
    // });

    it('should set bottom-offset property when scrolling', function() {
        var scrollbar = this.table.find('.ps-scrollbar-x-rail');

        expect(scrollbar.length).toBe(1);

        spyOn(scrollbar[0].style, 'setProperty');

        // when: window lacks 100px to fit table container vertically
        this.windowHeight = this.calculateContainerOffset(scrollbar) - 100;

        angular.element(this.$window).triggerHandler('scroll');
        this.$scope.$apply();

        // then: scrollbar should have css property --bottom-offset=100
        expect(scrollbar[0].style.setProperty).toHaveBeenCalledWith('--bottom-offset', 100);
    });
});
