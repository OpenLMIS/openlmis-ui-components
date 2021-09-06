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

describe('analyticsStateChangeInterceptor', function() {

    beforeEach(function() {
        module('openlmis-analytics');

        inject(function($injector) {
            this.analyticsService = $injector.get('analyticsService');
            this.$rootScope = $injector.get('$rootScope');
        });

        spyOn(this.analyticsService, 'track');
    });

    it('sends a page view event on $StateChangeSuccess', function() {
        this.$rootScope.$broadcast('$stateChangeSuccess');
        this.$rootScope.$apply();

        expect(this.analyticsService.track).toHaveBeenCalled();
        expect(this.analyticsService.track.calls.mostRecent().args[0]).toBe('send');
        expect(this.analyticsService.track.calls.mostRecent().args[1]).toBe('pageview');
    });

});
