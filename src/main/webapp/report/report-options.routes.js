(function() {

    'use strict';

    angular
        .module('report')
        .config(config);

    config.$inject = ['$stateProvider', 'REPORT_RIGHTS'];

    function config($stateProvider, REPORT_RIGHTS) {

        $stateProvider.state('reports.options', {
            controller: 'ReportOptionsController',
            controllerAs: 'vm',
            templateUrl: 'report/report-options.html',
            url: '/:report/options',
            accessRights: [
                REPORT_RIGHTS.REPORTS_VIEW
            ],
            resolve: {
                report: function ($stateParams, requisitionReportService) {
                    return requisitionReportService.get($stateParams.report);
                }
            }
        });

    }

})();
