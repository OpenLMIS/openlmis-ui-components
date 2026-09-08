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

describe('MessageService', function() {

    beforeEach(function() {
        module('openlmis-i18n', function($provide) {
            $provide.constant('DEFAULT_LANGUAGE', 'en');

            $provide.constant('OPENLMIS_MESSAGES', {
                en: {
                    'language.name': 'English',
                    sample: 'message',
                    messageWithParam: 'hello ${name}!',
                    messageWithParams: 'Object with id: ${id}, status: ${status}',
                    messageWithParams2: 'Object with id: ${0}, status: ${1}',
                    messageWithEmptyParam: 'value: [${value}]'
                },
                test: {
                    'language.name': 'Test',
                    sample: 'foo'
                }
            });
        });

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.messageService = $injector.get('messageService');
            this.localStorageService = $injector.get('localStorageService');
        });

        spyOn(this.localStorageService, 'get').andReturn('en');
        spyOn(this.localStorageService, 'add');
        spyOn(this.$rootScope, '$broadcast');
    });

    it('loads a default language when populated without any parameters', function() {
        this.messageService.populate();

        expect(this.localStorageService.add).toHaveBeenCalledWith('current_locale', 'en');
    });

    it('returns existing translation', function() {
        expect(this.messageService.get('sample')).toBe('message');
    });

    it('returns the message string when a translation doesn\'t exist', function() {
        expect(this.messageService.get('foobar')).toBe('foobar');
    });

    it('returns the message string with parameter', function() {
        var person = {
            name: 'Jane'
        };
        var expected = 'hello Jane!';

        expect(this.messageService.get('messageWithParam', person)).toBe(expected);
    });

    /**
     * A key naming a parameter the caller did not pass used to render the string "undefined" at the
     * user. Leaving the placeholder keeps it diagnosable, and matches what passing no parameters does.
     */
    it('leaves a placeholder alone when its parameter was not passed', function() {
        expect(this.messageService.get('messageWithParams', {
            id: '123'
        })).toBe('Object with id: 123, status: ${status}');
    });

    /**
     * The same outcome as a parameter that was passed but missing, which is the point: the two ways of
     * not supplying a value now tell the same story. The guard also keeps the substitution from
     * dereferencing nothing.
     */
    it('leaves every placeholder alone when no parameters are passed at all', function() {
        expect(this.messageService.get('messageWithParams'))
            .toBe('Object with id: ${id}, status: ${status}');
    });

    it('leaves a placeholder alone when its parameter is null', function() {
        expect(this.messageService.get('messageWithParam', {
            name: null
        })).toBe('hello ${name}!');
    });

    it('substitutes an empty string, which is a value rather than a missing one', function() {
        expect(this.messageService.get('messageWithEmptyParam', {
            value: ''
        })).toBe('value: []');
    });

    it('substitutes a zero', function() {
        expect(this.messageService.get('messageWithEmptyParam', {
            value: 0
        })).toBe('value: [0]');
    });

    it('returns the message string with multiple parameters', function() {
        var object = {
            id: '123',
            status: 'NEW'
        };
        var expected = 'Object with id: 123, status: NEW';

        expect(this.messageService.get('messageWithParams', object)).toBe(expected);
    });

    it('returns the message string with parameters in array', function() {
        var array = ['123', 'NEW'];
        var expected = 'Object with id: 123, status: NEW';

        expect(this.messageService.get('messageWithParams2', array)).toBe(expected);
    });

    it('can change the current locale', function() {
        this.messageService.populate('test');
        this.localStorageService.get.andReturn('test');

        expect(this.localStorageService.add).toHaveBeenCalledWith('current_locale', 'test');
        expect(this.messageService.get('sample')).toBe('foo');
    });

    it('broadcasts an event when the locale is successfully changed', function() {
        this.messageService.populate('test');

        expect(this.$rootScope.$broadcast).toHaveBeenCalledWith('openlmis.messages.populated');
    });

    it('resolves a promise when the locale is changed', function() {
        var success = false;

        var promise = this.messageService.populate('test');
        promise.then(function() {
            success = true;
        });

        this.$rootScope.$apply();

        expect(success).toBe(true);
    });

    it('rejects the promise when locale isn\'t changed', function() {
        var success = false;

        var promise = this.messageService.populate('foo');
        promise.catch(function() {
            success = true;
        });

        this.$rootScope.$apply();

        expect(success).toBe(true);
    });
});
