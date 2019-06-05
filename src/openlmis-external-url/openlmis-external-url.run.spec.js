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

describe('openlmis-external-url', function() {

    beforeEach(function() {
        module('openlmis-external-url');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.loadingModalService = $injector.get('loadingModalService');
            this.$window = $injector.get('$window');
        });

        this.state = {
            name: 'myState',
            externalUrl: 'http://my.url'
        };

        this.stateWithoutUrl = {
            name: 'myState'
        };

        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
        spyOn(this.$window, 'open');
    });

    describe('state change', function() {

        it('should close loading modal when external url provided', function() {
            this.$rootScope.$broadcast('$stateChangeStart', this.state);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should open url when external url provided', function() {
            this.$rootScope.$broadcast('$stateChangeStart', this.state);
            this.$rootScope.$apply();

            expect(this.$window.open).toHaveBeenCalled();
        });

        it('should not close loading modal when external url not provided', function() {
            this.$rootScope.$broadcast('$stateChangeStart', this.stateWithoutUrl);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).not.toHaveBeenCalled();
        });

        it('should not open url when external url not provided', function() {
            this.$rootScope.$broadcast('$stateChangeStart', this.stateWithoutUrl);
            this.$rootScope.$apply();

            expect(this.$window.open).not.toHaveBeenCalled();
        });
    });
});