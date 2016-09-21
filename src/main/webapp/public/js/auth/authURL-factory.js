/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org.
 */

 (function(){
 	"use strict";

 	angular.module("openlmis")
		.constant("OpenlmisServerURL", function(){
			// The serverURL can be set with a grunt build argument
			// --serverURL=http://openlmis.server:location
			var serverURL = "@@OPENLMIS_SERVER_URL";
			if(serverURL.substr(0,2) == "@@"){
				return false;
			} else {
				return serverURL;
			}
	}());

 	angular.module("openlmis")
 		.constant("AuthServiceURL", function(){
 			// The authUrl can be set with a grunt build argument
 			// --AuthServiceURL=http://auth.service:location
 			var authUrl = "@@AUTH_SERVICE_URL";
 			if(authUrl.substr(0,2) == "@@"){
 				return false;
 			} else {
 				return authUrl;
 			}
 		}());

 	angular.module("openlmis")
 		.factory("AuthURL", AuthURL);

 	function AuthURL(AuthServiceURL, OpenlmisServerURL){
 		var rootUrl = "";

 		if(OpenlmisServerURL){
 			rootUrl = OpenlmisServerURL;
 		}
 		if(AuthServiceURL){
 			rootUrl = AuthServiceURL;
 		}

 		// remove trailing slash if entered into server...
 		if(rootUrl.substr(-1) == "/"){
 			rootUrl = rootUrl.substr(0, rootUrl.length-1);
 		}

 		return function(url){
 			if(url[0] == "/"){
 				url = url.substr(1);
 			}
 			return rootUrl + "/" + url;
 		}
 	}

 })();