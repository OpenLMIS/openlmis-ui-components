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

    beforeEach(function() {
        module('openlmis-pagination');
        module('openlmis-repository');

        inject(function($injector) {
            this.OpenlmisRepository = $injector.get('OpenlmisRepository');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.object = {
            id: 'some-id'
        };

        this.objectTwo = {
            id: 'some-other-id'
        };

        this.page = new this.PageDataBuilder()
            .withContent([
                this.object,
                this.objectTwo
            ])
            .build();

        var context = this;
        this.impl = jasmine.createSpyObj('RepositoryImpl', ['create', 'get', 'update', 'query']);
        this.impl.create.and.callFake(function(param) {
            return context.$q.resolve(param);
        });
        this.impl.get.and.callFake(function(id) {
            if (id === context.object.id) {
                return context.$q.resolve(context.object);
            }
            return context.$q.reject();
        });
        this.impl.update.and.callFake(function(param) {
            param.name = 'some-name';
            return context.$q.resolve(param);
        });
        this.impl.query.and.callFake(function() {
            return context.$q.resolve(context.page);
        });

        this.repository = new this.OpenlmisRepository(DomainClass, this.impl);
    });

    describe('constructor', function() {

        it('should expose class', function() {
            expect(this.repository.class).toEqual(DomainClass);
        });

        it('should expose repository implementation', function() {
            expect(this.repository.impl).toEqual(this.impl);
        });
    });

    describe('create', function() {

        var result;

        beforeEach(function() {
            this.repository.create(this.object)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();
        });

        it('should call impl create method', function() {
            expect(this.impl.create).toHaveBeenCalledWith(this.object);
        });

        it('should call constructor', function() {
            expect(result.object).toEqual(this.object);
            expect(result.repository).toEqual(this.repository);
        });
    });

    describe('get', function() {

        var result;

        beforeEach(function() {
            this.repository.get(this.object.id)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();
        });

        it('should call impl get method', function() {
            expect(this.impl.get).toHaveBeenCalledWith(this.object.id);
        });

        it('should call constructor', function() {
            expect(result.object).toEqual(this.object);
            expect(result.repository).toEqual(this.repository);
        });
    });

    describe('update', function() {

        var result;

        beforeEach(function() {
            this.repository.update(this.object)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();
        });

        it('should call impl get', function() {
            expect(this.impl.update).toHaveBeenCalledWith(this.object);
        });

        it('should return updated object', function() {
            expect(result.name).toEqual('some-name');
        });
    });

    describe('query', function() {

        var params, result;

        beforeEach(function() {
            params = {
                paramOne: 'valueOne',
                paramTwo: 'valueTwo'
            };

            this.repository.query(params)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();
        });

        it('should call impl query', function() {
            expect(this.impl.query).toHaveBeenCalledWith(params);
        });

        it('should return page', function() {
            expect(result).toEqual(this.page);
        });

    });

    function DomainClass(object, repository) {
        this.object = object;
        this.repository = repository;
    }
});
