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

(function(){
    "use strict";

     angular.module("openlmis-urls")
        .factory('pathFactory', pathFactory);

    function pathFactory(){
        return function(){
            // Make arguments object into array
            // PhantomJS treats arguments as object
            var args = [];
            angular.forEach(arguments, function(arg){
                if(arg && arg != "") args.push(arg);
            });

            var parts = [];
            angular.forEach(args, function(arg, index){
                // clone argument to prevent changing original values
                var uri = arg.slice(0);
                // remove trailing slash, unless last argument
                if(index != args.length-1 && uri[uri.length-1] == '/') uri = uri.substr(0, uri.length-1);
                // remove first slash, unless first argument
                if(index != 0 && uri[0] == '/') uri = uri.substr(1, uri.length);

                parts.push(uri);
            });
            var URL = parts.join('/');
            return URL;
        }
    }

})();
