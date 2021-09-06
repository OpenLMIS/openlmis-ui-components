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

describe('stateChangeErrorInterceptor', function() {

    beforeEach(function() {
        module('openlmis-state-change-error');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.alertService = $injector.get('alertService');
        });

        this.error = undefined;

        spyOn(console, 'error').and.returnValue();
        spyOn(this.alertService, 'error').and.returnValue();

        this.emitStateChangeErrorEvent = function() {
            this.$rootScope.$emit(
                '$stateChangeError',
                undefined,
                undefined,
                undefined,
                undefined,
                this.error
            );
        };
    });

    it('should print error to console', function() {
        this.error = 'Some state change error';

        this.emitStateChangeErrorEvent();

        expect(console.error).toHaveBeenCalledWith(this.error);
    });

    it('should open modal', function() {
        this.error = 'Some state change error';

        this.emitStateChangeErrorEvent();

        expect(this.alertService.error).toHaveBeenCalledWith(
            'openlmisStateChangeError.internalApplicationError.title',
            'openlmisStateChangeError.internalApplicationError.message'
        );
    });

    it('should not open modal if error is server response', function() {
        this.error = {
            status: undefined,
            statusText: undefined,
            data: undefined
        };

        this.emitStateChangeErrorEvent();

        expect(this.alertService.error).not.toHaveBeenCalled();
    });

    it('should not print error to console if error is server response', function() {
        this.error = {
            status: undefined,
            statusText: undefined,
            data: undefined
        };

        this.emitStateChangeErrorEvent();

        expect(console.error).not.toHaveBeenCalled();
    });

    it('should open modal if error is undefined', function() {
        this.error = undefined;

        this.emitStateChangeErrorEvent();

        expect(this.alertService.error).toHaveBeenCalled();
    });

});
