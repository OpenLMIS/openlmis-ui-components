(function() {

    'use strict';

    angular
        .module('openlmis-date')
        .factory('dateUtils', dateUtils);

    dateUtils.$inject = ['$filter'];

    function dateUtils($filter) {
        var factory = {
            FILTER: 'date: \'dd/MM/yyyy\'',
            toDate: toDate,
            toArray: toArray,
            toStringDate: toStringDate
        };
        return factory;

        function toDate(array) {
            if (!array) return undefined;
            if(!angular.isArray(array)) return new Date(array); // when date is ISO string, not array
            if (array.length === 3) return new Date(array[0], array[1] - 1, array[2]);
            if (array.length === 6)
                // array[1] - 1, because in JavaScript months starts with 0 (to 11)
                return new Date(array[0], array[1] - 1, array[2], array[3], array[4], array[5]);
            return undefined;
        }

        function toArray(date, includeTime) {
            var array = [];
            array.push(date.getFullYear());
            array.push(date.getMonth() + 1);
            array.push(date.getDate());
            if(includeTime) {
                array.push(date.getHours());
                array.push(date.getMinutes());
                array.push(date.getSeconds());
            }
            return array;
        }

        function toStringDate(date) {
            return $filter('date')(date, 'yyyy-MM-dd');
        }
    }

})();
