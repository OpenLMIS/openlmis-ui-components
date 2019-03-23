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

describe('Input-Control invalid compile directive', function() {
    var parent, parentController, child, childController, scope;

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();

        parent = $compile('<div input-control></div>')(scope);
        parentController = parent.controller('openlmisInvalid');
        spyOn(parentController, 'registerController').and.callThrough();

        child = angular.element('<button openlmis-invalid />').appendTo(parent);
        $compile(child)(scope);

        childController = child.controller('openlmisInvalid');
        spyOn(childController, 'show').and.callThrough();
        spyOn(childController, 'hide').and.callThrough();

        scope.$apply();
    }));

    it('adds openlmis-invalid directive to input-control', inject(function($rootScope, $compile) {
        var scope = $rootScope.$new(),
            html = '<div input-control></div>',
            element = $compile(html)(scope);

        expect(element.attr('openlmis-invalid')).not.toBeUndefined();
        expect(element.controller('openlmisInvalid')).not.toBeUndefined();
    }));

});
