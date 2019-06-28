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

describe('MessageCreationDetailsController', function() {

    beforeEach(function() {
        module('openlmis-message-creation-details');
        module('openlmis-date');

        inject(function($injector) {
            this.$filter = $injector.get('$filter');
            this.$controller = $injector.get('$controller');
        });

        this.vm = this.$controller('MessageCreationDetailsController');
        this.dateFilter = this.$filter('openlmisDate');
    });

    describe('init', function() {

        it('should use filter to display date in user-friendly format', function() {
            this.vm.createdDate = '2019-06-28T12:27:13.920Z';
            this.vm.$onInit();

            expect(this.vm.createdDate).toEqual('28/06/2019');
        });
    });
});
