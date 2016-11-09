(function() {
  
    'use strict';

    angular.module('openlmis.requisitions').factory('PeriodFactory', periodFactory);

    periodFactory.$inject = ['$resource', 'RequisitionURL', 'RequisitionService', 'messageService', '$q', 'DateUtils'];

    function periodFactory($resource, RequisitionURL, RequisitionService, messageService, $q, DateUtils) {

        var resource = $resource(RequisitionURL('/api/requisitions/periodsForInitiate'), {}, {
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

            RequisitionService.search(programId, facilityId).then(function(data) {
                periods.forEach(function (period, idx) {
                    var foundRequisition = null;
                    data.forEach(function (requisition) {
                        if (requisition.processingPeriod.id == period.id) {
                            foundRequisition = requisition;
                        }
                    });
                    periodGridLineItems.push(createPeriodGridItem(period, foundRequisition, idx));
                });
                deferred.resolve(periodGridLineItems);
            }, function() {
                periods.forEach(function (period, idx) {
                    periodGridLineItems.push(createPeriodGridItem(period, null, idx));
                });
                deferred.resolve(periodGridLineItems);
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
                    period.startDate = DateUtils.toDate(period.startDate);
                    period.endDate = DateUtils.toDate(period.endDate);
                })
                return periods;
            }
            return data;
        }
    }

})();