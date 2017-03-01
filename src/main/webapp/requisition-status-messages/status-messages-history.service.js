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

(function(){
    "use strict";

    /**
     * @ngdoc service
     * @name requisition-status-messages.statusMessagesHistoryService
     *
     * @description
     * Displays modal with status messages history.
     */

    angular
        .module('requisition-status-messages')
        .service('statusMessagesHistoryService', service);

    service.$inject = ['$q', '$rootScope', '$ngBootbox', 'messageService', '$compile', '$templateRequest'];

    function service($q, $rootScope, $ngBootbox, messageService, $compile, $templateRequest) {

        var deferred, vm;

        this.show = show;

        /**
         * @ngdoc method
         * @methodOf requisition-status-messages.statusMessagesHistoryService
         * @name show
         *
         * @description
         * Shows modal with status messages history.
         *
         * @param  {Object}   requisition Requisition to get its history
         * @return {Promises}             status messages for requisition and template for modal
         */
        function show(requisition) {
            var scope = $rootScope.$new();

            deferred = $q.defer();

            scope.vm = {};
            vm = scope.vm;

            vm.requisition = requisition;

            $templateRequest('requisition-status-messages/status-messages-history.html')
            .then(function(template) {
                $ngBootbox.customDialog({
                    title: messageService.get('label.requisitionHistory'),
                    message: $compile(angular.element(template))(scope),
                    className: 'status-messages-history',
                    onEscape: true,
                    backdrop: true
                });
            }, reject);

            return deferred.promise;
        }

        function reject(deferred) {
            deferred.reject();
        }
    }
})();
