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

describe('OpenlmisRepository', function() {

    var $q, $rootScope, OpenlmisRepository, impl, repository, object;

    beforeEach(function() {
        module('openlmis-repository');

        inject(function($injector) {
            OpenlmisRepository = $injector.get('OpenlmisRepository');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        object = {
            id: 'some-id'
        };
        
        impl = jasmine.createSpyObj('RepositoryImpl', ['create', 'get', 'update']);
        impl.create.andCallFake(function(param) {
            return $q.resolve(param);
        });
        impl.get.andCallFake(function(id) {
            if (id === object.id) {
                return $q.resolve(object);
            }
            return $q.reject();
        });
        impl.update.andCallFake(function(param) {
            param.name = 'some-name';
            return $q.resolve(param);
        });
        
        repository = new OpenlmisRepository(DomainClass, impl);
    });

    describe('constructor', function() {

        it('should expose class', function() {
            expect(repository.class).toEqual(DomainClass);
        });

        it('should expose repository implementation', function() {
            expect(repository.impl).toEqual(impl);
        });
    });

    describe('create', function() {

        var result;

        beforeEach(function() {
            repository.create(object)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();
        });

        it('should call impl create method', function() {
            expect(impl.create).toHaveBeenCalledWith(object);
        });

        it('should call constructor', function() {
            expect(result.object).toEqual(object);
            expect(result.repository).toEqual(repository);
        });
    });

    describe('get', function() {

        var result;

        beforeEach(function() {
            repository.get(object.id)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();
        });

        it('should call impl get method', function() {
            expect(impl.get).toHaveBeenCalledWith(object.id);
        });

        it('should call constructor', function() {
            expect(result.object).toEqual(object);
            expect(result.repository).toEqual(repository);
        });
    });

    describe('update', function() {

        var result;

        beforeEach(function() {
            repository.update(object)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();
        });

        it('should call impl get', function() {
            expect(impl.update).toHaveBeenCalledWith(object);
        });

        it('should return updated object', function() {
            expect(result.name).toEqual('some-name');
        });
    });

    function DomainClass(object, repository) {
        this.object = object;
        this.repository = repository;
    }
});
