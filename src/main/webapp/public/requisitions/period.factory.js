(function() {
  
    'use strict';

    angular.module('openlmis.requisitions').factory('PeriodFactory', periodFactory);

    periodFactory.$inject = ['$resource', 'RequisitionURL', 'RequisitionService', 'messageService', '$q'];

    function periodFactory($resource, RequisitionURL, RequisitionService, messageService, $q) {

        var resource = $resource(RequisitionURL('/api/requisitions/periods-for-initiate'), {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });

        var service = {
            get: get
        };
        return service;

        function get(programId, facilityId, emergency) {
            var deferred = $q.defer();

            resource.get({programId: programId, facilityId: facilityId, emergency: emergency}, function(data) {
                getPeriodGridLineItems(data, programId, facilityId).then(function(items) {
                    deferred.resolve(items);
                }).catch(function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getPeriodGridLineItems(periods, programId, facilityId) {
            var periodGridLineItems = [],
                deferred = $q.defer();

            RequisitionService.search(programId, facilityId).then(function(data) {
                periods.forEach(function (period, idx) {
                    var foundRequisition = null;
                    data.forEach(function (requisition) {
                        if (requisition.processingPeriodId == period.id) {
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
                startDate: formatDate(period.startDate),
                endDate: formatDate(period.endDate),
                rnrStatus: (requisition ? requisition.status : (idx === 0 ? messageService.get("msg.rnr.not.started") : messageService.get("msg.rnr.previous.pending"))),
                activeForRnr: (idx === 0 ? true : false),
                rnrId: (requisition ? requisition.id : null)
            };
        }

        function formatDate(date) {
            return new Date(date.join('-'));
        }
    }

})();