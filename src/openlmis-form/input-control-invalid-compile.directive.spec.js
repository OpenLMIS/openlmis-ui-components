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

    beforeEach(function() {
        module('openlmis-form');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.scope = this.$rootScope.$new();

        this.parent = this.$compile('<div input-control></div>')(this.scope);
        this.parentController = this.parent.controller('openlmisInvalid');
        spyOn(this.parentController, 'registerController').and.callThrough();

        this.child = angular.element('<button openlmis-invalid />').appendTo(this.parent);
        this.$compile(this.child)(this.scope);

        this.childController = this.child.controller('openlmisInvalid');
        spyOn(this.childController, 'show').and.callThrough();
        spyOn(this.childController, 'hide').and.callThrough();

        this.scope.$apply();
    });

    it('adds openlmis-invalid directive to input-control', function() {
        var scope = this.$rootScope.$new(),
            html = '<div input-control></div>',
            element = this.$compile(html)(scope);

        expect(element.attr('openlmis-invalid')).not.toBeUndefined();
        expect(element.controller('openlmisInvalid')).not.toBeUndefined();
    });

});
