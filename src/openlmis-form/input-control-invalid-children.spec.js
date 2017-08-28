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

describe('Input Control OpenlmisInvalid Child Directive', function(){
    var parent, parentController, child, childController, scope;

    
    beforeEach(module('openlmis-form'));

    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();

        parent = $compile('<div input-control></div>')(scope);
        parentController = parent.controller('openlmisInvalid');
        spyOn(parentController, 'registerController').andCallThrough();

        child = angular.element('<button openlmis-invalid />').appendTo(parent);
        $compile(child)(scope);

        childController = child.controller('openlmisInvalid');
        spyOn(childController, 'show').andCallThrough();
        spyOn(childController, 'hide').andCallThrough();

        scope.$apply();
    }));

    it('registers the child to the parentController', function() {
        expect(parentController.registerController).toHaveBeenCalled();
        expect(parentController.getChildren().length).toBe(1);
    });

    it('changing parent state will change child state', function(){
        var showCalls = childController.show.calls.length,
            hideCalls = childController.hide.calls.length;

        parentController.show();
        expect(childController.show.calls.length).toBe(showCalls + 1);

        parentController.hide();
        expect(childController.hide.calls.length).toBe(hideCalls + 1);
    });

});
