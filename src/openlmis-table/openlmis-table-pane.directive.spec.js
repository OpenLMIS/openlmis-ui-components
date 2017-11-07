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

describe('openlmis-table.directive:OpenlmisTablePane', function() {
    var scope, $compile;

    beforeEach(module('openlmis-table'));

    beforeEach(inject(function($rootScope, $injector) {
        scope = $rootScope.$new();
        $compile = $injector.get('$compile');
    }));

    function compileTablePane() {
        var tbody = '<tbody><tr ng-repeat="item in items"><td></td><td></td><td></td></tr></tbody>',
            markup = '<div class="openlmis-table-pane"><table>' + tbody + '</table></div>',
            element = angular.element(markup);
        angular.element('body').append(element);

        return $compile(element)(scope);
    }

    // COMMENTED OUT BECAUSE IT BREAKS OTHER UNIT TESTS (for unknown reason)

    // describe('applies openlmis-table-sticky-cell', function() {
    //     var tablePaneElement;

    //     beforeEach(function() {
    //         var thead = '<thead><tr><th class="col-sticky"></th><th></th><th class="col-sticky col-sticky-right"></th></tr></thead>',
    //             tbody = '<tbody><tr ng-repeat="item in items"><td></td><td></td><td></td></tr></tbody>',
    //             tfoot = '<tfoot><tr><td class="col-sticky"></td><td></td><td class="col-sticky col-sticky-right"></td></tr></tfoot>',
    //             markup = '<div class="openlmis-table-pane"><table>' + thead + tbody + tfoot + '</table></div>';

    //         tablePaneElement = $compile(markup)(scope);
    //     });

    //     it('to all thead and tfoot elements', function() {
    //         expect(tablePaneElement.find('thead [openlmis-table-sticky-cell]').length).toBe(3);
    //         expect(tablePaneElement.find('tfoot [openlmis-table-sticky-cell]').length).toBe(3);
    //     });

    //     it('and openlmis-sticky-top to all thead elements', function() {
    //         expect(tablePaneElement.find('thead [openlmis-sticky-top]').length).toBe(3);
    //     });

    //     it('and openlmis-sticky-bottom to all tfoot elements', function() {
    //         expect(tablePaneElement.find('tfoot [openlmis-sticky-bottom]').length).toBe(3);
    //     });

    //     it('and openlmis-sticky-column to all elements that had .col-sticky class', function() {
    //         expect(tablePaneElement.find('[openlmis-sticky-column]').length).toBe(4);
    //         expect(tablePaneElement.find('.col-sticky').length).toBe(0);
    //     });

    //     it('and openlmis-sticky-column-right to all elements that had .col-sticky class', function() {
    //         expect(tablePaneElement.find('[openlmis-sticky-column-right]').length).toBe(2);
    //         expect(tablePaneElement.find('.col-sticky-right').length).toBe(0);
    //     });

    // });

    describe('md-virtual-repeat-container', function() {
        var tablePaneElement;

        beforeEach(function() {
            tablePaneElement = compileTablePane();
        });

        afterEach(function() {
            tablePaneElement.remove();
        });

        it('changes ng-repeat to md-virtual-repeat', function() {
            var text = tablePaneElement.html();

            expect(text.indexOf('ng-repeat')).toBe(-1);
            expect(text.indexOf('md-virtual-repeat')).not.toBe(-1);
        });

        it('adds md-virtual-repeat-container around the table element', function() {
            var table = tablePaneElement.find('table');
            expect(table.parents('.md-virtual-repeat-container').length).toBe(1);
        });

        it('adds md-virtual-repeat-scroller', function() {
            expect(tablePaneElement.find('.md-virtual-repeat-scroller').length).toBe(1);
        });
    });

    describe('watches scroll', function() {
        var scroller, tablePaneElement;

        beforeEach(function() {
            spyOn(_,'throttle').andCallFake(function(fn, duration) {
                return function(e) { fn(e); };
            });
        });

        beforeEach(function() {
            tablePaneElement = compileTablePane();
            scroller = tablePaneElement.find('.md-virtual-repeat-scroller');
        });

        afterEach(function() {
            tablePaneElement.remove();
        });

        it('is throttled', function() {
            scroller.trigger('scroll');
            expect(_.throttle).toHaveBeenCalled();
        });

        it('updates viewport position', function() {
            var tablePaneCtrl = tablePaneElement.controller('openlmisTablePane');
            spyOn(tablePaneCtrl, 'updateViewportPosition');

            scroller.trigger('scroll');

            expect(tablePaneCtrl.updateViewportPosition).toHaveBeenCalled();
        });
    });

    // describe('watches resize', function() {

    //     it('debounces resize events', function() {

    //     });

    //     it('updates viewport size', function() {

    //     });

    //     it('updates table size', function() {

    //     });

    //     it('updates viewport padding from sticky columns', function() {

    //     });
    // });

});