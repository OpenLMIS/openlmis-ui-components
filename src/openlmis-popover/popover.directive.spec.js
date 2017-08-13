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


ddescribe("PopoverDirective", function () {
    var scope, $httpBackend, element, popover, popoverCtrl, jQuery, $timeout;

    beforeEach(module('openlmis-popover'));
    beforeEach(module('openlmis-templates'));

    beforeEach(inject(function(_jQuery_){
        jQuery = _jQuery_;
        spyOn(jQuery.prototype, 'popover').andCallThrough();
    }));

    beforeEach(inject(function(_$timeout_){
        $timeout = _$timeout_;
    }));


    describe('popover', function(){

        beforeEach(inject(function($compile, $rootScope){
            scope = $rootScope.$new();

            scope.popoverTitle = "Popover Title";
            scope.popoverClass = "example-class";

            var html = '<div popover popover-title="{{popoverTitle}}" popover-class="{{popoverClass}}" >... other stuff ....</div>';
            element = $compile(html)(scope);

            angular.element('body').append(element);

            popoverCtrl = element.controller('popover');
            spyOn(popoverCtrl, 'getElements').andReturn([angular.element('<p>Hello World!</p>')]);

            scope.$apply();

            popover = jQuery.prototype.popover.mostRecentCall.args[0].template;
        }));

        it('adds a popover when the popover directive is added', function(){
            expect(jQuery.prototype.popover).toHaveBeenCalled();
        });

        it('opens when the element gets focus, and closes when blurred', function(){
            var popoverVisible;
            element.on('show.bs.popover', function(){
                popoverVisible = true;
            });
            element.on('hide.bs.popover', function(){
                popoverVisible = false;
            });

            expect(popoverVisible).toBe(undefined);

            element.focus();
            expect(popoverVisible).toBe(true);

            element.blur();
            $timeout.flush();
            expect(popoverVisible).toBe(false);
        });

        it('opens when the element is moused over, and closes when the mouse moves else where', function(){
            var popoverVisible;
            element.on('show.bs.popover', function(){
                popoverVisible = true;
            });
            element.on('hide.bs.popover', function(){
                popoverVisible = false;
            });

            expect(popoverVisible).toBe(undefined);

            element.mouseover();
            expect(popoverVisible).toBe(true);

            element.mouseout();
            $timeout.flush();
            expect(popoverVisible).toBe(false);
        });

        it('gets popover content from PopoverController', function() {
            var elements = [angular.element('<p>Test</p>')];
            popoverCtrl.getElements.andReturn(elements);

            element.focus();
            expect(popoverCtrl.getElements).toHaveBeenCalled();
            expect(popover.find('.popover-content').text()).toBe('Test');

            element.blur();
            $timeout.flush();

            elements.push(angular.element('<p>Example</p>'));
            element.focus();

            expect(popover.find('.popover-content').text()).toBe('TestExample');
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

    });

});
