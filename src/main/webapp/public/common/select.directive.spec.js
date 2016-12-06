describe('Select directive', function() {

    'use strict';

    var $compile, $rootScope;

    beforeEach(function() {
        module('openlmis-templates');
    });

    beforeEach(module('openlmis-core'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should call select2 when element is compiled', function(){
    	
    	var scope = $rootScope.$new();
    	var element = $compile('<select ng-model="foo"></select>')(scope);

    });

    it('will disable element if single option and set value', function(){

    });

    it('will show empty element', function(){

    });

});
