/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

	'use strict';

	angular.module('openlmis.requisitions').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('administration.configure.template', {
			url: '/template/:template',
			controller: 'RequisitionTemplateAdminController',
			templateUrl: 'requisitions/template/template.html',
			controllerAs: 'vm',
			accessRight: 'MANAGE_REQUISITION_TEMPLATES',
			resolve: {
				template: function ($stateParams, templateFactory) {
					return templateFactory.get($stateParams.template);
				},
				program: function (template, Program) {
					return Program.get(template.programId);
				}
			}
		});

		$stateProvider.state('administration.configure.templateList', {
			showInNavigation: true,
			label: 'configure.rnr.header',
			url: '/templateList',
			controller: 'ProgramAdministrationListCtrl',
			templateUrl: 'requisitions/template/program-administration-list/program-administration-list.html',
			controllerAs: 'vm',
			accessRight: 'MANAGE_REQUISITION_TEMPLATES',
			resolve: {
				programList: function (Program) {
					return Program.getAll();
				}
			}
		});
	}
})();
