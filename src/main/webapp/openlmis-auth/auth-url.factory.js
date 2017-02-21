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
 	 * @name openlmis-auth.authUrl
 	 *
 	 * @description
 	 * A factory that takes a URL and prepends the AuthServiceURL before the url. The actual auth
 	 * url can be changed by setting the --authServiceURL flag at build time
 	 */
 	angular
        .module('openlmis-auth')
 		.factory('authUrl', factory);

 	factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

 	function factory(openlmisUrlFactory, pathFactory){

 		// String that gets replaced by AUTH_SERVICE_URL config variable
 		var authUrl = '@@AUTH_SERVICE_URL';
		if(authUrl.substr(0,2) == '@@'){
			authUrl = '';
		}

		/**
		 * @param  {String} url The url fragment to prepend the auth url before
		 * @return {String} A url that is directed towards the OpenLMIS AuthService
		 */
 		return function(url){
 			url = pathFactory(authUrl, url);
 			return openlmisUrlFactory(url);
 		}
 	}

 })();
