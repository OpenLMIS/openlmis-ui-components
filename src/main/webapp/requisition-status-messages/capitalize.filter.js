/**
 * @ngdoc filter
 * @name requisition-status-messages.capitalize
 * @function capitalize
 *
 * @description Change text to start with upperCase letter.
 */
angular.module('requisition-status-messages').filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});