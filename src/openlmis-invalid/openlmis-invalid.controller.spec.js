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

describe('OpenlmisInvalidController', function(){
    var vm, messageService;

    beforeEach(module('openlmis-invalid'));

    beforeEach(inject(function($controller, _messageService_) {
        messageService = _messageService_;
        spyOn(messageService, 'get').andReturn('parsed message');

        vm = $controller('OpenlmisInvalidController');
    }));

    it('allows message objects to be get and set', function(){
        vm.setMessages({
            'foo': 'bar',
            'test': true
        });

        var messages = vm.getMessages();
        expect(Object.keys(messages).length).toBe(2);
        expect(Object.keys(messages)).toContain('foo');
        expect(Object.keys(messages)).toContain('test');
    });

    it('can reset the message object', function(){
        vm.setMessages({
            test: true
        });
        expect(Object.keys(vm.getMessages())).toContain('test');

        vm.resetMessages();

        expect(Object.keys(vm.getMessages()).length).toBe(0);
    });

    it('will get messageService values for message keys with a boolean value', function(){
        vm.setMessages({
            'foo': 'bar',
            'test': true
        });

        var messages = vm.getMessages();

        expect(messages.foo).toBe('bar');
        expect(messages.test).toBe('parsed message');
    });

    it('will attempt to get a openlmisInvalid-prefixed message key', function(){
        vm.setMessages({
            'test': true
        });

        expect(messageService.get).toHaveBeenCalledWith('openlmisInvalid.test');
    });

    it('starts elements with not hidden', function(){
        expect(vm.isHidden()).toBe(false);
    });

    it('can suppress an elements messages, even if the elements messages are shown', function(){
        vm.suppress();

        vm.setMessages({
            'test': 'test'
        });

        expect(vm.isSuppressed()).toBe(true);
        expect(vm.isHidden()).toBe(true);

        vm.show();
        expect(vm.isHidden()).toBe(true);
    });

    describe('inherits state', function(){
        var child;

        beforeEach(inject(function($controller) {
            child = $controller('OpenlmisInvalidController');
        }));

        it('merges child messages into parent messages', function(){
            vm.registerController(child);

            vm.setMessages({
                'test': '123',
                'foo': 'bar'
            });

            child.setMessages({
                'test': '456',
                'example': 'example'
            });

            expect(vm.getMessages()).toEqual({
                'test': '123', // parent overwrites child
                'foo': 'bar',
                'example': 'example' // new child value is added
            })
        });

        it('makes the childs state the same as the partent', function(){
            expect(vm.isHidden()).toBe(false);
            expect(child.isHidden()).toBe(false);

            vm.hide();

            expect(vm.isHidden()).toBe(true);
            expect(child.isHidden()).toBe(false);

            vm.registerController(child);
            expect(child.isHidden()).toBe(true);
        });

        it('updates childs state when parents state is changed', function(){
            vm.registerController(child);

            expect(vm.isHidden()).toBe(false);
            expect(child.isHidden()).toBe(false);

            vm.hide();

            expect(vm.isHidden()).toBe(true);
            expect(child.isHidden()).toBe(true);

            vm.show();

            expect(vm.isHidden()).toBe(false);
            expect(child.isHidden()).toBe(false);

            expect(vm.isSuppressed()).toBe(false);
            expect(child.isSuppressed()).toBe(false);

            vm.suppress();

            expect(vm.isSuppressed()).toBe(true);
            expect(child.isSuppressed()).toBe(true); 
            
            expect(child.isHidden()).toBe(true);           
        });
    });
});
