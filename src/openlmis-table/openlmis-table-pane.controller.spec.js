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

describe('openlmis-table.controller:OpenlmisTablePaneController', function() {

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
        });

        this.vm = this.$controller('OpenlmisTablePaneController');

        this.createTableCellControllerMock = function() {
            return jasmine.createSpyObj('TableCellController', ['updatePosition']);
        };
    });

    it('will register a sticky table cell controller', function() {
        var cell1 = this.createTableCellControllerMock(),
            cell2 = this.createTableCellControllerMock();

        this.vm.registerStickyCell(cell1);
        this.vm.registerStickyCell(cell2);

        this.vm.updateTableSize(100, 100);

        expect(cell1.updatePosition).toHaveBeenCalled();
        expect(cell2.updatePosition).toHaveBeenCalled();
    });

    it('will unregister a sticky table cell controller', function() {
        var cell1 = this.createTableCellControllerMock(),
            cell2 = this.createTableCellControllerMock();

        this.vm.registerStickyCell(cell1);
        this.vm.registerStickyCell(cell2);

        this.vm.unregisterStickyCell(cell1);

        this.vm.updateTableSize(100, 100);

        expect(cell1.updatePosition).not.toHaveBeenCalled();
        expect(cell2.updatePosition).toHaveBeenCalled();
    });

    it('will update the viewport position and update registered sticky cells', function() {
        var cell = this.createTableCellControllerMock();
        this.vm.registerStickyCell(cell);

        this.vm.updateViewportPosition(100, 42);

        var viewportRectangle = cell.updatePosition.mostRecentCall.args[0];

        expect(viewportRectangle.top).toBe(100);
        expect(viewportRectangle.left).toBe(42);
    });

    it('will update the viewport size and update registered sticky cells', function() {
        var cell = this.createTableCellControllerMock();
        this.vm.registerStickyCell(cell);

        this.vm.updateViewportSize(1000, 700);

        var viewportRectangle = cell.updatePosition.mostRecentCall.args[0];

        expect(viewportRectangle.width).toBe(1000);
        expect(viewportRectangle.height).toBe(700);
    });

    it('will update the table size and update registered sticky cells', function() {
        var cell = this.createTableCellControllerMock();
        this.vm.registerStickyCell(cell);

        this.vm.updateTableSize(800, 1200);

        var tableRectangle = cell.updatePosition.mostRecentCall.args[1];

        expect(tableRectangle.width).toBe(800);
        expect(tableRectangle.height).toBe(1200);
    });
});