(function() {

	'use strict';

	angular.module('openlmis.requisitions').factory('User', User);
	angular.module('openlmis.requisitions').factory('PeriodsForProgramAndFacility', PeriodsForProgramAndFacility);
	angular.module('openlmis.requisitions').factory('RequisitionsForProgramAndFacility', RequisitionsForProgramAndFacility);
	angular.module('openlmis.requisitions').factory('Requisition', Requisition);


	User.$inject = ['OpenlmisURL', '$resource'];
	PeriodsForProgramAndFacility.$inject = ['OpenlmisURL', '$resource'];
	RequisitionsForProgramAndFacility.$inject = ['OpenlmisURL', '$resource'];
	Requisition.$inject = ['OpenlmisURL', '$resource'];

	function User(OpenlmisURL, $resource) {
		return $resource(OpenlmisURL('/referencedata/api/users/:id'), {
                id: '@id'
        });
	}

	function PeriodsForProgramAndFacility(OpenlmisURL, $resource) {
        return $resource(OpenlmisURL('/requisition/api/requisitions/periods-for-initiate'), {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }

    function RequisitionsForProgramAndFacility(OpenlmisURL, $resource) {
        return $resource(OpenlmisURL('/requisition/api/requisitions/search'), {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }

    function Requisition(OpenlmisURL, $resource) {
        return $resource(OpenlmisURL('/requisition/requisitions/:id'), {
                id: '@id'
        });
    }

})();