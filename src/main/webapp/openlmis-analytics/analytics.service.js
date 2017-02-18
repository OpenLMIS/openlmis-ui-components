(function(){
    "use strict";

    /**
     *
     * @ngdoc service
     * @name  openlmis-analytics.anaslyticsService
     * @description
     * Wraps the google analytics object, and initializes the object with the
     * UA tracking code.
     *
     */

    angular.module('openlmis-analytics')
    .service('analyticsService', service);

    service.$inject = ['$window', 'offlineService'];
    function service($window, offlineService){
        var ga = $window.ga;

        this.track = track;

        ga('create', '@@ANALYTICS_TRACKING_ID', 'auto');


        /**
         *
         * @ngdoc function
         * @name  track
         * @methodOf openlmis-analytics.analyticsService
         *
         * @description
         * Can take any number of arguments and passes them directly to Google Analytics
         *
         */

        function track() {
            if(!offlineService.isOffline()){
                ga.apply(this, arguments);
            }
        }
    }

})();