(function() {

    'use strict';

    angular
    .module('openlmis.requisitions')
    .constant('Source', source());

    function source() {
        return {
            USER_INPUT: {
                name: 'USER_INPUT',
                label: 'User Input'
            },
            CALCULATED: {
                name: 'CALCULATED',
                label: 'Calculated'
            },
            REFERENCE_DATA: {
                name: 'REFERENCE_DATA',
                label: 'Reference Data'
            }
        };
    }

})();
