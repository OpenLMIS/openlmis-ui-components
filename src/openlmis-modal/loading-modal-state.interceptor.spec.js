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

describe('loadingModalStateInterceptor', function() {

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.loadingModalService = $injector.get('loadingModalService');
        });

        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
    });

    it('should open loading modal when user is going to other page', function() {
        this.$rootScope.$emit('$stateChangeStart');

        expect(this.loadingModalService.open).toHaveBeenCalled();
    });

    it('should close loading modal after user entered the new page', function() {
        this.$rootScope.$emit('$stateChangeSuccess');

        expect(this.loadingModalService.close).toHaveBeenCalled();
    });

    it('should close loading modal if page could not be loaded', function() {
        this.$rootScope.$emit('$stateChangeError');

        expect(this.loadingModalService.close).toHaveBeenCalled();
    });

    it('should close loading modal if page is not found', function() {
       this.$rootScope.$emit('$stateNotFound');

       expect(this.loadingModalService.close).toHaveBeenCalled();
    });

    it('should close loading modal if user was prevented from going to other page', function() {
        this.$rootScope.$emit('$stateChangePrevented');

        expect(this.loadingModalService.close).toHaveBeenCalled();
    });

});