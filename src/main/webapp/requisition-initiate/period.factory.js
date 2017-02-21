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
        .module('requisition-initiate')
        .factory('periodFactory', periodFactory);

    periodFactory.$inject = [
        '$resource', 'requisitionUrlFactory', 'requisitionService', 'messageService', '$q',
        'dateUtils', 'REQUISITION_STATUS'
    ];

    function periodFactory($resource, requisitionUrlFactory, requisitionService, messageService, $q,
        dateUtils, REQUISITION_STATUS) {

        var resource = $resource(requisitionUrlFactory('/api/requisitions/periodsForInitiate'), {}, {
            get: {
                method: 'GET',
                isArray: true,
                transformResponse: transformResponse
            }
        });

        var service = {
            get: get
        };
        return service;

        function get(programId, facilityId, emergency) {
            var deferred = $q.defer();

            resource.get({programId: programId, facilityId: facilityId, emergency: emergency}, function(data) {
                getPeriodGridLineItems(data, programId, facilityId, emergency).then(function(items) {
                    deferred.resolve(items);
                }).catch(function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getPeriodGridLineItems(periods, programId, facilityId, emergency) {
            var periodGridLineItems = [],
                deferred = $q.defer();

            if (emergency === true) {
                getPreviousPeriodLineItems(programId, facilityId, emergency).then(search);
            } else {
                search(periodGridLineItems);
            }

            return deferred.promise;

            function search(lineItems) {
                requisitionService.search(false, {
                    program: programId,
                    facility: facilityId,
                    emergency: false
                }).then(function(data) {
                    periods.forEach(function (period, idx) {
                        var foundRequisition = null;
                        data.forEach(function (requisition) {
                            if (requisition.processingPeriod.id == period.id) {
                                foundRequisition = requisition;
                            }
                        });
                        if (emergency == false || (emergency == true &&
                        foundRequisition != null && lineItems.length == 0)) {
                            lineItems.push(createPeriodGridItem(period, foundRequisition, idx));
                        }
                        if (emergency == true && foundRequisition == null) {
                            lineItems.push(createPeriodGridItem(period, null, idx));
                        }
                    });
                    deferred.resolve(lineItems);
                });
            }
        }

        function getPreviousPeriodLineItems(programId, facilityId, emergency) {
            var statuses = [REQUISITION_STATUS.INITIATED, REQUISITION_STATUS.SUBMITTED],
                deferred = $q.defer();

            requisitionService.search(false, {
                program: programId,
                facility: facilityId,
                requisitionStatus: statuses,
                emergency: emergency
            }).then
            (function(data) {
                var lineItems = [];
                data.forEach(function(rnr) {
                    lineItems.push(createPeriodGridItem(rnr.processingPeriod, rnr, 0));
                });
                deferred.resolve(lineItems);
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function createPeriodGridItem(period, requisition, idx) {
            return {
                name: period.name,
                startDate: period.startDate,
                endDate: period.endDate,
                rnrStatus: (requisition ? requisition.status : (idx === 0 ? messageService.get("msg.rnr.not.started") : messageService.get("msg.rnr.previous.pending"))),
                activeForRnr: (idx === 0 ? true : false),
                rnrId: (requisition ? requisition.id : null)
            };
        }

        function transformResponse(data, headers, status) {
            if (status === 200) {
                var periods = angular.fromJson(data);
                periods.forEach(function(period) {
                    period.startDate = dateUtils.toDate(period.startDate);
                    period.endDate = dateUtils.toDate(period.endDate);
                })
                return periods;
            }
            return data;
        }
    }

})();
