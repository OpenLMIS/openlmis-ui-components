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
     * @name referencedata.referencedataUrlFactory
     *
     * @description
     * Supplies application with referencedata URL.
     */
    angular
        .module('referencedata')
        .factory('referencedataUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var referencedataUrl = '@@REFERENCEDATA_SERVICE_URL';

        if (referencedataUrl.substr(0, 2) == '@@') {
            referencedataUrl = '';
        }

        /**
         * @ngdoc function
         * @name referencedataUrlFactory
         * @methodOf referencedata.referencedataUrlFactory
         *
         * @description
         * It parses the given URL and appends referencedata service URL to it.
         *
         * @param {String} url referencedata URL from grunt file
         * @return {String} referencedata URL
         */
        return function(url) {
            url = pathFactory(referencedataUrl, url);
            return openlmisUrlFactory(url);
        };
    }

})();
