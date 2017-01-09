describe('accessTokenProvider', function() {

    var provider, authorizationServiceMock;

    describe('request', function() {

        var config, accessTokenFactoryMock, openlmisUrlServiceMock, authorizationServiceMock;

        beforeEach(function() {
            module('openlmis-auth', function($provide) {
                accessTokenFactoryMock = mockAccessTokenFactory($provide);
                openlmisUrlServiceMock = mockOpenlmisUrlService($provide);
                authorizationServiceMock = mockAuthorizationServiceMock($provide);
            });

            inject(function(accessTokenProvider) {
                provider = accessTokenProvider;
            });

            openlmisUrlServiceMock.check.andReturn(true);
            authorizationServiceMock.isAuthenticated.andReturn(true);

            config = {
                url: 'some.url'
            };
        });

        it('should append token', function() {
            var result = provider.request(config);

            expect(result.url).toEqual('some.url&access_token=SoMeAcCeSsToKeN');
        });

        it('should not append token if requesting html file', function() {
            config.url = 'some.html';

            var result = provider.request(config);

            expect(result.url).toEqual('some.html');
        });

        it('should not append token if user is not authenticated', function() {
            authorizationServiceMock.isAuthenticated.andReturn(false);

            var result = provider.request(config);

            expect(result.url).toEqual('some.url');
        });

        it('should check if user is authenticated', function() {
            provider.request(config);

            expect(authorizationServiceMock.isAuthenticated).toHaveBeenCalled();
        });

        it('should check if url should not be bypassed', function() {
            provider.request(config);

            expect(openlmisUrlServiceMock.check).toHaveBeenCalledWith('some.url');
        });

    });

    describe('responseError', function() {

        var response, $q, $injector;

        beforeEach(function() {
            module('openlmis-auth', function($provide) {
                authorizationServiceMock = mockAuthorizationServiceMock($provide);
            });

            inject(function(accessTokenProvider, _$q_, _$injector_) {
                provider = accessTokenProvider;
                $q = _$q_;
                $injector = _$injector_;
            });

            alertMock = mockAlert();
            spyOn($injector, 'get').andCallFake(function(name) {
                if (name === 'Alert') return alertMock;
            })

            response = {};
        });

        describe('on 401 status', function() {

            beforeEach(function() {
                response.status = 401;

                provider.responseError(response);
            });

            it('should clear access token', function() {
                expect(authorizationServiceMock.clearAccessToken).toHaveBeenCalled();
            });

            it ('should clear user', function() {
                expect(authorizationServiceMock.clearUser).toHaveBeenCalled();
            });

            it('should clear rights', function() {
                expect(authorizationServiceMock.clearRights).toHaveBeenCalled();
            });

        });

        it('should show error.atuhorization alert on 403 status', function() {
            response.status = 403;

            provider.responseError(response);

            expect(alertMock.error).toHaveBeenCalledWith('error.authorization');
        });

        it('should show msg.server.error alert on 500 status', function() {
            response.status = 500;

            provider.responseError(response);

            expect(alertMock.error).toHaveBeenCalledWith('msg.server.error');
        });

        it('should reject response', function() {
            spyOn($q, 'reject').andCallThrough();

            provider.responseError(response);

            expect($q.reject).toHaveBeenCalledWith(response);
        });

    });

    function mockAccessTokenFactory($provide) {
        var accessTokenFactoryMock = jasmine.createSpyObj('accessTokenFactory', ['addAccessToken']);
        accessTokenFactoryMock.addAccessToken.andCallFake(function(url) {
            return url + '&access_token=SoMeAcCeSsToKeN';
        });
        $provide.factory('accessTokenFactory', function() {
            return accessTokenFactoryMock;
        });
        return accessTokenFactoryMock;
    }

    function mockOpenlmisUrlService($provide) {
        var openlmisUrlServiceMock = jasmine.createSpyObj('openlmisUrlService', ['check']);
        $provide.factory('OpenlmisURLService', function() {
            return openlmisUrlServiceMock;
        });
        return openlmisUrlServiceMock;
    }

    function mockAuthorizationServiceMock($provide) {
        var authorizationServiceMock = jasmine.createSpyObj('authorizationService', [
            'isAuthenticated', 'clearAccessToken', 'clearUser', 'clearRights'
        ]);
        $provide.factory('authorizationService', function() {
            return authorizationServiceMock;
        });
        return authorizationServiceMock;
    }

    function mockAlert() {
        return jasmine.createSpyObj('Alert', ['error']);
    }

});
