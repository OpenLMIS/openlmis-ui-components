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

describe('offlineInterceptor', function() {

    beforeEach(function() {
        var context = this;
        // This should be added as module dependency after 3.6 release.
        module('openlmis-modal');
        module('openlmis-offline', function($httpProvider) {
            context.interceptors = $httpProvider.interceptors;
        });

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.offlineService = $injector.get('offlineService');
            this.offlineInterceptor = $injector.get('offlineInterceptor');
            this.alertService = $injector.get('alertService');
        });

        this.deferred = this.$q.defer();
        this.config = {
            url: 'some.url'
        };

        spyOn(this.alertService, 'error').andReturn(this.deferred.promise);
        spyOn(this.offlineService, 'isOffline').andReturn(true);

        this.returnedConfig = this.offlineInterceptor.request(this.config);
    });

    describe('request', function() {

        it('should be registered', function() {
            expect(this.interceptors.indexOf('offlineInterceptor')).toBeGreaterThan(-1);
        });

        it('should check if is offline', function() {
            expect(this.offlineService.isOffline).toHaveBeenCalled();
        });

        it('should show alert modal', function() {
            expect(this.alertService.error).toHaveBeenCalledWith('openlmisOffline.actionNotAllowedOffline');
        });

        it('should not show second alert modal when first is not closed', function() {
            this.offlineInterceptor.request(this.config);

            expect(this.alertService.error.callCount).toBe(1);
        });

        it('should show second alert modal when first is not closed', function() {
            this.deferred.resolve();
            this.$rootScope.$apply();
            this.offlineInterceptor.request(this.config);

            expect(this.alertService.error.callCount).toBe(2);
        });

        it('should resolve cancel promise', function() {
            var isResolved = false;
            this.returnedConfig.timeout.then(function() {
                isResolved = true;
            });
            this.$rootScope.$apply();

            expect(isResolved).toBe(true);
        });

        it('should pass through .html urls', function() {

            var isResolved = false;
            this.config = {
                url: 'some.html'
            };

            this.returnedConfig = this.offlineInterceptor.request(this.config);

            this.returnedConfig.timeout.then(function() {
                isResolved = true;
            });
            this.$rootScope.$apply();

            expect(isResolved).toBe(false);
        });
    });
});
