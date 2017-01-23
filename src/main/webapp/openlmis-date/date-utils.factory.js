(function() {

    'use strict';

    angular
        .module('openlmis-date')
        .factory('dateUtils', dateUtils);

    function dateUtils() {
        var factory = {
            FILTER: 'date: \'dd/MM/yyyy\'',
            toDate: toDate,
            toArray: toArray
        };
        return factory;

        function toDate(array) {
            if (!array) return undefined;
            if (array.length === 3) return new Date(array[0], array[1] - 1, array[2]);
            if (array.length === 6)
                // array[1] - 1, because in JavaScript months starts with 0 (to 11)
                return new Date(array[0], array[1] - 1, array[2], array[3], array[4], array[5]);
            return undefined;
        }

        function toArray(date, includeTime) {
            var array = [];
            array.push(date.getFullYear());
            array.push(date.getMonth());
            array.push(date.getDay());
            if(includeTime) {
                array.push(date.getHours());
                array.push(date.getMinutes());
                array.push(date.getSeconds());
            }
            return array;
        }
    }

})();
