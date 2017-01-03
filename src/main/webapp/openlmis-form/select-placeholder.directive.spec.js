describe('Select directive', function() {

    'use strict';

    var $compile, scope;

    beforeEach(function() {
        module('openlmis-templates');
    });

    beforeEach(module('openlmis-form'));

    beforeEach(inject(function(_$compile_, $rootScope){
        $compile = _$compile_;

        scope = $rootScope.$new();
    }));

    function makeElement(string){
        var element = $compile(string)(scope);
        scope.$apply();
        return element;
    }

    it('shows placeholder attribute as first option', function(){
        scope.options = [];
        var element = makeElement(
            '<select></select>'
            );

        var firstOption = element.children('option:first');
        expect(firstOption.hasClass('placeholder')).toBe(true);
        expect(firstOption.text()).toBe('select.placeholder.default');
    });

    it('reads the placeholder value of an element', function(){
       scope.options = [];
        var element = makeElement(
            '<select placeholder="something"></select>'
            );

        expect(element.children('option.placeholder').text()).toBe('something');
    });

    it("won't overwrite a placeholder that is set as an option", function(){
       var element = makeElement(
            '<select placeholder="something">'
            + '<option value="">My Placeholder</option>'
            + '</select>'
            );

        expect(element.children('option.placeholder').text()).toBe('My Placeholder');
    });

    it("will hide the placeholder when a value is selected, and show a clear link", function(){
        // manually rendering form because ngModel wouldn't initialize right (maybe)
        var form = makeElement(
            '<form><select >' 
            + '<option selected="selected">foo</option>' 
            + '<option>bar</option>'
            + '</select></form>'
            );
        var select = angular.element(form.children('select')[0]);

        expect(select.children('option.placeholder').length).toBe(0);
        expect(form.children('a.clear').length).toBe(1);
    });

    it("will show the placeholder and set ngModel to undefined, when the clear link is clicked", function(){
        // manually rendering form because ngModel wouldn't initialize right (maybe)
        var form = makeElement(
            '<form><select >' 
            + '<option selected="selected">foo</option>' 
            + '<option>bar</option>'
            + '</select></form>'
            );
        var select = angular.element(form.children('select')[0]);

        form.children('a.clear').click();
        scope.$apply();

        expect(select.children('option.placeholder').length).toBe(1);
        expect(form.children('a.clear').length).toBe(0);
    });

    it("will not use a placeholder when no-placeholder is set", function(){
        var element = makeElement(
            '<select no-placeholder>'
            + '<option value="1">First element</option>'
            + '<option value="2">Second element</option>'
            + '</select>'
            );

        expect(element.children('option:first').text()).toBe('First element');
    });

});
