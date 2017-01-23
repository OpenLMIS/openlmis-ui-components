(function() {

    'use strict';

    /**
     * @ngdoc filter
     * @name openlmis-date.period
     *
     * @description
     * Parses the given period into more readable form. Depending on whether the includeName flag
     * is set it will parse the period into "PeriodName (01/01/2017 - 31/01/2017)" or just
     * "01/01/2017 - 31/01/2017".
     *
     * @param   {Object}    period      the period to be formated
     * @param   {Boolean}   includeName the flag defining whether name of period should be included
     *
     * @return  {String}                the formated period
     *
     * @example
     * We want to display a period inside of a table and we want to include the period name
     * ```
     * <td>{{somePeriod | period:true}}</td>
     * ```
     */
    angular
        .module('openlmis-date')
        .filter('period', filter);

    filter.$inject = ['$filter'];

    function filter($filter) {
        return periodFilter;

        function periodFilter(period, includeName) {
            var format = 'dd/MM/yyyy',
                startDate = $filter('date')(period.startDate, format),
                endDate = $filter('date')(period.endDate, format),
                transformed = startDate + ' - ' + endDate;

            return includeName ? period.name + ' (' + transformed + ')' : transformed;
        }
    }

})();
