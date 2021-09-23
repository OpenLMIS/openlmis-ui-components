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

describe('LocalDatabase', function() {

    beforeEach(function() {
        module('openlmis-database');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.PouchDB = $injector.get('PouchDB');
            this.$q = $injector.get('$q');
            this.PouchDBWrapper = $injector.get('PouchDBWrapper');
        });

        spyOn(this.PouchDB.prototype, 'put');
        spyOn(this.PouchDB.prototype, 'get');
        spyOn(this.PouchDB.prototype, 'info');
        spyOn(this.PouchDB.prototype, 'remove');
        spyOn(this.PouchDB.prototype, 'allDocs');
        spyOn(this.PouchDB.prototype, 'destroy');
        spyOn(this.PouchDB.prototype, 'bulkDocs');
        spyOn(this.$q, 'when');

        this.databaseWrapper = new this.PouchDBWrapper('testDatabase');
    });

    describe('get', function() {

        it('should wrap PouchDB get', function() {
            var promise = this.$q.resolve(),
                //eslint-disable-next-line no-undef
                jsPromise = new Promise(function() {}),
                id = 'some-id';

            this.$q.when.andReturn(promise);
            this.PouchDB.prototype.get.andReturn(jsPromise);

            var result = this.databaseWrapper.get(id);

            expect(result).toBe(promise);
            expect(this.$q.when).toHaveBeenCalledWith(jsPromise);
            expect(this.PouchDB.prototype.get).toHaveBeenCalledWith(id);
        });

    });

    describe('put', function() {

        it('should wrap PouchDB put', function() {
            var promise = this.$q.resolve(),
                //eslint-disable-next-line no-undef
                jsPromise = new Promise(function() {}),
                doc = {
                    _id: 'some-id'
                };

            this.$q.when.andReturn(promise);
            this.PouchDB.prototype.put.andReturn(jsPromise);

            var result = this.databaseWrapper.put(doc);

            expect(result).toBe(promise);
            expect(this.$q.when).toHaveBeenCalledWith(jsPromise);
            expect(this.PouchDB.prototype.put).toHaveBeenCalledWith(doc);
        });

    });

    describe('info', function() {

        it('should wrap PouchDB get', function() {
            var promise = this.$q.resolve(),
                //eslint-disable-next-line no-undef
                jsPromise = new Promise(function() {});

            this.$q.when.andReturn(promise);
            this.PouchDB.prototype.info.andReturn(jsPromise);

            var result = this.databaseWrapper.info();

            expect(result).toBe(promise);
            expect(this.$q.when).toHaveBeenCalledWith(jsPromise);
            expect(this.PouchDB.prototype.info).toHaveBeenCalled();
        });

    });

    describe('remove', function() {

        it('should wrap PouchDB remove', function() {
            var promise = this.$q.resolve(),
                //eslint-disable-next-line no-undef
                jsPromise = new Promise(function() {}),
                id = 'some-id',
                rev = 'some-rev-id';

            this.$q.when.andReturn(promise);
            this.PouchDB.prototype.remove.andReturn(jsPromise);

            var result = this.databaseWrapper.remove(id, rev);

            expect(result).toBe(promise);
            expect(this.$q.when).toHaveBeenCalledWith(jsPromise);
            expect(this.PouchDB.prototype.remove).toHaveBeenCalledWith(id, rev);
        });

    });

    describe('destroy', function() {

        it('should wrap PouchDB destroy', function() {
            var promise = this.$q.resolve(),
                //eslint-disable-next-line no-undef
                jsPromise = new Promise(function() {});

            this.$q.when.andReturn(promise);
            this.PouchDB.prototype.destroy.andReturn(jsPromise);

            var result = this.databaseWrapper.destroy();

            expect(result).toBe(promise);
            expect(this.$q.when).toHaveBeenCalledWith(jsPromise);
            expect(this.PouchDB.prototype.destroy).toHaveBeenCalled();
        });

    });

    describe('allDocs', function() {

        it('should wrap PouchDB allDocs', function() {
            var promise = this.$q.resolve(),
                //eslint-disable-next-line no-undef
                jsPromise = new Promise(function() {});

            this.$q.when.andReturn(promise);
            this.PouchDB.prototype.allDocs.andReturn(jsPromise);

            var result = this.databaseWrapper.allDocs();

            expect(result).toBe(promise);
            expect(this.$q.when).toHaveBeenCalledWith(jsPromise);
            expect(this.PouchDB.prototype.allDocs).toHaveBeenCalled();
        });

    });

    describe('bulkDocs', function() {

        it('should wrap PouchDB bulkDocs', function() {
            var promise = this.$q.resolve(),
                //eslint-disable-next-line no-undef
                jsPromise = new Promise(function() {}),
                docs = [{
                    _id: 'some-id'
                }];

            this.$q.when.andReturn(promise);
            this.PouchDB.prototype.bulkDocs.andReturn(jsPromise);

            var result = this.databaseWrapper.bulkDocs(docs);

            expect(result).toBe(promise);
            expect(this.$q.when).toHaveBeenCalledWith(jsPromise);
            expect(this.PouchDB.prototype.bulkDocs).toHaveBeenCalledWith(docs);
        });

    });

});