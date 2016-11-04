(function() {
  
    'use strict';

    angular
        .module('openlmis.requisitions')
        .service('RequisitionService', requisitionService);

    requisitionService.$inject = ['$resource', 'RequisitionURL', 'RequisitionFactory', 'Source', 'Column'];

    function requisitionService($resource, RequisitionURL, RequisitionFactory, Source, Column) {

        var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
            'initiate': {
                url: RequisitionURL('/api/requisitions/initiate'),
                method: 'POST'
            },
            'search': {
                url: RequisitionURL('/api/requisitions/search'),
                method: 'GET',
                isArray: true
            }
        });

        var service = {
            get: get,
            initiate: initiate,
            search: search,
            advancedSearch: advancedSearch
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

    }

})();