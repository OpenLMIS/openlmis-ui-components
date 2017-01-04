(function() {

    'use strict';

    angular
        .module('openlmis-i18n')
        .directive('openlmisMessage', directive);

    directive.$inject = ['messageService'];

    function directive(messageService) {
        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            var keyWithArgs = attrs.openlmisMessage.split("|");

            function apply(displayMessage) {
                var children = element.children();
                if (element[0].localName == 'textarea' || element[0].localName == 'select') {
                    element.attr('placeholder', displayMessage);
                    return;
                }

                switch (element.attr('type')) {
                    case 'button':
                    case 'submit':
                        element.attr("value", displayMessage);
                        break;
                    case 'text':
                    case 'password':
                        element.attr('placeholder', displayMessage);
                        break;

                    default:
                        element.html(displayMessage).append(children);
                        if (element.hasClass('welcome-message')) {
                            element.attr('title', displayMessage);
                        }
                }
            }

            var refreshMessages = function() {
                var key = scope.$eval(keyWithArgs[0]) || keyWithArgs[0];
                var message = messageService.get(key) || key;

                if (keyWithArgs[1]) {
                    message = replaceArgs(scope, message, keyWithArgs);
                }
                apply(message);
            };

            scope.$watch("[" + keyWithArgs.toString() + "]", refreshMessages, true);
            scope.$on('messagesPopulated', refreshMessages);

            function argumentMatcher(index) {
                return ['{', index - 1, '}'].join('');
            }

            function replaceArgs(scope, message, args) {
                $(args).each(function(index, arg) {
                    if (index > 0) {
                        var argValue = scope.$eval(arg) || arg;
                        message = message.replace(argumentMatcher(index), argValue);
                    }
                });
                return message;
            }
        }
    }

})();
