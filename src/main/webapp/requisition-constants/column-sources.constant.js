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
     * @ngdoc object
     * @name requisition-constants.COLUMN_SOURCES
     *
     * @description
     * This is constant for requisition template column sources.
     */
    angular
    .module('requisition-constants')
    .constant('COLUMN_SOURCES', source());

    function source() {

        var Source = {
            USER_INPUT: 'USER_INPUT',
            CALCULATED: 'CALCULATED',
            REFERENCE_DATA: 'REFERENCE_DATA'
        },
        labels = {
            USER_INPUT: 'label.column.source.user.input',
            CALCULATED: 'label.column.source.calculated',
            REFERENCE_DATA: 'label.column.source.reference.data'
        };

        Source.getLabel = getLabel;

        return Source;

        function getLabel(name) {
            return labels[name];
        }
    }

})();
