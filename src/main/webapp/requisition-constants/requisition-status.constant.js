(function() {

    'use strict';

    /**
    * @ngdoc object
    * @name requisition-constants.REQUISITION_STATUS
    *
    * @description
    * This is constant for requisition statuses
    */
    angular
        .module('requisition-constants')
        .constant('REQUISITION_STATUS', status());

    function status() {

        return {
            INITIATED: 'INITIATED',
            SUBMITTED: 'SUBMITTED',
            AUTHORIZED: 'AUTHORIZED',
            IN_APPROVAL: 'IN_APPROVAL',
            APPROVED: 'APPROVED',
            RELEASED: 'RELEASED',
            SKIPPED: 'SKIPPED',
            $toList: toList,
            $getDisplayName: getDisplayName
        };

        /**
         * @ngdoc function
         * @methodOf requisition-constants.REQUISITION_STATUS
         * @name toList
         *
         * @description
         * Retrieves all requisition statuses.
         */
        function toList() {
            var list = [],
                id = 0;
            angular.forEach(this, function(status) {
                if (!angular.isFunction(status)) {
                    list.push( {
                        id: id,
                        label: status
                    });
                    id++;
                }
            });
            return list;
        }

        /**
         * @ngdoc function
         * @methodOf requisition-constants.REQUISITION_STATUS
         * @name getDisplayName
         *
         * @description
         * Retrieves display name for the given requisition status.
         */
        function getDisplayName(status) {
            var displayName;
            if (status == this.INITIATED) {
               displayName = 'Initiated';
            } else if (status == this.SUBMITTED) {
               displayName = 'Submitted';
            } else if (status == this.AUTHORIZED) {
                displayName = 'Authorized';
            } else if (status == this.IN_APPROVAL) {
                displayName = 'In approval';
            } else if (status == this.APPROVED) {
                displayName = 'Approved';
            } else if (status == this.RELEASED) {
                displayName = 'Released';
            } else if (status == this.SKIPPED) {
                displayName = 'Skipped';
            }
            return displayName;
        }
    }

})();
