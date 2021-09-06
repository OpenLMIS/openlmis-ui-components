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

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
        });

        //This piece disables default throttle behavior so scroll watches can be tested synchronously
        spyOn(_, 'throttle').and.callFake(function(fn) {
            return function() {
                return fn.apply(this, arguments);
            };
        });

        var markup =
            '<div class="openlmis-table-pane">' +
                '<table>' +
                    '<tbody>' +
                        '<tr ng-repeat="item in items">' +
                            '<td></td>' +
                            '<td></td>' +
                            '<td></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
            '</div>';

        this.$scope = this.$rootScope.$new();
        this.tablePaneElement = this.$compile(markup)(this.$scope);
        this.tablePaneCtrl = this.tablePaneElement.controller('openlmisTablePane');
        this.scroller = this.tablePaneElement.find('.md-virtual-repeat-scroller');
        this.tablePaneCtrl = this.tablePaneElement.controller('openlmisTablePane');

        spyOn(this.tablePaneCtrl, 'updateViewportPosition');
    });

    describe('md-virtual-repeat-container', function() {

        it('changes ng-repeat to md-virtual-repeat', function() {
            var text = this.tablePaneElement.html();

            expect(text.indexOf('ng-repeat')).toBe(-1);
            expect(text.indexOf('md-virtual-repeat')).not.toBe(-1);
        });

        it('adds md-virtual-repeat-container around the table element', function() {
            var table = this.tablePaneElement.find('table');

            expect(table.parents('.md-virtual-repeat-container').length).toBe(1);
        });

        it('adds md-virtual-repeat-scroller', function() {
            expect(this.tablePaneElement.find('.md-virtual-repeat-scroller').length).toBe(1);
        });
    });

    describe('watches scroll', function() {

        it('is throttled', function() {
            expect(_.throttle).toHaveBeenCalled();
        });

        it('updates viewport position', function() {
            this.scroller.trigger('scroll');

            expect(this.tablePaneCtrl.updateViewportPosition).toHaveBeenCalled();
        });
    });

    describe('applies openlmis-table-sticky-cell', function() {

        beforeEach(function() {
            var thead =
                '<thead>' +
                    '<tr>' +
                        '<th class="col-sticky"></th>' +
                        '<th></th><th class="col-sticky col-sticky-right"></th>' +
                    '</tr>' +
                '</thead>',
                tbody =
                '<tbody>' +
                    '<tr ng-repeat="item in items">' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td></td>' +
                    '</tr>' +
                '</tbody>',
                tfoot =
                '<tfoot>' +
                    '<tr>' +
                        '<td class="col-sticky"></td>' +
                        '<td></td>' +
                        '<td class="col-sticky col-sticky-right"></td>' +
                    '</tr>' +
                '</tfoot>',
                markupStickyElements =
                '<div class="openlmis-table-pane">' +
                    '<table>' +
                        thead +
                        tbody +
                        tfoot +
                    '</table>' +
                '</div>';

            this.tablePaneElement = this.$compile(markupStickyElements)(this.$scope);
        });

        it('to all thead and tfoot elements', function() {
            expect(this.tablePaneElement.find('thead [openlmis-table-sticky-cell]').length).toBe(3);
            expect(this.tablePaneElement.find('tfoot [openlmis-table-sticky-cell]').length).toBe(3);
        });

        it('and openlmis-sticky-top to all thead elements', function() {
            expect(this.tablePaneElement.find('thead [openlmis-sticky-top]').length).toBe(3);
        });

        it('and openlmis-sticky-bottom to all tfoot elements', function() {
            expect(this.tablePaneElement.find('tfoot [openlmis-sticky-bottom]').length).toBe(3);
        });

        it('and openlmis-sticky-column to all elements that had .col-sticky class', function() {
            expect(this.tablePaneElement.find('[openlmis-sticky-column]').length).toBe(4);
            expect(this.tablePaneElement.find('.col-sticky').length).toBe(0);
        });

        it('and openlmis-sticky-column-right to all elements that had .col-sticky class', function() {
            expect(this.tablePaneElement.find('[openlmis-sticky-column-right]').length).toBe(2);
            expect(this.tablePaneElement.find('.col-sticky-right').length).toBe(0);
        });

    });

    afterEach(function() {
        this.tablePaneElement.remove();
    });

});
