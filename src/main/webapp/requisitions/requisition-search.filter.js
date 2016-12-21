/**
 * @ngdoc filter
 * @name .openlmis.requisitions.requisitionFilter
 * @function requisitionFilter
 *
 * @description Filters requisitions by given params.
 */
angular.module('openlmis.requisitions').filter('requisitionFilter', ['DateUtils', function(DateUtils) {
    return function(input, params) {
        if(!angular.isObject(input)) return input;

        var requisitions = [];

        angular.forEach(input, function(requisition) {
            var match = true,
                createdDate = DateUtils.toDate(requisition.createdDate);

            if(params.program && params.program != requisition.program.id) match = false;
            if(params.facility && params.facility != requisition.facility.id) match = false;
            if(params.createdDateFrom && new Date(params.createdDateFrom) > new Date(createdDate)) match = false;
            if(params.createdDateTo && new Date(params.createdDateTo) < new Date(createdDate)) match = false;
            if(params.emergency && params.emergency != requisition.emergency) match = false;
            if(params.requisitionStatus && !matchStatus(requisition.status, params.requisitionStatus)) match = false;

            if(match) requisitions.push(requisition);
        });

        return requisitions;

        function matchStatus(requisitionStatus, statuses) {
            var match = false;
            angular.forEach(statuses, function(status) {
                if(requisitionStatus === status) match = true;
            });
            return match;
        }
    }
}]);
