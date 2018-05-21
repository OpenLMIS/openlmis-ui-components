/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-date.DateFormatTranslator
     *
     * @description
     * Translates Bootstrap date format string to a more commonly used dialect used by the
     * AngularJS date filter.
     *
     * Angular date filter and Bootstrap datepicker interpret date format differently so the
     * format string has to be translated.
     *
     * AngularJS doc
     * https://docs.angularjs.org/api/ng/filter/date#overview
     *
     * Bootstrap Datepicker doc
     * http://bootstrap-datepicker.readthedocs.io/en/latest/options.html#format
     */
    angular
        .module('openlmis-date')
        .factory('DateFormatTranslator', DateFormatTranslator);

    DateFormatTranslator.$inject = ['BOOTSTRAP_TO_MOMENT', 'BOOTSTRAP_TO_ANGULAR_DATE'];

    function DateFormatTranslator(BOOTSTRAP_TO_MOMENT, BOOTSTRAP_TO_ANGULAR_DATE) {

        DateFormatTranslator.prototype.translateBootstrapToAngularDate = translateBootstrapToAngularDate;
        DateFormatTranslator.prototype.translateBootstrapToMoment = translateBootstrapToMoment;

        return DateFormatTranslator;

        function DateFormatTranslator() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-date.DateFormatTranslator
         * @name translateBootstrapToAngularDate
         *
         * @description
         * Translates the provided Bootstrap datepicker format string into a AngularJS date filter friendly one.
         *
         * @param  {String} bootstrapDateFormat the Bootstrap datepicker date format string
         * @return {String}                     the AngularJS date filter friendly date format string
         */
        function translateBootstrapToAngularDate(bootstrapDateFormat) {
            return translate(bootstrapDateFormat, BOOTSTRAP_TO_ANGULAR_DATE);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-date.DateFormatTranslator
         * @name translateBootstrapToMoment
         *
         * @description
         * Translates the provided AngularJS date filter format string into a moment.js friendly one.
         *
         * @param  {String} angularDateFormat the AngularJS date filter format string
         * @return {String}                   the moment.js friendly date format string
         */
        function translateBootstrapToMoment(angularDateFormat) {
            return translate(angularDateFormat, BOOTSTRAP_TO_MOMENT);
        }

        function translate(dateFormat, translationMap) {
            var translatedDateFormat = dateFormat;

            Object.keys(translationMap).forEach(function(from) {
                translatedDateFormat = replaceWith(translatedDateFormat, from, translationMap[from]);
            });

            return translatedDateFormat;
        }

        function replaceWith(dateFormat, from, to) {
            if (dateFormat.indexOf(from) > -1) {
                return dateFormat.replace(from, to);
            }
            return dateFormat;
        }

    }

})();
