describe("OfflineService", function() {

    var offline, offlineService, rootScope;

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(OfflineService, Offline, _$rootScope_) {
        offlineService = OfflineService;
        offline = Offline;
        rootScope = _$rootScope_;
    }));

    it('should return false when there is internet connection', function() {
        var result;
        spyOn(offlineService, 'isOffline').andCallThrough();

        spyOn(offline, 'check').andCallFake(function() {
            offline.trigger('confirmed-up');
        });

        offlineService.isOffline().then(function(data) {
            result = data;
        });

        rootScope.$apply();
        expect(offline.check).toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return true when there is no internet connection', function() {
        var result = false;
        spyOn(offlineService, 'isOffline').andCallThrough();

        spyOn(offline, 'check').andCallFake(function() {
            offline.trigger('confirmed-down');
        });

        offlineService.isOffline().then(function(data) {
            result = data;
        });

        rootScope.$apply();
        expect(offline.check).toHaveBeenCalled();
        expect(result).toBe(true);
    });
});
