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

(function() {

    'use strict';

    angular
        .module('order-view')
        .config(config);

    config.$inject = ['$stateProvider', 'REQUISITION_RIGHTS', 'FULFILLMENT_RIGHTS'];

    function config($stateProvider, REQUISITION_RIGHTS, FULFILLMENT_RIGHTS) {

        $stateProvider.state('orders.view', {
            controller: 'OrderViewController',
            controllerAs: 'vm',
            label: 'link.viewOrders',
            showInNavigation: true,
            templateUrl: 'order-view/order-view.html',
            url: '/view?supplyingFacility&requestingFacility&program&page&size',
            accessRights: [
                REQUISITION_RIGHTS.REQUISITION_CREATE,
                REQUISITION_RIGHTS.REQUISITION_AUTHORIZE,
                FULFILLMENT_RIGHTS.PODS_MANAGE,
                FULFILLMENT_RIGHTS.ORDERS_VIEW
            ],
            areAllRightsRequired: true,
            resolve: {
                supplyingFacilities: function(facilityFactory, authorizationService) {
                    return facilityFactory.getSupplyingFacilities(
                        authorizationService.getUser().user_id
                    );
                },
                requestingFacilities: function(facilityFactory, authorizationService) {
                    return facilityFactory.getRequestingFacilities(
                        authorizationService.getUser().user_id
                    );
                },
                programs: function(programService, authorizationService) {
                    return programService.getUserPrograms(
                        authorizationService.getUser().user_id
                    );
                },
                orders: function(paginationService, orderFactory, $stateParams) {
					return paginationService.registerUrl($stateParams, function(stateParams) {
                        if (stateParams.supplyingFacility) {
                            return orderFactory.search(stateParams);
                        }
                        return undefined;
					});
				}
            }
        });

    }

})();
