(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .service('RequisitionService', requisitionService);

    requisitionService.$inject = ['$q', '$resource', 'messageService', 'RequisitionURL', 'RequisitionFactory', 'Source', 'Column', '$ngBootbox', 'NotificationModal'];

    function requisitionService($q, $resource, messageService, RequisitionURL, RequisitionFactory, Source, Column, $ngBootbox, NotificationModal) {

        var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
            'initiate': {
                url: RequisitionURL('/api/requisitions/initiate'),
                method: 'POST'
            },
            'search': {
                url: RequisitionURL('/api/requisitions/search'),
                method: 'GET',
                isArray: true
            },
            'forConvert': {
                url: RequisitionURL('/api/requisitions/requisitionsForConvert'),
                method: 'GET',
                isArray: true,
                transformResponse: transformForConvertResponse
            },
            'convertToOrder': {
                url: RequisitionURL('/api/orders/requisitions'),
                method: 'POST',
                transformRequest: transformRequest
            }
        });

        var service = {
            get: get,
            initiate: initiate,
            search: search,
            forConvert: forConvert,
            convertToOrder: convertToOrder
        };
        return service;

        function get(id) {
            var response = resource.get({id: id});
            response.$promise.then(RequisitionFactory);
            return response;
        }

        function initiate(facility, program, suggestedPeriod, emergency) {
            return resource.initiate({
                facility: facility,
                program: program,
                suggestedPeriod: suggestedPeriod,
                emergency: emergency
            }, {}).$promise;
        }

        function search(programId, facilityId, statuses, startDate, endDate) {
            var searchParams = {
                facility: facilityId
            };
            if(programId) searchParams['program'] = programId;
            if(statuses && angular.isArray(statuses) && statuses.length > 0) searchParams['requisitionStatus'] = statuses;
            if(startDate) searchParams['createdDateFrom'] = startDate;
            if(endDate) searchParams['createdDateTo'] = endDate;
            return resource.search(searchParams).$promise; 
        }

        function forConvert(params) {
            return resource.forConvert(params).$promise;
        }

        function convertToOrder(requisitions) {
            var deferred = $q.defer();

            $ngBootbox.confirm(messageService.get('msg.question.confirmation')).then(function() {
                resource.convertToOrder(requisitions).$promise.then(function() {
                    deferred.resolve();
                    NotificationModal.showSuccess('msg.rnr.converted.to.order');
                }, function() {
                    deferred.reject();
                    NotificationModal.showError('msg.error.occurred');
                });
            }, function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function transformRequest(requisitionsWithDepots) {
            var body = [];
            angular.forEach(requisitionsWithDepots, function(requisitionWithDepots) {
                body.push({
                    requisitionId: requisitionWithDepots.requisition.id,
                    supplyingDepotId: requisitionWithDepots.requisition.supplyingFacility
                });
            });
            return angular.toJson(body);
        }

        function transformForConvertResponse(data, headers, status) {
            if (status === 200) {
                var items = angular.fromJson(data);
                angular.forEach(items, function(item) {
                    item.requisition.processingPeriod.startDate = toDate(item.requisition.processingPeriod.startDate);
                    item.requisition.processingPeriod.endDate = toDate(item.requisition.processingPeriod.endDate);
                    item.requisition.processingPeriod.processingSchedule.modifiedDate = toDate(item.requisition.processingPeriod.processingSchedule.modifiedDate);
                });
                return items;
            }
            return data;
        }

        function toDate(array) {
            return array ? new Date(array.toString()) : undefined;
        }
    }

})();