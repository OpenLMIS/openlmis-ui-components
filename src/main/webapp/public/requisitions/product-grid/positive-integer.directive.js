(function() {

  'use strict';

  angular
    .module('openlmis.requisitions')
    .directive('positiveInteger', positiveInteger);

  function positiveInteger() {
    var directive = {
      require: 'ngModel',
      link: link
    };
    return directive;

    function link(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (inputValue) {

        if (inputValue == undefined) return '' 
        var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
        if (transformedInput!=inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }         

        return transformedInput ? parseInt(transformedInput) : null;
      });
    }
  }
})();