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

describe('featureFlagService', function() {

    var featureFlagService;

    beforeEach(function() {
        module('openlmis-feature-flag');

        inject(function($injector) {
            featureFlagService = $injector.get('featureFlagService');
        });
    });

    describe('get', function() {

        it('should get flag value if set', function() {
            featureFlagService.set('new-flag', '', true);
            expect(featureFlagService.get('new-flag')).toBe(true);
        });

        it('should get undefined if flag is not set', function() {
            expect(featureFlagService.get('new-flag')).toBeUndefined();
        });
    });

    describe('set', function() {

        it('should set default flag value', function() {
            featureFlagService.set('new-flag', '', true);
            expect(featureFlagService.get('new-flag')).toBe(true);

            featureFlagService.set('other-flag', '${OTHER_FLAG}', false);
            expect(featureFlagService.get('other-flag')).toBe(false);
        });

        it('should set given flag', function() {
            featureFlagService.set('new-flag', 'false', true);
            expect(featureFlagService.get('new-flag')).toBe(false);

            featureFlagService.set('other-flag', 'true', false);
            expect(featureFlagService.get('other-flag')).toBe(true);
        });
    });

});