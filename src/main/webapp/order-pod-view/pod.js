(function(){
    'use strict';
    /**
     *
     * @ngdoc service
     * @name order-pod-view.POD
     *
     * @description
     * Responsible for supplying pod with additional methods and information.
     */
    angular
        .module('order-pod-view')
        .factory('POD', factory);

    factory.$inject = ['podService'];

    function factory(podService){


        POD.prototype.$save = save;
        POD.prototype.$submit = submit;

        return POD;


        /**
         * @ngdoc function
         * @name POD
         * @methodOf order-pod-view.POD
         *
         * @description
         * Adds all needed methods and information to given POD.
         *
         * @param {Resource} source POD object
         * @param {Resource} order Order with additional info
         * @return {Object} POD
         */
        function POD(source, order) {
            angular.copy(source, this);

            this.order = order;
        }

        /**
         * @ngdoc function
         * @name save
         * @methodOf order-pod-view.POD
         *
         * @description
         * Saves current POD.
         *
         * @return {Promise} POD
         */
        function save() {
            return podService.save(this);
        }

        /**
         * @ngdoc function
         * @name submit
         * @methodOf order-pod-view.POD
         *
         * @description
         * Submits current POD.
         *
         * @return {Promise} POD
         */
        function submit() {
            return podService.submit(this);
        }
    }

})();
