/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('Offline navigation interceptor', function(){
	var $state, alertService, loadingModalService, isOffline;

	beforeEach(module('openlmis-navigation'));

	beforeEach(module(function($stateProvider){
		$stateProvider.state('normal', {
			url: '/normal'
		});
		$stateProvider.state('offline', {
			url: '/offline',
			isOffline: true
		});
	}));

	beforeEach(inject(function(_$state_, _alertService_, _loadingModalService_, offlineService){
		$state = _$state_;

		alertService = _alertService_;
		spyOn(alertService, 'error');

		loadingModalService = _loadingModalService_;
		spyOn(loadingModalService, 'close');

		isOffline = false;
		spyOn(offlineService, 'isOffline').andCallFake(function(){
			return isOffline;
		});

	}));

	it('will show an alert if offline for non-offline state', function(){
		$state.go('normal');
		expect(alertService.error).not.toHaveBeenCalled();

		isOffline = true;

		$state.go('normal');
		expect(alertService.error).toHaveBeenCalled();
	});

	it('will never show an alert if route is offline', function(){
		$state.go('offline');
		expect(alertService.error).not.toHaveBeenCalled();

		isOffline = true;
		$state.go('offline');
		expect(alertService.error).not.toHaveBeenCalled();
	});

});