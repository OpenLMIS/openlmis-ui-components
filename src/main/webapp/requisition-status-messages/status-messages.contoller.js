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
         * @type {Boolean}
         * @name isTextAreaVisible
         *
         * @description
         * True if text area for requisition comment is shown.
         */
        vm.isTextAreaVisible = false;

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
        vm.showTextArea = showTextArea;
        vm.hideTextArea = hideTextArea;

         /**
         * @ngdoc function
         * @name showTextArea
         * @methodOf requisition-status-messages.StatusMessagesController
         *
         * @description
         * Responsible for showing text area to input requisition comment.
         */
        function showTextArea() {
            vm.isTextAreaVisible = true;
        }

         /**
         * @ngdoc function
         * @name hideTextArea
         * @methodOf requisition-status-messages.StatusMessagesController
         *
         * @description
         * Responsible for hiding text area to input requisition status message.
         */
        function hideTextArea() {
            vm.requisition.draftStatusMessage = null;
            vm.isTextAreaVisible = false;
        }

         /**
         * @ngdoc function
         * @name displayAddComment
         * @methodOf requisition-status-messages.StatusMessagesController
         *
         * @description
         * Responsible for checking if requisition has some status message for current status.
         * If no add button will be displayed.
         */
        function displayAddComment() {
            var canAddComment = true;
            if (vm.requisition.draftStatusMessage || vm.isTextAreaVisible) {
                canAddComment = false;
            }
            return canAddComment;
        }

    }

})();
