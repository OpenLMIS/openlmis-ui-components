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
                maxLength: '=',
				text: '=ngModel'
            },
            link: link
		};

        function link(scope, element, attributes, ngModelController) {

			var content;

			element.on('focus', function() {
				$templateRequest('openlmis-form/characters-left.html').then(function(template) {
					content = $compile(template)(scope);
					if (element.next().length) {
		                element.next().insertBefore(content);
		            } else {
						element.parent().append(content);
					}
				});
			});

			element.on('blur', function() {
				if(content) content.remove();
				content = null;
			});
        }
	}

})();
