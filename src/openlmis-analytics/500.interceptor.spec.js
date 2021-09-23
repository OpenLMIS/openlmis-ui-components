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

describe('analytics500Interceptor', function() {

    beforeEach(function() {
        var context = this;
        module('openlmis-analytics', function($provide, $httpProvider) {
            context.interceptors = $httpProvider.interceptors;
        });

        inject(function(analytics500Interceptor, _analyticsService_) {
            this.provider = analytics500Interceptor;
            this.analyticsService = _analyticsService_;

            spyOn(this.analyticsService, 'track');
        });

        this.response = {};
    });

    it('should be registered', function() {
        expect(this.interceptors.indexOf('analytics500Interceptor')).toBeGreaterThan(-1);
    });

    it('should send event to Google Analytics on 5xx status', function() {
        this.response.status = 500;

        this.provider.responseError(this.response);

        expect(this.analyticsService.track).toHaveBeenCalled();
        expect(this.analyticsService.track.mostRecentCall.args[2]['eventCategory']).toBe('5xx Error');
    });

});
