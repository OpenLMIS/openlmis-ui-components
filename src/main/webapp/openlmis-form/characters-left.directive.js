(function() {

	'use strict';

	/**
     * @ngdoc directive
     * @name openlmis-form.charactersLeft
     *
     * @description
     * Provides characters left indicator under input.
     * If max characters count is reached indicator text will turn red.
     */
	angular
		.module('openlmis-form')
		.directive('charactersLeft', directive);

	directive.$inject = ['$templateRequest', '$compile'];

	function directive($templateRequest, $compile) {
		return {
			restrict: 'A',
            require: 'ngModel',
            scope: {
                maxLength: '='
            },
            link: link
		};

        function link(scope, element, attrs, ngModelController) {

			$templateRequest('openlmis-form/characters-left.html').then(function(template) {
				if (element.next().length) {
	                element.next().insertBefore($compile(template)(scope));
	            } else {
					element.parent().append($compile(template)(scope));
				}
			});

			scope.$watch(function() {
                scope.text = ngModelController.$modelValue;
            });
        }
	}

})();
