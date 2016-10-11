(function() {

	'use strict';

	angular.module('openlmis.requisitions').directive('initRnrButton',
	    function() {
           return {
               restrict: 'E',
               templateUrl: '/public/requisitions/init-rnr-button.html',
               replace: true,
               scope: {
                   activeForRnr: '@'
               }
           }
        }
    );

})();