(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name openlmis.requisitions.ConvertToOrder
     * @description
     * Service allows to display confirm modal with custom message.
     *
     */

    angular.module('openlmis.requisitions')
        .service('ConvertToOrder', ConvertToOrder);

    ConvertToOrder.$inject = ['$ngBootbox', 'messageService', '$q'];

    function ConvertToOrder($ngBootbox, messageService, $q) {

        var ConvertToOrder = convertToOrder;

        return ConvertToOrder;

        /**
         *
         * @ngdoc function
         * @name ConvertToOrder
         * @methodOf openlmis.requisitions.ConvertToOrder
         * @param {String} message Primary message to display at the top
         * @param {Function} additionalMessage Additional message to display below
         * @param {String} buttonMessage Optional message to display on confirm button
         *
         * @description
         * Shows confirm modal with custom message.
         *
         */
        function convertToOrder(facilities, requisition) {
            var deferred = $q.defer();
            $ngBootbox.customDialog({
                title: 'Convert Requisition about ' + requisition.program.name + ' (' + requisition.facility.type.name + ')' + ' to order',
                templateUrl: 'common/convert-modal.html',
                buttons: {
                    confirm: {
                        label: messageService.get('button.convert.to.order'),
                        callback: deferred.resolve,
                    }
                }
            });
            return deferred.promise;
        }
    }
})();