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

describe('Button directives', function() {
    var $compile,
        $rootScope;

    beforeEach(function() {

        module('openlmis-analytics');

        inject(function(_$compile_, _$rootScope_, _analyticsService_, _$location_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            analyticsService = _analyticsService_;
            $location = _$location_;

            spyOn(analyticsService, 'track');
        });
    });

    it('will track click events on a button elements with the untranslated text', function() {
        var element = $compile("<button>{{'label.name' | message}}</button>")($rootScope.$new());

        $rootScope.$apply();
        angular.element(element[0]).click();

        expect(analyticsService.track.mostRecentCall.args[0]).toBe('send');
        expect(analyticsService.track.mostRecentCall.args[2]['eventCategory']).toBe('Button Click');
        expect(analyticsService.track.mostRecentCall.args[2]['eventAction']).toBe('label.name');
    });

});