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

	angular.module('openlmis.administration').config(routes);

	routes.$inject = ['$stateProvider'];

	function routes($stateProvider) {

		$stateProvider.state('administration.configure.template', {
			url: '/template/:template',
			controller: 'TemplateController',
			templateUrl: 'administration/template/template.html',
			controllerAs: 'vm',
			resolve: {
				templateAndProgram: function ($location, $q, $stateParams, $state, templateFactory, Program) {
					var deferred = $q.defer();

					templateFactory.get($stateParams.template).then(function(requisitionTemplate) {
						Program.get(requisitionTemplate.programId).then(function(program) {
							deferred.resolve({
								template: requisitionTemplate,
								program: program
							});
						}, function() {
							deferred.reject();
							return $location.url('/404');
						});
					}, function(response) {
						deferred.reject();
						return $location.url('/404');
					});

					return deferred.promise;
				}
			}
		});

		$stateProvider.state('administration.configure.templateList', {
			showInNavigation: true,
			label: 'configure.rnr.header',
			url: '/templateList',
			controller: 'TemplateListController',
			templateUrl: 'administration/template/template-list/template-list.html',
			resolve: {
				programList: function (Program) {
					return Program.getAll();
				}
			}
		});
	}
})();
