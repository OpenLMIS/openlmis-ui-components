describe("OfflineRun", function() {

    var offlineService, $timeout, $rootScope;

    beforeEach(function() {
        module('openlmis-offline', function($provide){
            var injector = angular.injector(['ng']);
            var $q = injector.get('$q');

            offlineService = {
                checkConnection: function(){
                    return $q.when(true);
                }
            };
            spyOn(offlineService, 'checkConnection').andCallThrough();
            
            $provide.service('offlineService', function(){
                return offlineService;
            });
        });

        inject(function(_$timeout_, _$rootScope_) {
            $timeout = _$timeout_;
            $rootScope = _$rootScope_;
        });
    });

    it('checks connection immedately', function() {
        expect(offlineService.checkConnection).toHaveBeenCalled();
    });

    it('checks connection on an interval', function(){
        var flag = false;
        runs(function(){
            $rootScope.$apply();
            setTimeout(function(){
                $timeout.flush();
                flag = true;
            }, 5);
        });

        waitsFor(function(){
            return flag;
        }, 'scope apply needs to run', 15);

        runs(function(){
            expect(offlineService.checkConnection.calls.length).toBe(2);
        });
    });
});