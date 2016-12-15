(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .factory('RequisitionCategory', requisitionCategory);

    function requisitionCategory() {

        var RequisitionCategory;

        RequisitionCategory.prototype.isVisible = isVisible;

        return RequisitionCategory;

        function RequisitionCategory(name, lineItems) {
            this.name = name;
            this.lineItems = lineItems;
        }

        function isVisible() {
            var visible = false;

            this.lineItems.forEach(function(lineItem) {
                visible = visible || lineItem.$visible === undefined || lineItem.$visible;
            });

            return visible;
        }

    }

})();
