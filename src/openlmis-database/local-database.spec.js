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

ddescribe('LocalDatabase', function() {

    var LocalDatabase, pouchDb, database, $rootScope, dbResponded;

    beforeEach(function() {
        module('openlmis-database', function($provide, PouchDB) {
            var originalPouchDB = PouchDB;

            $provide.constant('PouchDB', function(name) {
                pouchDb = new originalPouchDB(name);
                return pouchDb;
            });
        });

        inject(function($injector) {
            LocalDatabase = $injector.get('LocalDatabase');
            $rootScope = $injector.get('$rootScope');
        });

        database = new LocalDatabase('testDatabase');
        dbResponded = false;

        expect(pouchDb).toBe(database.pouchDb);
    });

    describe('put', function() {

        it('should throw exception if object is undefined', function() {
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
            expect(function() {
                database.put({});
            }).toThrow('Object must have ID!');
        });

        it('should copy the id of the object to _id', function() {
            var success;

            runs(function() {
                database.put({
                    id: 'some-id'
                })
                    .then(function() {
                        return pouchDb.get('some-id');
                    })
                    .then(function(object) {
                        expect(object).not.toBeUndefined();
                    })
                    .then(function() {
                        dbResponded = true;
                        success = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });

                $rootScope.$apply();
            });

            waitsFor(function() {
                $rootScope.$apply();
                return dbResponded;
            }, 'The database should have responded', 500);

            runs(function() {
                $rootScope.$apply();
                $rootScope.$apply();
                $rootScope.$apply();
                expect(success).toBe(true);
            });
        });

        it('should update existing object with the same id', function() {
            var success;

            runs(function() {
                pouchDb.put({
                    id: 'some-id',
                    _id: 'some-id',
                    field: 'value'
                })
                    .then(function() {
                        return database.put({
                            id: 'some-id',
                            field: 'updated value'
                        });
                    })
                    .then(function() {
                        return pouchDb.get('some-id');
                    })
                    .then(function(updated) {
                        expect(updated.id).toEqual('some-id');
                        expect(updated.field).toEqual('updated value');
                    })
                    .then(function() {
                        dbResponded = true;
                        success = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

        it('should save the object if an object with the given id is not stored yet', function() {
            var success;

            runs(function() {
                pouchDb.put({
                    id: 'some-id-one',
                    _id: 'some-id-one'
                })
                    .then(function() {
                        return pouchDb.put({
                            id: 'some-id-two',
                            _id: 'some-id-two'
                        });
                    })
                    .then(function() {
                        return pouchDb.put({
                            id: 'some-id-three',
                            _id: 'some-id-three'
                        });
                    })
                    .then(function() {
                        return database.put({
                            id: 'some-other-id'
                        });
                    })
                    .then(function() {
                        return pouchDb.allDocs();
                    })
                    .then(function(response) {
                        expect(response.total_rows).toBe(4);
                    })
                    .then(function() {
                        dbResponded = true;
                        success = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

        it('should save multiple object with different ID', function() {
            var success;

            runs(function() {
                return database.put({
                    id: 'some-id-one'
                })
                    .then(function() {
                        return database.put({
                            id: 'some-id-two'
                        });
                    })
                    .then(function() {
                        return database.put({
                            id: 'some-id-three'
                        });
                    })
                    .then(function() {
                        return pouchDb.allDocs();
                    })
                    .then(function(response) {
                        expect(response.total_rows).toBe(3);
                    })
                    .then(function() {
                        dbResponded = true;
                        success = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

    });

    describe('get', function() {

        it('should throw exception if ID is not given', function() {
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
            var success, _rev;

            runs(function() {
                pouchDb.put({
                    _id: 'some-id',
                    id: 'some-id'
                })
                    .then(function(response) {
                        _rev = response.rev;
                        return database.get('some-id');
                    })
                    .then(function(stored) {
                        expect(stored).toEqual({
                            id: 'some-id',
                            _id: 'some-id',
                            _rev: _rev
                        });
                        dbResponded = true;
                        success = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

        it('should reject promise if object does not exist', function() {
            var error;

            runs(function() {
                database.get('some-id')
                    .then(function() {
                        dbResponded = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                        error = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(error).toBe(true);
            });
        });

    });

    describe('remove', function() {

        it('should throw exception if ID is not given', function() {
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
            var success;

            runs(function() {
                pouchDb.put({
                    _id: 'some-id',
                    id: 'some-id'
                })
                    .then(function() {
                        return database.remove('some-id');
                    })
                    .then(function() {
                        return pouchDb.allDocs();
                    })
                    .then(function(response) {
                        expect(response.total_rows).toEqual(0);
                        dbResponded = true;
                        success = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

        it('should reject promise if doc with the given ID does not exist', function() {
            var error;

            runs(function() {
                database.remove('some-id')
                    .then(function() {
                        dbResponded = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                        error = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(error).toBe(true);
            });
        });

    });

    describe('getAll', function() {

        it('should return list of all docs', function() {
            var success, putDocs = [];

            runs(function() {
                pouchDb.put({
                    _id: 'one',
                    id: 'one'
                })
                    .then(function(doc) {
                        putDocs.push({
                            id: 'one',
                            _id: 'one',
                            _rev: doc.rev
                        });
                        return pouchDb.put({
                            _id: 'two',
                            id: 'two'
                        });
                    })
                    .then(function(doc) {
                        putDocs.push({
                            id: 'two',
                            _id: 'two',
                            _rev: doc.rev
                        });
                        return pouchDb.put({
                            _id: 'three',
                            id: 'three'
                        });
                    })
                    .then(function(doc) {
                        putDocs.push({
                            id: 'three',
                            _id: 'three',
                            _rev: doc.rev
                        });
                        return database.getAll();
                    })
                    .then(function(docs) {
                        expect(docs.length).toBe(3);
                        angular.forEach(putDocs, function(putDoc) {
                            var contains = false;
                            angular.forEach(docs, function(doc) {
                                contains = angular.equals(putDoc, doc) || contains;
                            });
                            expect(contains).toBe(true);
                        });
                        success = true;
                        dbResponded = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

        it('should return empty list if database is empty', function() {
            var success;

            runs(function() {
                database.getAll()
                    .then(function(docs) {
                        expect(docs).toEqual([]);
                        success = true;
                        dbResponded = true;
                    })
                    .catch(function() {
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

    });

    describe('removeAll', function() {

        it('should remove all entries', function() {
            var success;

            runs(function() {
                pouchDb.put({
                    _id: 'one',
                    id: 'one'
                })
                    .then(function() {
                        return pouchDb.put({
                            _id: 'two',
                            id: 'two'
                        });
                    })
                    .then(function() {
                        return pouchDb.put({
                            _id: 'three',
                            id: 'three'
                        });
                    })
                    .then(function() {
                        return database.removeAll();
                    })
                    .then(function() {
                        return database.getAll();
                    })
                    .then(function(docs) {
                        expect(docs.length).toBe(0);
                        success = true;
                        dbResponded = true;
                    })
                    .catch(function(error) {
                        console.log(error);
                        dbResponded = true;
                    });
            });

            waitForDb();

            runs(function() {
                expect(success).toBe(true);
            });
        });

    });

    afterEach(function() {
        var dbDestroyed;

        runs(function() {
            pouchDb.destroy().then(function() {
                dbDestroyed = true;
            });
        });

        waitsFor(function() {
            return dbDestroyed;
        }, 'The database should be destroyed', 1000);

    });

    function waitForDb() {
        waitsFor(function() {
            $rootScope.$apply();
            return dbResponded;
        }, 'The database should have responded', 1000);
    }

});