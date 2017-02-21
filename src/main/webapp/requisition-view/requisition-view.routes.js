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
        .module('requisition-view')
        .config(routes);

    routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS', 'FULFILLMENT_RIGHTS'];

    function routes($stateProvider, REQUISITION_RIGHTS, FULFILLMENT_RIGHTS) {

        $stateProvider.state('requisitions.requisition', {
            url: '^/requisition/:rnr',
            controller: 'RequisitionViewController',
            controllerAs: 'vm',
            templateUrl: 'requisition-view/requisition-view.html',
            accessRights: [REQUISITION_RIGHTS.REQUISITION_CREATE,
                REQUISITION_RIGHTS.REQUISITION_DELETE,
                REQUISITION_RIGHTS.REQUISITION_AUTHORIZE,
                REQUISITION_RIGHTS.REQUISITION_APPROVE,
                FULFILLMENT_RIGHTS.ORDERS_EDIT],
            resolve: {
                requisition: function ($location, $q, $stateParams, requisitionService) {
                    var deferred = $q.defer();

                    requisitionService.get($stateParams.rnr).then(function(response) {
                        deferred.resolve(response);
                    }, function(response) {
                        deferred.reject();
                        return $location.url('/404');
                    });

                    return deferred.promise;
                }
            }
        });

    }

})();
