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
     * @name openlmis-form.DatepickerFormatTranslator
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
        .module('openlmis-form')
        .factory('DatepickerFormatTranslator', DatepickerFormatTranslator);

    DatepickerFormatTranslator.inject = [];

    function DatepickerFormatTranslator() {

        DatepickerFormatTranslator.prototype.translate = translate;

        return DatepickerFormatTranslator;

        function DatepickerFormatTranslator() {}

        /**
         * @ngdoc method
         * @methodOf openlmis-form.DatepickerFormatTranslator
         * @name translate
         * 
         * @description
         * Translates the provided Bootstrap datepicker format string into a AngularJS date filter
         * friendly one.
         * 
         * @param  {String} dateFormatString the Bootstrap datepicker date format string
         * @return {String}                  the AngularJS date filter friendly date format string
         */
        function translate(dateFormatString) {
            if (dateFormatString.indexOf('mm') > -1) {
                return dateFormatString.replace('mm', 'MM');
            }

            if (dateFormatString.indexOf('m') > -1) {
                return dateFormatString.replace('m', 'M');
            }

            if (dateFormatString.indexOf('MM') > -1) {
                return dateFormatString.replace('MM', 'MMMM');
            }

            if (dateFormatString.indexOf('M') > -1) {
                return dateFormatString.replace('M', 'MMM');
            }

            return dateFormatString;
        }

    }

})();