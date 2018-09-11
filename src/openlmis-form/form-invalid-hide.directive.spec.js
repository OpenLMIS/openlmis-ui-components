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

describe('Form Invalid Hide Directive', function() {
    var form, scope;

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($compile, $rootScope) {
        var markup = '<form name="exampleForm"><input ng-model="example" required /></form>';

        scope = $rootScope.$new();

        form = $compile(markup)(scope);
        angular.element('body').append(form);

        scope.$apply();
    }));

    it('supresses error messages when the form is not submitted', function() {
        // NOTE: form is unsubmitted
        expect(form.find('.is-invalid').length).toBe(0);
        expect(form.find('.openlmis-invalid').length).toBe(0);

        scope.exampleForm.$setSubmitted();
        scope.$apply();

        expect(form.find('.is-invalid').length).not.toBe(0);
        expect(form.find('.openlmis-invalid').length).not.toBe(0);
    });

});