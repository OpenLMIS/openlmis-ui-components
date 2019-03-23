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

describe('openlmis-invalid directive', function() {
    var element, scope, messagesObj, $compile, $rootScope;

    beforeEach(function() {
        module('openlmis-templates');
        module('openlmis-invalid');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
        });

        var markup = '<div openlmis-invalid="{{invalidMessage}}" ></div>';

        scope = $rootScope.$new();
        element = $compile(markup)(scope);

        var invalidCtrl = element.controller('openlmisInvalid');

        spyOn(invalidCtrl, 'getMessages').and.callFake(function() {
            return messagesObj;
        });

        scope.$apply();

        angular.element('body').append(element);
    });

    it('adds error message element when openlmis-invalid is set and not empty', function() {
        expect(element.children().length).toBe(0);

        scope.invalidMessage = 'Invalid message';
        scope.$apply();

        expect(element.children().length).toBe(1);
        expect(element.text().indexOf('Invalid message')).not.toBe(-1);

        scope.invalidMessage = '';
        scope.$apply();

        expect(element.children().length).toBe(0);
    });

    it('adds an error message if OpenlmisInvalidController returns any messages', function() {
        messagesObj = {
            test: 'Sample message'
        };
        scope.$apply();

        expect(element.children().length).toBe(1);
        expect(element.text().indexOf('Sample message')).not.toBe(-1);
    });

    it('combines error messages from OpenlmisInvalidController and openlmis-invalid attribute', function() {
        scope.invalidMessage = 'OpenLMIS Invalid Message';
        messagesObj = {
            test: 'Other example message'
        };
        scope.$apply();

        expect(element.children().length).toBe(1);
        expect(element.text().indexOf('Other example message')).not.toBe(-1);
        expect(element.text().indexOf('OpenLMIS Invalid Message')).not.toBe(-1);
    });

    it('removes the error element when there are no messages available', function() {
        messagesObj = {
            test: 'Sample message'
        };
        scope.$apply();

        expect(element.children().length).toBe(1);

        messagesObj = {};
        scope.$apply();

        expect(element.children().length).toBe(0);
    });

    it('will not show an error element if openlmisInvalidController isHidden is true', function() {
        var invalidCtrl = element.controller('openlmisInvalid');
        spyOn(invalidCtrl, 'isHidden').and.returnValue(true);

        messagesObj = {
            test: 'Sample message'
        };
        scope.$apply();

        expect(element.children().length).toBe(0);
    });

    it('triggers openlmisInvalid.show and openlmisInvalid.hide with the messageElement', function() {
        var hideEvent = false,
            showEvent = false,
            messageElement = false;

        // Remaking element because something gets lost with test suite...
        scope = $rootScope.$new();
        scope.message = 'Example';
        element = $compile('<p openlmis-invalid="{{message}}">Stuff</p>')(scope);

        element.on('openlmisInvalid.show', function(event, el) {
            showEvent = true;
            messageElement = el;
        });

        element.on('openlmisInvalid.hide', function() {
            hideEvent = true;
        });

        scope.$apply();

        expect(showEvent).toBe(true);

        expect(messageElement).not.toBeFalsy();
        expect(messageElement.text().indexOf('Example')).not.toBe(-1);

        scope.message = false;
        scope.$apply();

        expect(hideEvent).toBe(true);
    });

    it('will not place message element if openlmisInvalid.show is canceled', function() {
        scope = $rootScope.$new();

        element = angular.element('<p openlmis-invalid="Example">Stuff</p>');

        // To stop applying an invalid element, you must place a listener on
        // the scope BEFORE openlmis-invalid directive is run.
        element.on('openlmisInvalid.show', function(event) {
            event.preventDefault();
        });

        $compile(element)(scope);
        scope.$apply();

        expect(element.text().indexOf('Example')).toBe(-1);
    });

});

