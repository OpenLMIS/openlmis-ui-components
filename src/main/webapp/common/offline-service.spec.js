describe("OfflineService", function() {

    var offline, offlineService;

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(OfflineService, Offline) {
        offlineService = OfflineService;
        offline = Offline;
    }));

    it('should return false when there is internet connection', function() {
        offline.trigger('confirmed-up');

        expect(offlineService.isOffline).toBe(false);
    });

    it('should return true when there is no internet connection', function() {
        offline.trigger('confirmed-down');

        expect(offlineService.isOffline).toBe(true);
    });

    it('should return false when the connection has gone from down to up', function() {
        offline.trigger('up');

        expect(offlineService.isOffline).toBe(false);
    });

    it('should return true when the connection has gone from up to down', function() {
        offline.trigger('down');

        expect(offlineService.isOffline).toBe(true);
    });
});
