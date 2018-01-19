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

describe('Datepicker directive', function() {

    'use strict';

    var $compile, scope, element, filter, openlmisDateFilter;

    beforeEach(function() {

        filter = jasmine.createSpy('$filter');
        openlmisDateFilter = jasmine.createSpy('openlmisDateFilter');
        filter.andReturn(openlmisDateFilter);

        module('openlmis-templates');
        module('openlmis-form', function($provide) {
            $provide.value('openlmisDateFilter', filter);
        });

        inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_.$new();
        });

        scope.endDate = new Date('2017-12-31T23:00:00.000Z');
        scope.startDate = new Date('2017-01-31T23:00:00.000Z');
        scope.isDisabled = true;
        var html = '<openlmis-datepicker input-id="startDate" value="startDate" max-date="endDate" disabled="isDisabled"></openlmis-datepicker>';
        element = $compile(html)(scope);
        scope.$apply();
    });

    it('should apply template', function () {
        expect(element.html()).not.toEqual('');
    });

    it('should have datepicker element', function() {
        var elem = angular.element(element);
        expect(elem.find('input').datepicker).toBeDefined();
    });

    it('should add disabled parameter', function() {
        var elem = angular.element(element);
        expect(elem.find('input').attr('disabled')).toEqual('disabled');
    });
});
