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


describe("PopoverDirective", function () {
    var scope, $httpBackend, element, popover, jQuery;

    beforeEach(module('openlmis-popover'));
    beforeEach(module('openlmis-templates'));

    beforeEach(inject(function(_jQuery_){
        jQuery = _jQuery_;
        spyOn(jQuery.prototype, 'popover').andCallThrough();
    }));

    beforeEach(inject(function($rootScope, _$httpBackend_){
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
    }));


    describe('popover', function(){

        beforeEach(inject(function($compile, $rootScope){
            scope = $rootScope.$new();

            scope.popoverText = "Sample popover";
            scope.popoverTitle = "Popover Title";
            scope.popoverClass = "example-class";

            var html = '<div popover="{{popoverText}}" popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}" >... other stuff ....</div>';
            element = $compile(html)(scope);

            $rootScope.$apply();

            popover = jQuery.prototype.popover.mostRecentCall.args[0].template;
        }));

        it('adds a popover when the popover directive is added', function(){
            expect(jQuery.prototype.popover).toHaveBeenCalled();
        });

        it('removes the popover when the string is empty', function(){
            scope.popoverText = '';
            scope.$apply();

            expect(jQuery.prototype.popover).toHaveBeenCalledWith('destroy');
        });

        it('has a custom css class attribute, which will updated', function(){
            expect(popover.hasClass('example-class')).toBe(true);

            scope.popoverClass = 'is-error';
            scope.$apply();
            
            expect(popover.hasClass('example-class')).toBe(false);
            expect(popover.hasClass('is-error')).toBe(true);            
        });

        it('allows the title element to be updated', function(){
            expect(popover.children('h3').text()).toBe('Popover Title');

            scope.popoverTitle = 'Example Title';
            scope.$apply();

            expect(popover.children('h3').text()).toBe('Example Title');
        });

        it('hides the title element when there is no title', function(){
            scope.popoverTitle = '';
            scope.$apply();

            expect(popover.children('h3').length).toBe(0);
        });

        it('appends a button element to elements that wouldnt have a click action', function(){
            expect(element.children('.show-popover').length).toBe(1);
        });

    });

    describe('element like buttons', function(){
        var buttonElement;

        beforeEach(inject(function($compile, $rootScope){
            scope = $rootScope.$new();

            var html = '<button popover="Popover">Do Something</button>';
            element = $compile(html)(scope);

            $rootScope.$apply();
        }));

        it('do not append a button', function(){
            expect(element.children('.show-popover').length).toBe(0);
        });

        it('do not have click trigger', function(){
            var triggers = jQuery.prototype.popover.mostRecentCall.args[0].trigger;
            expect(triggers.indexOf('click')).toBe(-1);
        });

    });

    describe('popoverTemplate', function(){
        var content; // Reference to the compiled content....

        beforeEach(inject(function($compile, $rootScope, $templateCache){
            $templateCache.put('example/popover-content.html', '<div><p>Button clicked {{counter}} times</p><button ng-click="incCounter()">Click Me!</button></div>');
            $templateCache.put('example/other-popover.html', '<p>Counted {{counter}} clicks</p>');

            scope = $rootScope.$new();

            scope.counter=2;
            scope.incCounter = function(){
                scope.counter++;
            }

            scope.templatePath = 'example/popover-content.html';

            var html = '<div popover popover-template="{{templatePath}}" ></div>';
            element = $compile(html)(scope);

            $rootScope.$apply();

            content = jQuery.prototype.popover.mostRecentCall.args[0].content;
        }));

        it('renders a template in the elements scope', function(){
            expect(content.children('p').text()).toBe('Button clicked 2 times');

            content.children('button').click();
            scope.$apply();

            expect(content.children('p').text()).toBe('Button clicked 3 times');            
        });

        it('allows the template to be changed', function(){
            scope.templatePath = 'example/other-popover.html';

            scope.$apply();

            // Grab content again
            content = jQuery.prototype.popover.mostRecentCall.args[0].content;

            expect(content.text()).toBe('Counted 2 clicks');
        });
    });

});
