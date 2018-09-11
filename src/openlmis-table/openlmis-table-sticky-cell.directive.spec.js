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
    var scope, $compile, tableElement;

    beforeEach(module('openlmis-table'));

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    it('will throw an error if not a descendant of OpenlmisTablePaneController', inject(function($compile) {
        function compile() {
            var markup = '<td openlmis-table-sticky-cell>Something</td>';
            $compile(markup)(scope);
        }

        expect(compile).toThrow();
    }));

    describe('interacts with OpenlmisTablePaneController', function() {
        var tablePaneCtrl, element;

        beforeEach(inject(function($compile) {
            // NOTE: Compiling openlmis-table-pane and openlmis-table-sticky-cell seperately
            //       so that spies are registered correctly.

            var markup = '<div class="openlmis-table-pane"><table><tr></tr></table></div>',
                tablePane = $compile(markup)(scope);

            tablePaneCtrl = tablePane.controller('openlmisTablePane');
            spyOn(tablePaneCtrl, 'registerStickyCell').andCallThrough();
            spyOn(tablePaneCtrl, 'unregisterStickyCell').andCallThrough();

            element = angular.element('<td openlmis-table-sticky-cell></td>');
            tablePane.find('tr').append(element);
            $compile(element[0])(scope);

            scope.$apply();
        }));

        it('will register element controller with OpenlmisTablePaneController', function() {
            expect(tablePaneCtrl.registerStickyCell).toHaveBeenCalled();
        });

        it('will unregister element controller with OpenlmisTablePaneController when $destroyed', function() {
            scope.$emit('$destroy');
            scope.$apply();

            expect(tablePaneCtrl.unregisterStickyCell).toHaveBeenCalled();
        });
    });

    describe('sets up cell controller', function() {
        var $compile, stickyCellCtrl, tableElement;

        beforeEach(inject(function(openlmisTableStickyCellDirective) {
            stickyCellCtrl = jasmine.createSpyObj('stickyCellCtrl', ['setup', 'updatePosition']);
            stickyCellCtrl.updatePosition.andReturn({
                top: 0,
                left: 0
            });

            openlmisTableStickyCellDirective[0].controller = function() {
                return stickyCellCtrl;
            };
        }));

        beforeEach(inject(function($injector) {
            $compile = $injector.get('$compile');
            tableElement = angular.element(
                '<div class="openlmis-table-pane"><table><tr><td openlmis-table-sticky-cell></td></tr></table></div>'
            );
        }));

        it('sticks left if has attribute openlmis-sticky-column', function() {
            tableElement.find('[openlmis-table-sticky-cell]').attr('openlmis-sticky-column', '');
            $compile(tableElement)(scope);

            expect(stickyCellCtrl.setup.mostRecentCall.args[0].stickLeft).toBe(true);
        });

        it('sticks right if has attribute openlmis-sticky-column and openlmis-stick-column-right', function() {
            tableElement.find('[openlmis-table-sticky-cell]')
                .attr('openlmis-sticky-column', '')
                .attr('openlmis-sticky-column-right', '');

            $compile(tableElement)(scope);

            expect(stickyCellCtrl.setup.mostRecentCall.args[0].stickLeft).toBe(false);
            expect(stickyCellCtrl.setup.mostRecentCall.args[0].stickRight).toBe(true);
        });

        it('sticks top if has attribute openlmis-sticky-top', function() {
            tableElement.find('[openlmis-table-sticky-cell]').attr('openlmis-sticky-top', '');
            $compile(tableElement)(scope);

            expect(stickyCellCtrl.setup.mostRecentCall.args[0].stickTop).toBe(true);
        });

        it('sticks bottom if has attribute openlmis-sticky-bottom', function() {
            tableElement.find('[openlmis-table-sticky-cell]').attr('openlmis-sticky-bottom', '');
            $compile(tableElement)(scope);

            expect(stickyCellCtrl.setup.mostRecentCall.args[0].stickBottom).toBe(true);
        });
    });

    describe('position', function() {
        var $window, stickyCellCtrl, cell, position;

        beforeEach(inject(function(openlmisTableStickyCellDirective) {
            position = {
                top: 0,
                left: 0
            };

            stickyCellCtrl = jasmine.createSpyObj('stickyCellCtrl', ['setup', 'updatePosition']);
            stickyCellCtrl.updatePosition.andReturn(position);

            openlmisTableStickyCellDirective[0].controller = function() {
                return stickyCellCtrl;
            };
        }));

        beforeEach(inject(function($injector) {
            $window = $injector.get('$window');
            $window.requestAnimationFrame = jasmine.createSpy('requestAnimationFrame');
            $window.requestAnimationFrame.andCallFake(function(fn) {
                fn();
            });

            $window.cancelAnimationFrame = jasmine.createSpy('cancelAnimationFrame');
        }));

        beforeEach(inject(function($injector) {
            $compile = $injector.get('$compile');
            tableElement = angular.element(
                '<div class="openlmis-table-pane"><table><tr><td openlmis-table-sticky-cell></td></tr></table></div>'
            );
            var compiled = $compile(tableElement)(scope);

            cell = compiled.find('[openlmis-table-sticky-cell]');
        }));

        it('is updated on the transform property', function() {
            position.top = 100;
            position.left = 70;

            stickyCellCtrl.updatePosition();

            expect(cell[0].style.transform).toBe('translate3d(70px, 100px, 0px)');
        });

        it('is not updated when the position is the same as the last position', function() {
            var originalAnimationFrames = $window.requestAnimationFrame.calls.length;
            position.top = 100;

            stickyCellCtrl.updatePosition();
            expect($window.requestAnimationFrame.calls.length).toBe(originalAnimationFrames + 1);

            stickyCellCtrl.updatePosition();
            expect($window.requestAnimationFrame.calls.length).toBe(originalAnimationFrames + 1);

            position.top = 101;

            stickyCellCtrl.updatePosition();
            expect($window.requestAnimationFrame.calls.length).toBe(originalAnimationFrames + 2);
        });

        it('will cancel pending animationFrame if position is updated', function() {
            $window.requestAnimationFrame.andCallFake(function() {
                // NOTE: Not calling function, so all animation frames will be "pending"
                return 'animationFrameId';
            });

            position.top = 100;
            stickyCellCtrl.updatePosition();

            expect($window.requestAnimationFrame).toHaveBeenCalled();

            position.top = 200;
            stickyCellCtrl.updatePosition();

            expect($window.cancelAnimationFrame).toHaveBeenCalled();
        });
    });

});