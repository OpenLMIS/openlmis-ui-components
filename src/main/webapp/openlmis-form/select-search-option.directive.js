(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-form.directive:select-search-option
     * @restrict E
     *
     * @description
     * Disables select dropdown and displays modal with options and search input.
     * This functionality will be applied to select when there is
     * more than 10 options or it has pop-out attribute.
     *
     * @example
     * ```
     * <select .... pop-out ... > ..... </select>
     * ```
     */
    angular
        .module('openlmis-form')
        .directive('select', select);

    select.$inject = ['bootbox', '$rootScope', '$compile', '$templateRequest'];

    function select(bootbox, $rootScope, $compile, $templateRequest) {
        return {
            restrict: 'E',
            replace: false,
            require: ['select', '?ngModel'],
            link: link
        };

        function link(scope, element, attrs, ctrls) {
            var selectCtrl = ctrls[0],
                ngModelCtrl = ctrls[1],
                modal;

            element.on('mousedown', function (event) {
                if(isPopOut()) {
                    event.stopPropagation();
                    showModal();
                }
            });

            element.bind("keydown", function (event) {
                if(isPopOut() && event.which === 13) {
                    event.stopPropagation();
                    showModal();
                }
            });

            updateSelect();
            if(ngModelCtrl) {
                // using instead of $ngModelCtrl.$render
                // beacuse ngSelect uses it
                scope.$watch(function() {
                    return ngModelCtrl.$modelValue;
                }, updateSelect);

                // See if ng-repeat or ng-options changed
                scope.$watch(function() {
                    return element.html();
                }, updateSelect);
            }

            function updateSelect() {
                if(isPopOut()) {
                    element.addClass('pop-out');
                } else {
                    element.removeClass('pop-out');
                }
            }

            function showModal() {
                $templateRequest('openlmis-form/select-search-option.html').then(function(template) {
                    var modalScope = $rootScope.$new();

                    modalScope.options = getOptions();
                    modalScope.select = selectOption;

                    var labelElement = element.siblings('label[for="' + element[0].id + '"]');

                    modal = bootbox.dialog({
                        title: labelElement[0] ? labelElement[0].textContent : '',
                        message: $compile(template)(modalScope),
                        backdrop: true,
                        onEscape: true
                    });
                });
            }

            function getOptions() {
                var options = [];

                angular.forEach(element.children('option:not(.placeholder)'), function(option) {
                    options.push(angular.element(option)[0]);
                });

                return options;
            }

            function updateModel() {
                if(ngModelCtrl) {
                    var selectedValue = selectCtrl.readValue();
                    ngModelCtrl.$setViewValue(selectedValue);
                }
            }

            function selectOption(option) {
                element.children('option[selected="selected"]').removeAttr('selected');
                element.children('option[label="' + option.label + '"]').attr('selected', 'selected');

                updateModel();

                if(modal) modal.modal('hide');
            }

            function isPopOut() {
                return (attrs.popOut !== null && attrs.popOut !== undefined) ||
                    (getOptions().length > 10);
            }
        }
    }
})();
