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

    /**
     * @ngdoc service
     * @name requisition-initiate.periodFactory
     *
     * @description
     * Responsible for parse periods and requisitions for initiate screen.
     */
    angular
        .module('requisition-initiate')
        .factory('periodFactory', periodFactory);

    periodFactory.$inject = ['periodService', 'requisitionService', 'messageService', '$q', 'REQUISITION_STATUS'];

    function periodFactory(periodService, requisitionService, messageService, $q, REQUISITION_STATUS) {
        var factory = {
            get: get
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf requisition-initiate.periodFactory
         * @name get
         *
         * @description
         * Retrieves periods for initiate from server.
         *
         * @param  {String}  programId  program UUID
         * @param  {String}  facilityId facility UUID
         * @param  {Boolean} emergency  if searching for emergency periods
         * @return {Promise}            facility promise
         */
        function get(programId, facilityId, emergency) {
            var deferred = $q.defer(),
                promises = [];

            promises.push(periodService.getPeriodsForInitiate(programId, facilityId, emergency));
            promises.push(requisitionService.search(false, {
                program: programId,
                facility: facilityId,
                emergency: emergency,
                requisitionStatus: emergency ? [REQUISITION_STATUS.INITIATED, REQUISITION_STATUS.SUBMITTED] : undefined
            }));

            $q.all(promises).then(function(response) {
                deferred.resolve(getPeriodGridLineItems(response[0], response[1].content, emergency));
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function getPeriodGridLineItems(periods, requisitions, emergency) {
            var periodGridLineItems = [];

            angular.forEach(periods, function(period, id) {
                if(emergency) {
                    periodGridLineItems.push(createPeriodGridItem(period, null, 0));
                } else {
                    var foundRequisition = null;
                    angular.forEach(requisitions, function (requisition) {
                        if (requisition.processingPeriod.id == period.id) {
                            foundRequisition = requisition;
                        }
                    });
                    periodGridLineItems.push(createPeriodGridItem(period, foundRequisition, id));
                }
            });

            if(emergency) {
                angular.forEach(requisitions, function(requisition) {
                    periodGridLineItems.push(createPeriodGridItem(requisition.processingPeriod, requisition, 0));
                });
            }

            return periodGridLineItems;
        }

        function createPeriodGridItem(period, requisition, id) {
            return {
                name: period.name,
                startDate: period.startDate,
                endDate: period.endDate,
                rnrStatus: (requisition ? requisition.status : (id === 0 ? messageService.get("msg.rnr.not.started") : messageService.get("msg.rnr.previous.pending"))),
                activeForRnr: (id === 0 ? true : false),
                rnrId: (requisition ? requisition.id : null)
            };
        }
    }

})();
