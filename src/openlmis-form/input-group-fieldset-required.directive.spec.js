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

describe('Input Control Fieldset', function() {

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.scope = this.$rootScope.$new();

        var markup = '<fieldset input-control><legend></legend><input required /></fieldset>';
        this.fieldset = this.$compile(markup)(this.scope);

        this.scope.$apply();
    });

    it('applies is-required class to legend if one or more elements are required', function() {
        var legend = this.fieldset.find('legend');

        // original mark-up sets the input as required
        expect(legend.hasClass('is-required')).toBe(true);

        this.fieldset.find('[required]').removeAttr('required');
        this.scope.$apply();

        expect(legend.hasClass('is-required')).toBe(false);
    });

});