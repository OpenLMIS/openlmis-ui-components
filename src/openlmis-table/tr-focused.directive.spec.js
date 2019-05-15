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

describe('TR Focused Directive', function() {

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        var markup =
            '<table>' +
                '<tr>' +
                    '<td>' +
                        '<input  />' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>' +
                        '<input />' +
                    '</td>' +
                '</tr>' +
            '</table>';

        this.$scope = this.$rootScope.$new();
        this.table = this.$compile(markup)(this.$scope);
        angular.element('body').append(this.table);
        this.$rootScope.$apply();
    });

    it('Sets trCtrl focused to true until focused moved out of row', function() {
        var tr = this.table.find('tr:first');

        expect(tr.hasClass('is-focused')).toBe(false);

        this.table.find('input:first').focus();
        this.$rootScope.$apply();

        expect(tr.hasClass('is-focused')).toBe(true);

        this.table.find('input:last').focus();
        this.$rootScope.$apply();

        expect(tr.hasClass('is-focused')).toBe(false);
    });

});
