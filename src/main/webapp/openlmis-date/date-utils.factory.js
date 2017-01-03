(function() {

    'use strict';

    angular
        .module('openlmis-date')
        .factory('DateUtils', dateUtils);

    function dateUtils() {
        var factory = {
            FILTER: 'date: \'dd/MM/yyyy\'',
            toDate: toDate
        }
        return factory;

        function toDate(array) {
            if (!array) return undefined;
            if (array.length === 3) return new Date(array.toString());
            if (array.length === 6) return new Date(array[0], array[1], array[2], array[3], array[4], array[5]);
            return undefined;
        }
    }

})();
