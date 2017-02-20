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
                modalTitle = getModalTitle(element),
                modal, modalScope;

            element.off('click');

            element.on('mousedown', function (event) {
                if(isPopOut()) {
                    event.stopPropagation();
                    element.attr('disabled', true);
                    showModal();
                }
            });

            element.bind('keydown', function (event) {
                if(isPopOut() && event.which === 13) {
                    event.stopPropagation();
                    element.attr('disabled', true);
                    showModal();
                }
            });

            element.on('$destroy', function() {
                modal = undefined;
                if (modalScope) modalScope.$destroy();
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
                    if (modalScope) modalScope.$destroy();
                    modalScope = $rootScope.$new();

                    modalScope.options = getOptions();
                    modalScope.select = selectOption;
                    modalScope.findSelectedOption = findSelectedOption;

                    modalScope.findSelectedOption();

                    modal = bootbox.dialog({
                        title: modalTitle,
                        message: $compile(template)(modalScope),
                        backdrop: true,
                        onEscape: closeModal
                    });
                });
            }

            function closeModal() {
                element.attr('disabled', false);
                if (modalScope) modalScope.$destroy();
                if(modal){
                    modal.modal('hide');
                }
            }

            function findSelectedOption() {
                var selectedOption,
                    scope = this;

                angular.forEach(this.options, function(option) {
                    if(option.selected) selectedOption = option;
                });

                this.selected = selectedOption;
            }

            function getOptions() {
                var options = [];

                angular.forEach(element.children('option:not(.placeholder)'), function(option) {
                    options.push(angular.element(option)[0]);
                });

                return options;
            }

            function selectOption(option) {
                element.children('option[selected="selected"]').removeAttr('selected');
                element.children('option[label="' + option.label + '"]').attr('selected', 'selected');

                ngModelCtrl.$setViewValue(selectCtrl.readValue());
                closeModal();
            }

            function isPopOut() {
                return (attrs.popOut !== null && attrs.popOut !== undefined) ||
                    (getOptions().length > 10);
            }

            function getModalTitle(element) {
                var labelElement = element.siblings('label[for="' + element[0].id + '"]');
                return labelElement[0] ? labelElement[0].textContent : '';
            }
        }
    }
})();
