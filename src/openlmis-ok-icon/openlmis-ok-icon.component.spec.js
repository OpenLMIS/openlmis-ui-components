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

describe('openlmis-ok-icon component', function() {

    beforeEach(function() {
        module('openlmis-ok-icon');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.$scope = this.$rootScope.$new();
        this.iconOkClass = '.icon-ok';
        this.markup = '<openlmis-ok-icon show="show"></openlmis-ok-icon>';

        this.compileElement = function() {
            this.element = this.$compile(this.markup)(this.$scope);
            this.$rootScope.$apply();
        };
    });

    it('should produce icon if show is set', function() {
        this.$scope.show = true;

        this.compileElement();

        expect(this.element.find(this.iconOkClass).length).toBe(1);
    });

    it('should not produce icon if show is not set', function() {
        this.$scope.show = false;

        this.compileElement();

        expect(this.element.find(this.iconOkClass).length).toBe(0);
    });

    afterEach(function() {
        this.element.remove();
        this.element = undefined;
    });

});