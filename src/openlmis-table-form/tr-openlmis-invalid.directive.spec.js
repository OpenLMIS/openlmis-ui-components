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

ddescribe('OpenLMIS Invalid TR', function() {
    'use strict';

    var $compile, scope, $rootScope;

    beforeEach(module('openlmis-table-form'));

    beforeEach(inject(function($injector) {        
        $compile = $injector.get('$compile');
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();
    }));

    it('hides error messages until focus moves outside TR', function(){
        var table = compileMarkup('<table><tr><td openlmis-invalid="force invalid"><input  /></td></tr><tr><td openlmis-invalid="force invalid"><input /></td></tr></table>');

        expect(table.find('tr.is-invalid').length).toBe(0);

        table.find('input:first').focus();
        scope.$apply();

        expect(table.find('tr.is-invalid').length).toBe(0);

        table.find('input:last').focus();
        scope.$apply();

        // NOTE: Only 1 of the 2 possible errors are showing, which is correct.
        expect(table.find('tr.is-invalid').length).toBe(1);
    });

    it('shows error messages when openlmis-form-submit is fired', function(){
        var table = compileMarkup('<table><tr><td openlmis-invalid="force invalid"><input  /></td></tr><tr><td openlmis-invalid="force invalid">Example</td></tr></table>');

        expect(table.find('tr.is-invalid').length).toBe(0);

        scope.$broadcast('openlmis-form-submit');
        scope.$apply();

        expect(table.find('tr.is-invalid').length).toBe(2);    
    });

    it('should emit event when showing errors', function() {
        var table = compileMarkup('<table><tr><td openlmis-invalid="force invalid"><input  /></td></tr><tr><td openlmis-invalid="force invalid"><input /></td></tr></table>');

        var result;
        $rootScope.$on('openlmis.displayRowErrors', function() {
            result = true;
        });

        expect(table.find('tr.is-invalid').length).toBe(0);

        table.find('input:first').focus();
        scope.$apply();

        expect(table.find('tr.is-invalid').length).toBe(0);

        table.find('input:last').focus();
        scope.$apply();

        expect(result).toBe(true);
    });


    function compileMarkup(markup) {
        var element = $compile(markup)(scope);

        angular.element('body').append(element);
        scope.$apply();

        return element;
    }

});
