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

describe('openlmisModalService', function() {

    var openlmisModalService, $rootScope;

    beforeEach(function() {
        module('openlmis-modal');

        inject(function($injector) {
            openlmisModalService = $injector.get('openlmisModalService');
            $rootScope = $injector.get('$rootScope');
        });

    });

    describe('modal', function() {

        //OLMIS-25434
        //This was causing the alert service to be unable to open one after another
        it('should reject promise when hiding modal', function() {
            var modal = openlmisModalService.createDialog({}),
                rejected;

            modal.promise.catch(function() {
                rejected = true;
            });

            modal.hide();
            $rootScope.$apply();

            expect(rejected).toBeTruthy();
        });

    });

});
