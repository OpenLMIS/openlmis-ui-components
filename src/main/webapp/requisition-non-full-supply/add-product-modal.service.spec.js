describe('addProductModalService', function() {

    var addProductModalService, $q, $ngBootbox, $rootScope, $compileMock, $controllerMock,
        $templateRequestMock, compiledMock, template;

    beforeEach(function() {
        module('requisition-non-full-supply', function($provide) {
            $controllerMock = jasmine.createSpy('$controller');
            $templateRequestMock = jasmine.createSpy('$templateRequestMock');
            $compileMock = jasmine.createSpy('$compile');

            $provide.factory('$controller', function() {
                return $controllerMock;
            });

            $provide.factory('$templateRequest', function() {
                return $templateRequestMock;
            });

            $provide.factory('$compile', function() {
                return $compileMock;
            });
        });

        inject(function($injector) {
            addProductModalService = $injector.get('addProductModalService');
            $q = $injector.get('$q');
            $ngBootbox = $injector.get('$ngBootbox');
            $rootScope = $injector.get('$rootScope');
        });

        template = 'template';
        compiledMock = jasmine.createSpy('compiled');

        $templateRequestMock.andReturn($q.when(template));
        $compileMock.andReturn(compiledMock);

        spyOn($ngBootbox, 'customDialog');
    });

    it('show should should spawn new controller', function() {
        addProductModalService.show();

        expect($controllerMock).toHaveBeenCalled();
    });

    it('show should request template', function() {
        addProductModalService.show();

        expect($templateRequestMock).toHaveBeenCalled();
    });

    it('show should compile template', function() {
        var scope = {};
        spyOn($rootScope, '$new').andReturn(scope);

        addProductModalService.show();
        $rootScope.$apply();

        expect($compileMock).toHaveBeenCalledWith(angular.element(template));
        expect(compiledMock).toHaveBeenCalledWith(scope);
    });

    it('show should open modal', function() {
        addProductModalService.show();
        $rootScope.$apply();

        expect($ngBootbox.customDialog).toHaveBeenCalled();
    });

});
