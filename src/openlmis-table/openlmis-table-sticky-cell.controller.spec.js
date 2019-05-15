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

describe('openlmis-table.controller:OpenlmisTableStickyCellController', function() {

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
        });

        this.viewport = {
            top: 0,
            left: 0,
            width: 1000,
            height: 500
        };

        this.table = {
            width: 1500,
            height: 2000
        };

        this.vm = this.$controller('OpenlmisTableStickyCellController');
    });

    describe('setup', function() {
        it('can setup isStickyTop', function() {
            this.vm.setup({
                stickTop: true
            });
            this.viewport.top = 123;

            var position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(123);
        });

        it('can setup isStickyBottom', function() {
            this.vm.setup({
                stickBottom: true
            });

            var position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(-1500);
        });

        it('can setup isStickyLeft', function() {
            this.vm.setup({
                stickLeft: true
            });
            this.viewport.left = 123;

            var position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(123);
        });

        it('can setup isStickyRight', function() {
            this.vm.setup({
                stickRight: true
            });

            var position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(-500);
        });
    });

    describe('updatePosition', function() {
        it('will always stick top to viewport top', function() {
            var position;
            this.vm.setup({
                stickTop: true
            });

            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(0);

            this.viewport.top = 500;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(500);

            this.viewport.top = 9000;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(9000);
        });

        it('will always stick left to viewport left', function() {
            var position;
            this.vm.setup({
                stickLeft: true
            });

            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(0);

            this.viewport.left = 700;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(700);

            this.viewport.left = 15000;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(15000);
        });

        it('will always stick right to visible edge', function() {
            var position;
            this.vm.setup({
                stickRight: true
            });

            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(-500);

            this.viewport.left = 700;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(200);

            this.viewport.width = 500;
            this.viewport.left = 1000;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(0);
        });

        it('will not stick right if viewport is wider than table', function() {
            var position;
            this.vm.setup({
                stickRight: true
            });

            this.viewport.width = 1500;
            this.table.width = 1000;

            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.left).toBe(0);
        });

        it('will always stick bottom to visible edge', function() {
            var position;
            this.vm.setup({
                stickBottom: true
            });

            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(-1500);

            this.viewport.top = 700;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(-800);

            this.viewport.height = 1000;
            this.viewport.top = 1000;
            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(0);
        });

        it('will not stick bottom if viewport is taller than table', function() {
            var position;
            this.vm.setup({
                stickBottom: true
            });

            this.viewport.height = 1500;
            this.table.height = 1000;

            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(0);
        });

        it('will return a value of zero if viewport or table misconfigured', function() {
            var position;
            this.vm.setup({
                stickRight: true,
                stickBottom: true
            });

            this.viewport.height = undefined;
            this.table.width = undefined;

            position = this.vm.updatePosition(this.viewport, this.table);

            expect(position.top).toBe(0);
            expect(position.left).toBe(0);
        });
    });

});