/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe('openlmis-invalid directive', function(){
    var element, scope, messagesObj;

    beforeEach(module('openlmis-templates'));
    beforeEach(module('openlmis-form', function($controllerProvider){
        messagesObj = {};
        $controllerProvider.register('OpenlmisInvalidController', function(){
            return {
                getMessages: function(){
                    return messagesObj;
                }
            }
        });
    }));

    beforeEach(inject(function($compile, $rootScope){
        var markup = '<div openlmis-invalid="{{invalidMessage}}" ></div>';

        scope = $rootScope.$new();
        element = $compile(markup)(scope);
        scope.$apply();

        angular.element('body').append(element);
    }));

    it('adds error message element when openlmis-invalid is set and not empty', function(){
        // There shouldn't be an error element
        expect(element.children().length).toBe(0);

        scope.invalidMessage = "Sample message";
        scope.$apply();

        expect(element.children().length).toBe(1);
        expect(element.text().indexOf('Sample message')).not.toBe(-1);

        scope.invalidMessage = "";
        scope.$apply();

        expect(element.children().length).toBe(0);
    });

    it('adds an error message if OpenlmisInvalidController returns any messages', function(){
        messagesObj = {
            test: 'Sample message'
        };
        scope.$apply();

        expect(element.children().length).toBe(1);
        expect(element.text().indexOf('Sample message')).not.toBe(-1);    
    });

    it('combines error messages from OpenlmisInvalidController and openlmis-invalid attribute', function(){
        scope.invalidMessage = 'OpenLMIS Invalid Message';
        messagesObj = {
            test: 'Other example message'
        }
        scope.$apply();

        expect(element.children().length).toBe(1);
        expect(element.text().indexOf('Other example message')).not.toBe(-1);
        expect(element.text().indexOf('OpenLMIS Invalid Message')).not.toBe(-1);
    });

    it('removes the error element when there are no messages available', function(){
        messagesObj = {
            test: 'Sample message'
        };
        scope.$apply();

        expect(element.children().length).toBe(1);

        messagesObj = {};
        scope.$apply();

        expect(element.children().length).toBe(0);
    });

    it('will not show an error element if openlmis-invalid-hidden is true', function(){
        element.attr('openlmis-invalid-hidden', true);

        messagesObj = {
            test: 'Sample message'
        };
        scope.$apply();

        expect(element.children().length).toBe(0);
    });

});

