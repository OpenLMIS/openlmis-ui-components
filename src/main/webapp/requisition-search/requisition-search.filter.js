(function() {

    'use strict';

    /**
     * @ngdoc filter
     * @name .openlmis.requisitions.requisitionSearch
     * @function requisitionSearch
     *
     * @description Filters requisitions by given params.
     */
    angular
        .module('requisition-search')
        .filter('requisitionSearch', filter);

    filter.$inject = ['dateUtils'];

    function filter(dateUtils) {
        return function(input, params) {
            if(!angular.isObject(input)) return input;

            var requisitions = [];

            angular.forEach(input, function(requisition) {
                var match = true,
                    createdDate = dateUtils.toDate(requisition.createdDate);

                if(params.program && params.program != requisition.program.id) match = false;
                if(params.facility && params.facility != requisition.facility.id) match = false;
                if(params.initiatedDateFrom && new Date(params.initiatedDateFrom) > new Date(createdDate)) match = false;
                if(params.initiatedDateTo && new Date(params.initiatedDateTo) < new Date(createdDate)) match = false;
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
    }

})();
