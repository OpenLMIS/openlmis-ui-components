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
            this.LocalDatabase = $injector.get('LocalDatabase');
            this.$rootScope = $injector.get('$rootScope');
            this.PouchDBWrapper = $injector.get('PouchDBWrapper');
            this.$q = $injector.get('$q');
        });

        this.database = new this.LocalDatabase('testDatabase');

        spyOn(this.PouchDBWrapper.prototype, 'put');
        spyOn(this.PouchDBWrapper.prototype, 'get');
        spyOn(this.PouchDBWrapper.prototype, 'remove');
        spyOn(this.PouchDBWrapper.prototype, 'allDocs');
        spyOn(this.PouchDBWrapper.prototype, 'destroy');
    });

    describe('put', function() {

        it('should throw exception if object is undefined', function() {
            var database = this.database;

            expect(function() {
                database.put();
            }).toThrow('Object must be defined!');

            expect(function() {
                database.put(null);
            }).toThrow('Object must be defined!');

            expect(function() {
                database.put(undefined);
            }).toThrow('Object must be defined!');
        });

        it('should throw exception if object does not have ID', function() {
            var database = this.database;

            expect(function() {
                database.put({});
            }).toThrow('Object must have ID!');
        });

        it('should update existing object with the same id', function() {
            var originalDoc = {
                    id: 'some-id',
                    _id: 'some-id'
                },
                doc = {
                    id: 'some-id',
                    field: 'value'
                };

            this.PouchDBWrapper.prototype.get.andReturn(this.$q.resolve(originalDoc));

            var success;
            this.database.put(doc)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.PouchDBWrapper.prototype.put).toHaveBeenCalledWith(_.extend({}, doc, originalDoc));
            expect(this.PouchDBWrapper.prototype.get).toHaveBeenCalledWith(doc.id);
        });

        it('should save the object if an object with the given id is not stored yet', function() {
            var doc = {
                id: 'some-id'
            };
            this.PouchDBWrapper.prototype.get.andReturn(this.$q.reject());

            var success;
            this.database.put(doc)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.PouchDBWrapper.prototype.get).toHaveBeenCalledWith(doc.id);
            expect(this.PouchDBWrapper.prototype.put).toHaveBeenCalledWith({
                _id: 'some-id',
                id: 'some-id'
            });
        });

    });

    describe('get', function() {

        it('should throw exception if ID is not given', function() {
            var database = this.database;

            expect(function() {
                database.get();
            }).toThrow('ID must be defined!');

            expect(function() {
                database.get(null);
            }).toThrow('ID must be defined!');

            expect(function() {
                database.get(undefined);
            }).toThrow('ID must be defined!');
        });

        it('should resolve promise if object exists', function() {
            var doc = {
                _id: 'some-id',
                id: 'some-id'
            };

            this.PouchDBWrapper.prototype.get.andReturn(this.$q.resolve(doc));

            var result;
            this.database.get('some-id')
                .then(function(doc) {
                    result = doc;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(doc);
        });

        it('should reject promise if object does not exist', function() {
            this.PouchDBWrapper.prototype.get.andReturn(this.$q.reject());

            var rejected;
            this.database.get('some-id')
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('remove', function() {

        it('should throw exception if ID is not given', function() {
            var database = this.database;

            expect(function() {
                database.remove();
            }).toThrow('ID must be defined!');

            expect(function() {
                database.remove(null);
            }).toThrow('ID must be defined!');

            expect(function() {
                database.remove(undefined);
            }).toThrow('ID must be defined!');
        });

        it('should resolve promise if doc was removed', function() {
            this.PouchDBWrapper.prototype.get.andReturn(this.$q.resolve({
                _id: 'some-id',
                _rev: 'some-rev-id'
            }));
            this.PouchDBWrapper.prototype.remove.andReturn(this.$q.resolve());

            var success;
            this.database.remove('some-id')
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.PouchDBWrapper.prototype.get).toHaveBeenCalledWith('some-id');
            expect(this.PouchDBWrapper.prototype.remove).toHaveBeenCalledWith('some-id', 'some-rev-id');
        });

        it('should reject promise if doc with the given ID does not exist', function() {
            this.PouchDBWrapper.prototype.get.andReturn(this.$q.reject());

            var rejected;
            this.database.remove('some-id')
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
            expect(this.PouchDBWrapper.prototype.get).toHaveBeenCalledWith('some-id');
        });

    });

    describe('getAll', function() {

        it('should return list of all docs', function() {
            var docs = [{
                id: 'one',
                _id: 'one',
                _rev: 'one'
            }, {
                id: 'two',
                _id: 'two',
                _rev: 'two'
            }, {
                id: 'three',
                _id: 'three',
                _rev: 'three'
            }];

            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: [{
                    doc: docs[0]
                }, {
                    doc: docs[1]
                }, {
                    doc: docs[2]
                }]
            }));

            var result;
            this.database.getAll()
                .then(function(docs) {
                    result = docs;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(docs);
        });

        it('should return empty list if database is empty', function() {
            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: []
            }));

            var result;
            this.database.getAll()
                .then(function(docs) {
                    result = docs;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([]);
        });

    });

    describe('removeAll', function() {

        it('should remove all entries', function() {
            this.PouchDBWrapper.prototype.destroy.andReturn(this.$q.resolve());

            this.database.removeAll();

            expect(this.PouchDBWrapper.prototype.destroy).toHaveBeenCalled();
        });

    });

});