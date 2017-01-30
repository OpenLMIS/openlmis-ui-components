(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-status-messages.StatusMessagesController
     *
     * @description
     * Responsible for adding new status messages.
     */
    angular
        .module('requisition-status-messages')
        .controller('StatusMessagesController', controller);

    controller.$inject = ['$scope'];

    function controller($scope) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf requisition-status-messages.StatusMessagesController
         * @type {Object}
         * @name requisition
         *
         * @description
         * The requisition to which status message will be added.
         */
        vm.requisition = $scope.requisition;

        // Functions

        vm.displayAddComment = displayAddComment;
        vm.addComment = addComment;
        vm.removeComment = removeComment;

         /**
         * @ngdoc function
         * @name addComment
         * @methodOf requisition-status-messages.StatusMessagesController
         *
         * @description
         * Responsible for adding draft of comment to requisition.
         */
        function addComment() {
            vm.requisition.draftStatusMessage = "";
        }

         /**
         * @ngdoc function
         * @name removeComment
         * @methodOf requisition-status-messages.StatusMessagesController
         *
         * @description
         * Responsible for clearing draft.
         */
        function removeComment() {
            vm.requisition.draftStatusMessage = null;
        }

         /**
         * @ngdoc function
         * @name displayAddComment
         * @methodOf requisition-status-messages.StatusMessagesController
         *
         * @description
         * Responsible for checking if requisition has draft.
         * If true text area and remove button will be displayed.
         * Otherwise add button will be displayed.
         */
        function displayAddComment() {
            var canAddComment = true;
            if (vm.requisition.draftStatusMessage !== null) {
                canAddComment = false;
            }
            return canAddComment;
        }

    }

})();
