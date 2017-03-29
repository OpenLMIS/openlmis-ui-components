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

describe('RequisitionApprovalListController', function () {

    //injects
    var vm, $state;

    //variables
    var requisitionList;

    beforeEach(function() {
        module('requisition-approval');

        inject(function ($controller, _$state_) {

            $state = _$state_;
            requisitionList = [
                {
                    id: 1,
                    facility: {
                        name: 'first facility',
                        code: 'first code'
                    },
                    program: {
                        name: 'first program'
                    }
                },
                {
                    id: 2,
                    facility: {
                        name: 'second facility',
                        code: 'second code',
                    },
                    program: {
                        name: 'second program'
                    }
                }
            ];

            vm = $controller('RequisitionApprovalListController', {
                items: items
            });
        });
    });

    it('should call state go when opening requisition', function () {
        spyOn($state, 'go');
        vm.openRnr(requisitionList[0].id);
        expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {rnr: requisitionList[0].id});
    });
});
