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
        .module('requisition-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider', 'paginatedRouterProvider'];

    function routes($stateProvider, paginatedRouterProvider) {
        $stateProvider.state('requisitions.requisition.fullSupply', {
            url: '/fullSupply?page&size',
            templateUrl: 'requisition-full-supply/full-supply.html',
            controller: 'FullSupplyController',
            controllerAs: 'vm',
            isOffline: true,
            resolve: paginatedRouterProvider.resolve({
                items: function($filter, requisition) {
                    var fullSupplyLineItems = $filter('filter')(requisition.requisitionLineItems, {
                        $program: {
                            fullSupply:true
                        }
                    });

                    return $filter('orderBy')(fullSupplyLineItems, [
                        '$program.orderableCategoryDisplayOrder',
                        '$program.orderableCategoryDisplayName',
                        '$program.displayOrder',
                        'orderable.name'
                    ]);
                },
                columns: function(requisition) {
                    return requisition.template.getColumns();
                }
            })
        });
    }

})();
