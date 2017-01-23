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