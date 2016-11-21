(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .factory('Category', category);

    function category() {

        var Category;

        Category.prototype.isVisible = isVisible;

        return Category;

        function Category(name, lineItems) {
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
