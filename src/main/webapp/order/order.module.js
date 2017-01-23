(function() {

    'use strict';

    /**
     * @module order
     *
     * @description
     * Provides base order state and service/factory for retrieving orders from the OpenLMIS server.
     */
    angular.module('order', [
        'fulfillment',
        'openlmis-date',
        'referencedata-facility',
        'referencedata-period',
        'referencedata-program',
        'ui.router'
    ]);

})();
