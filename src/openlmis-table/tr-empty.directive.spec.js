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

describe('tr empty row directive', function() {

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.scope = this.$rootScope.$new();

        this.compileElement = function(markup) {
            var element = this.$compile(markup)(this.scope);
            this.$rootScope.$digest();
            return element;
        };
    });

    it('should do nothing if no attributes are set', function() {
        var markup =
            '<tbody>' +
                '<tr></tr>' +
            '</tbody>';

        var element = this.compileElement(markup);

        expect(element.find('tr').length).toEqual(1);
    });

    it('should do nothing if empty-row attribute is false', function() {
        var markup =
            '<tbody>' +
                '<tr empty-row="false"></tr>' +
            '</tbody>';

        var element = this.compileElement(markup);

        expect(element.find('tr').length).toEqual(1);
    });

    it('should add extra row if empty-row is set to true', function() {
        var markup =
            '<tbody>' +
                '<tr empty-row="true"></tr>' +
            '</tbody>';

        var element = this.compileElement(markup);

        expect(element.find('tr').length).toEqual(2);
    });

    it('should set the message', function() {
        var markup =
            '<tbody>' +
                '<tr empty-row="true" empty-row-message="Some message"></tr>' +
            '</tbody>';

        var element = this.compileElement(markup);

        expect(element.find('td.openlmis-empty-row').html()).toEqual('Some message');
    });

    it('should set colspan', function() {
        var markup =
            '<tbody>' +
                '<tr empty-row="true" empty-row-col-span="3"></tr>' +
            '</tbody>';

        var element = this.compileElement(markup);

        expect(element.find('td.openlmis-empty-row').attr('colspan')).toEqual('3');
    });

    it('should not work with non-tr elements', function() {
        var markup = '<tbody empty-row="true"></tbody>';

        var element = this.compileElement(markup);

        expect(element.find('td.openlmis-empty-row').length).toEqual(0);
    });

});