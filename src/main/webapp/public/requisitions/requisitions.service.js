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
                isArray: true
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
            advancedSearch: advancedSearch,
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

        function search(programId, facilityId) {
            return resource.search({
                program: programId, 
                facility: facilityId
            }).$promise;
        }

        function advancedSearch(program, facility, statuses, startDate, endDate) {
            var searchParams = {
                facility: facility.id,
                startDate: startDate,
                endDate: endDate
            };
            if(statuses && angular.isArray(statuses && statuses.length > 0)) searchParams['status[]'] = statuses;
            if(program) searchParams['program'] = program.id;
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
    }

})();