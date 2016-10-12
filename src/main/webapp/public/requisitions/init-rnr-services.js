(function() {

	'use strict';

	angular.module('openlmis.requisitions').factory('User', User);
	angular.module('openlmis.requisitions').factory('PeriodsForProgramAndFacility', PeriodsForProgramAndFacility);
	angular.module('openlmis.requisitions').factory('RequisitionsForProgramAndFacility', RequisitionsForProgramAndFacility);
	angular.module('openlmis.requisitions').factory('Requisition', Requisition);


	User.$inject = ['OpenlmisURL', '$resource'];
	PeriodsForProgramAndFacility.$inject = ['RequisitionURL', '$resource'];
	RequisitionsForProgramAndFacility.$inject = ['RequisitionURL', '$resource'];
	Requisition.$inject = ['RequisitionURL', '$resource'];

	function User(OpenlmisURL, $resource) {
		return $resource(OpenlmisURL('/referencedata/api/users/:id'), {
                id: '@id'
        });
	}

	function PeriodsForProgramAndFacility(RequisitionURL, $resource) {
        return $resource(RequisitionURL('/api/requisitions/periods-for-initiate'), {}, {
            get: {
                method: 'GET',
                isArray: true,
                transformResponse: function(dataStr){
                    var data = JSON.parse(dataStr);
                    data.forEach(function(period){
                        period.startDate = new Date(period.startDate.join('-'));
                        period.endDate = new Date(period.endDate.join('-'));
                    });
                    return data;
                }
            }
        });
    }

    function RequisitionsForProgramAndFacility(RequisitionURL, $resource) {
        return $resource(RequisitionURL('/api/requisitions/search'), {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }

    function Requisition(RequisitionURL, $resource) {
        return $resource(RequisitionURL('/api/requisitions/:id'), {
                id: '@id'
        });
    }

})();