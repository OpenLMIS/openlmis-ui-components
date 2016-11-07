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

    angular.module('openlmis-core')
    	.factory('LoadingInterceptor', LoadingInterceptor)
    	.config(httpIntercept)
        .run(setLoadingListeners);

    httpIntercept.$inject = ['$httpProvider'];
    function httpIntercept($httpProvider){
    	$httpProvider.interceptors.push('LoadingInterceptor');
    }

    LoadingInterceptor.$inject = ['$rootScope'];
    function LoadingInterceptor($rootScope){

    	return {
    		'request': function(response){
                console.log("loading should start");
                $rootScope.$emit('loadingModal.start');
                return response;
    		},
            'response': function(response){
                console.log("loading should stop");
                $rootScope.$emit('loadingModal.stop');
                //LoadingModal.finishLoading();
                //LoadingModal.remove();
                return response;
            },
            'responseError': function(response) {
                console.log("loading should stop 2");
                $rootScope.$emit('loadingModal.stop');
                return response;
            }
    	}
    }

    setLoadingListeners.$inject = ['$rootScope', 'LoadingModal']
    function setLoadingListeners($rootScope, LoadingModal){
        $rootScope.$on('loadingModal.start', function(){
            console.log("meow");
            LoadingModal.startLoading();
        });
        $rootScope.$on('loadingModal.stop', function(){
            console.log("woof");
            LoadingModal.stopLoading();
        });
    }

})();