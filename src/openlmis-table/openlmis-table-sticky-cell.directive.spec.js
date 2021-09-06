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

describe('openlmis-table.directive:OpenlmisTableStickyCell', function() {

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
            this.$window = $injector.get('$window');
            this.openlmisTableStickyCellDirective = $injector.get('openlmisTableStickyCellDirective');
        });

        this.scope = this.$rootScope.$new();
        this.position = {
            top: 0,
            left: 0
        };

        this.stickyCellCtrl = jasmine.createSpyObj('stickyCellCtrl', ['setup', 'updatePosition']);
        this.stickyCellCtrl.updatePosition.and.returnValue(this.position);

        spyOn(this.openlmisTableStickyCellDirective[0], 'controller').and.returnValue(this.stickyCellCtrl);
    });

    it('will throw an error if not a descendant of OpenlmisTablePaneController', function() {
        var $compile = this.$compile,
            scope = this.scope;

        expect(function() {
            var markup = '<td openlmis-table-sticky-cell>Something</td>';
            $compile(markup)(scope);
        }).toThrow();
    });

    describe('interacts with OpenlmisTablePaneController', function() {

        beforeEach(function() {
            // NOTE: Compiling openlmis-table-pane and openlmis-table-sticky-cell separately
            //       so that spies are registered correctly.
            var markup =
                '<div class="openlmis-table-pane">' +
                    '<table>' +
                        '<tr></tr>' +
                    '</table>' +
                '</div>';

            var tablePane = this.$compile(markup)(this.scope);

            this.tablePaneCtrl = tablePane.controller('openlmisTablePane');
            spyOn(this.tablePaneCtrl, 'registerStickyCell').and.callThrough();
            spyOn(this.tablePaneCtrl, 'unregisterStickyCell').and.callThrough();

            var cellMarkup = '<td openlmis-table-sticky-cell></td>',
                element = angular.element(cellMarkup);

            tablePane.find('tr').append(element);
            this.$compile(element)(this.scope);

            this.scope.$apply();
        });

        it('will register element controller with OpenlmisTablePaneController', function() {
            expect(this.tablePaneCtrl.registerStickyCell).toHaveBeenCalled();
        });

        it('will unregister element controller with OpenlmisTablePaneController when $destroyed', function() {
            this.scope.$emit('$destroy');
            this.scope.$apply();

            expect(this.tablePaneCtrl.unregisterStickyCell).toHaveBeenCalled();
        });
    });

    describe('sets up cell controller', function() {

        beforeEach(function() {
            var markup =
                '<div class="openlmis-table-pane">' +
                    '<table>' +
                        '<tr>' +
                            '<td openlmis-table-sticky-cell></td>' +
                        '</tr>' +
                    '</table>' +
                '</div>';

            this.tableElement = angular.element(markup);
        });

        it('sticks left if has attribute openlmis-sticky-column', function() {
            this.tableElement.find('[openlmis-table-sticky-cell]').attr('openlmis-sticky-column', '');
            this.$compile(this.tableElement)(this.scope);

            expect(this.stickyCellCtrl.setup.calls.mostRecent().args[0].stickLeft).toBe(true);
        });

        it('sticks right if has attribute openlmis-sticky-column and openlmis-stick-column-right', function() {
            this.tableElement.find('[openlmis-table-sticky-cell]')
                .attr('openlmis-sticky-column', '')
                .attr('openlmis-sticky-column-right', '');

            this.$compile(this.tableElement)(this.scope);

            expect(this.stickyCellCtrl.setup.calls.mostRecent().args[0].stickLeft).toBe(false);
            expect(this.stickyCellCtrl.setup.calls.mostRecent().args[0].stickRight).toBe(true);
        });

        it('sticks top if has attribute openlmis-sticky-top', function() {
            this.tableElement.find('[openlmis-table-sticky-cell]').attr('openlmis-sticky-top', '');
            this.$compile(this.tableElement)(this.scope);

            expect(this.stickyCellCtrl.setup.calls.mostRecent().args[0].stickTop).toBe(true);
        });

        it('sticks bottom if has attribute openlmis-sticky-bottom', function() {
            this.tableElement.find('[openlmis-table-sticky-cell]').attr('openlmis-sticky-bottom', '');
            this.$compile(this.tableElement)(this.scope);

            expect(this.stickyCellCtrl.setup.calls.mostRecent().args[0].stickBottom).toBe(true);
        });
    });

    describe('position', function() {

        beforeEach(function() {
            this.$window.requestAnimationFrame = jasmine.createSpy('requestAnimationFrame');
            this.$window.requestAnimationFrame.and.callFake(function(fn) {
                fn();
            });

            this.$window.cancelAnimationFrame = jasmine.createSpy('cancelAnimationFrame');

            var markup =
                '<div class="openlmis-table-pane">' +
                    '<table>' +
                        '<tr>' +
                            '<td openlmis-table-sticky-cell></td>' +
                        '</tr>' +
                    '</table>' +
                '</div>';

            var compiled = this.$compile(markup)(this.scope);

            this.cell = compiled.find('[openlmis-table-sticky-cell]');
        });

        it('is updated on the transform property', function() {
            this.position.top = 100;
            this.position.left = 70;

            this.stickyCellCtrl.updatePosition();

            expect(this.cell[0].style.transform).toBe('translate3d(70px, 100px, 0px)');
        });

        it('is not updated when the position is the same as the last position', function() {
            var originalAnimationFrames = this.$window.requestAnimationFrame.calls.count();
            this.position.top = 100;

            this.stickyCellCtrl.updatePosition();

            expect(this.$window.requestAnimationFrame.calls.count()).toBe(originalAnimationFrames + 1);

            this.stickyCellCtrl.updatePosition();

            expect(this.$window.requestAnimationFrame.calls.count()).toBe(originalAnimationFrames + 1);

            this.position.top = 101;

            this.stickyCellCtrl.updatePosition();

            expect(this.$window.requestAnimationFrame.calls.count()).toBe(originalAnimationFrames + 2);
        });

        it('will cancel pending animationFrame if position is updated', function() {
            this.$window.requestAnimationFrame.and.callFake(function() {
                // NOTE: Not calling function, so all animation frames will be "pending"
                return 'animationFrameId';
            });

            this.position.top = 100;
            this.stickyCellCtrl.updatePosition();

            expect(this.$window.requestAnimationFrame).toHaveBeenCalled();

            this.position.top = 200;
            this.stickyCellCtrl.updatePosition();

            expect(this.$window.cancelAnimationFrame).toHaveBeenCalled();
        });
    });

});
