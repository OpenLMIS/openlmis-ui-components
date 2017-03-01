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
     * @name openlmis-urls.openlmisUrlService
     *
     * @description
     * Responsible for parsing URLs.
     */
    angular
        .module('openlmis-urls')
        .service('openlmisUrlService', service);

    service.$inject = ['pathFactory'];

    function service(pathFactory) {
        var service = {};

        service.format = formatURL;
        service.check = checkURL;

        /**
         * @ngdoc property
         * @propertyOf openlmis-urls.openlmisUrlService
         * @name url
         * @type {String}
         *
         * @description
         * Contains server URL
         */
        service.url = '/';

        // The serverURL can be set with a grunt build argument
        // --serverURL=http://openlmis.server:location
        var serverURL = '@@OPENLMIS_SERVER_URL';
        if(serverURL.substr(0,2) != '@@') {
            service.url = serverURL;
        }

        var serverURLs = [];
        var bypassURLs = ['ui-grid', 'bootstrap'];
        function addURLtoServerURLs(url) {
            var rootURL = getRootURL(url);
            if(!checkURL(rootURL)) {
                serverURLs.push(rootURL);
            }
        }

        function getRootURL(url) {
            var offset = 0;
            if(url.substr(0, 7).toLowerCase() == 'http://') {
                offset = 7;
            } else if(url.substr(0, 8).toLowerCase() == 'https://') {
                offset = 8;
            }

            var splitPosition = undefined;
            var firstBackslashPosition = url.substr(offset).indexOf('/');
            if(firstBackslashPosition >= 1) {
                splitPosition = offset + url.substr(offset).indexOf('/');
            }
            return url.substr(0, splitPosition);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-urls.openlmisUrlService
         * @name formatURL
         *
         * @description
         * Formats URL.
         *
         * @return {String} formated URL
         */
        function formatURL() {
            var parts = [];
            angular.forEach(arguments, function(arg, index) {
                if(index==0 && arg.substr(0, 4).toLowerCase() == 'http') {
                    addURLtoServerURLs(arg);
                } else if(index==0) {
                    parts.push(service.url);
                }
                parts.push(arg);
            });
            return pathFactory.apply(this, parts);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-urls.openlmisUrlService
         * @name checkURL
         *
         * @description
         * Checks if given parameter is URL.
         *
         * @return {Boolean} true if is URL, false otherwise
         */
        function checkURL(url) {
            var urlsToCheck = serverURLs.concat(service.url);
            for(var i=0; i<bypassURLs.length; i++) {
                if(url.substring(0, bypassURLs[i].length) == bypassURLs[i]) {
                    return false;
                }
            }
            for(var i=0; i<urlsToCheck.length; i++) {
                if(url.indexOf(urlsToCheck[i]) == 0) {
                    return true;
                }
            }
            return false;
        }

        return service;
    }

})();
