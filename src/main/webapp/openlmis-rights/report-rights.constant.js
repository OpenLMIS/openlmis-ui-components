(function() {

    'use strict';

    angular
        .module('openlmis-rights')
        .constant('REPORT_RIGHTS', rights());

    function rights() {
        return {
            REPORTS_VIEW: 'REPORTS_VIEW',
            REPORT_TEMPLATES_EDIT: 'REPORT_TEMPLATES_EDIT'
        };
    }

})();
