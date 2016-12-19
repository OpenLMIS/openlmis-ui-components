/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

//  Description:
//  Extend ngRequired by inserting required span into element's label

app.directive('ngRequired', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      var label = elm.siblings("label[for=" + attrs.id + "]");
      if (label.length !== 0) {
          attrs.$observe('required', function(isRequired) {
            if (isRequired) {
              if (label.find('span.required').length === 0) {
                  var requiredLabel = angular.element('<span class="required"> *</span>');
                  requiredLabel.append(
                    angular.element('<span openlmis-message="label.required" class="visuallyhidden"></span>'));
                  label.append(requiredLabel);
                  $compile(requiredLabel)(scope);
              }
            } else {
              label.remove("span.required");
            }
          });
      }
    }
  };
});
