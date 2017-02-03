(function(){
    /**
    * @ngdoc filter
    * @name requisition-status-messages.requisitionStatus
    *
    * @description Change text to start with upperCase letter.
    *
    * @param {Object} status Status to be formatted
    *
    * @example
    * We want to display a status inside of a table
    * ```
    * <td>{{someStatus | requisitionStatus}}</td>
    * ```
    */
    angular
        .module('requisition-status-messages')
        .filter('requisitionStatus', filter);

    filter.$inject = ['REQUISITION_STATUS'];

    function filter(REQUISITION_STATUS) {
        return statusFilter;

        function statusFilter(status) {
            return REQUISITION_STATUS.$getDisplayName(status);
        }
    }

})();
