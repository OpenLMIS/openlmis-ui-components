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
            var match = true;

            transformRequisition(requisition);

            if(params.program && params.program != requisition.program.id) match = false;
            if(params.facility && params.facility != requisition.facility.id) match = false;
            if(params.createdDateFrom && new Date(params.createdDateFrom) > new Date(requisition.createdDate)) match = false;
            if(params.createdDateTo && new Date(params.createdDateTo) < new Date(requisition.createdDate)) match = false;
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

        function transformRequisition(requisition) {
            requisition.createdDate = DateUtils.toDate(requisition.createdDate);
            requisition.processingPeriod.startDate = DateUtils.toDate(requisition.processingPeriod.startDate);
            requisition.processingPeriod.endDate = DateUtils.toDate(requisition.processingPeriod.endDate);
            requisition.processingPeriod.processingSchedule.modifiedDate = DateUtils.toDate(requisition.processingPeriod.processingSchedule.modifiedDate);
        }
    }
}]);
