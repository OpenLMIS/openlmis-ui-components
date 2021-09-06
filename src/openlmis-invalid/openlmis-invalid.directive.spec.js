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

    var messagesObj;

    beforeEach(function() {
        module('openlmis-invalid');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$compile = $injector.get('$compile');
        });

        var markup = '<div openlmis-invalid="{{invalidMessage}}" ></div>';

        this.scope = this.$rootScope.$new();
        this.element = this.$compile(markup)(this.scope);

        var invalidCtrl = this.element.controller('openlmisInvalid');

        messagesObj = {};

        spyOn(invalidCtrl, 'getMessages').and.callFake(function() {
            return messagesObj;
        });

        this.scope.$apply();
    });

    it('adds error message element when openlmis-invalid is set and not empty', function() {
        expect(this.element.children().length).toBe(0);

        this.scope.invalidMessage = 'Sample message';
        this.scope.$apply();

        expect(this.element.children().length).toBe(1);
        expect(this.element.text().indexOf('Sample message')).not.toBe(-1);

        this.scope.invalidMessage = '';
        this.scope.$apply();

        expect(this.element.children().length).toBe(0);
    });

    it('adds an error message if OpenlmisInvalidController returns any messages', function() {
        messagesObj = {
            test: 'Sample message'
        };
        this.scope.$apply();

        expect(this.element.children().length).toBe(1);
        expect(this.element.text().indexOf('Sample message')).not.toBe(-1);
    });

    it('combines error messages from OpenlmisInvalidController and openlmis-invalid attribute', function() {
        this.scope.invalidMessage = 'OpenLMIS Invalid Message';
        messagesObj = {
            test: 'Other example message'
        };
        this.scope.$apply();

        expect(this.element.children().length).toBe(1);
        expect(this.element.text().indexOf('Other example message')).not.toBe(-1);
        expect(this.element.text().indexOf('OpenLMIS Invalid Message')).not.toBe(-1);
    });

    it('removes the error element when there are no messages available', function() {
        messagesObj = {
            test: 'Sample message'
        };
        this.scope.$apply();

        expect(this.element.children().length).toBe(1);

        messagesObj = {};
        this.scope.$apply();

        expect(this.element.children().length).toBe(0);
    });

    it('will not show an error element if openlmisInvalidController isHidden is true', function() {
        var invalidCtrl = this.element.controller('openlmisInvalid');
        spyOn(invalidCtrl, 'isHidden').and.returnValue(true);

        messagesObj = {
            test: 'Sample message'
        };
        this.scope.$apply();

        expect(this.element.children().length).toBe(0);
    });

    it('triggers openlmisInvalid.show and openlmisInvalid.hide with the messageElement', function() {
        var hideEvent = false,
            showEvent = false,
            messageElement = false;

        // Remaking element because something gets lost with test suite...
        this.scope = this.$rootScope.$new();
        this.scope.message = 'Example';
        this.element = this.$compile('<p openlmis-invalid="{{message}}">Stuff</p>')(this.scope);

        this.element.on('openlmisInvalid.show', function(event, el) {
            showEvent = true;
            messageElement = el;
        });

        this.element.on('openlmisInvalid.hide', function() {
            hideEvent = true;
        });

        this.scope.$apply();

        expect(showEvent).toBe(true);

        expect(messageElement).not.toBeFalsy();
        expect(messageElement.text().indexOf('Example')).not.toBe(-1);

        this.scope.message = false;
        this.scope.$apply();

        expect(hideEvent).toBe(true);
    });

    it('will not place message element if openlmisInvalid.show is canceled', function() {
        this.scope = this.$rootScope.$new();

        this.element = angular.element('<p openlmis-invalid="Example">Stuff</p>');

        // To stop applying an invalid element, you must place a listener on
        // the scope BEFORE openlmis-invalid directive is run.
        this.element.on('openlmisInvalid.show', function(event) {
            event.preventDefault();
        });

        this.$compile(this.element)(this.scope);
        this.scope.$apply();

        expect(this.element.text().indexOf('Example')).toBe(-1);
    });

});

