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

        this.docs = [{
            id: 'one',
            _id: 'one/4',
            _rev: 'four',
            meta: {
                versionNumber: 4
            },
            latest: true
        }, {
            id: 'one',
            _id: 'one/3',
            _rev: 'three',
            meta: {
                versionNumber: 3
            },
            latest: false
        }, {
            id: 'one',
            _id: 'one/1',
            _rev: 'one',
            meta: {
                versionNumber: 1
            },
            latest: false
        }];

        spyOn(this.PouchDBWrapper.prototype, 'put');
        spyOn(this.PouchDBWrapper.prototype, 'get');
        spyOn(this.PouchDBWrapper.prototype, 'remove');
        spyOn(this.PouchDBWrapper.prototype, 'allDocs');
        spyOn(this.PouchDBWrapper.prototype, 'destroy');
        spyOn(this.PouchDBWrapper.prototype, 'allDocsWithLatestVersion');
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

    describe('putVersioned', function() {

        it('should throw exception if object is undefined', function() {
            var database = this.database;

            expect(function() {
                database.putVersioned();
            }).toThrow('Object must be defined!');

            expect(function() {
                database.putVersioned(null);
            }).toThrow('Object must be defined!');

            expect(function() {
                database.putVersioned(undefined);
            }).toThrow('Object must be defined!');
        });

        it('should throw exception if object does not have ID', function() {
            var database = this.database;

            expect(function() {
                database.putVersioned({});
            }).toThrow('Object must have ID!');
        });

        it('should not save existing object with the same id if it has the latest version', function() {

            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: [{
                    doc: this.docs[0]
                }, {
                    doc: this.docs[1]
                }, {
                    doc: this.docs[2]
                }]
            }));

            var params = {
                endkey: 'one',
                startkey: 'one\uffff',
                descending: true,
                //eslint-disable-next-line camelcase
                include_docs: true
            };

            var success;
            this.database.putVersioned(this.docs[0])
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.PouchDBWrapper.prototype.put).not.toHaveBeenCalled();
            expect(this.PouchDBWrapper.prototype.allDocs).toHaveBeenCalledWith(params);
        });

        it('should save existing object with the same id if there is newer version', function() {

            var updatedDoc = {
                id: 'one',
                _id: 'one/5',
                _rev: 'five',
                meta: {
                    versionNumber: 5
                }
            };

            var params = {
                endkey: 'one',
                startkey: 'one\uffff',
                descending: true,
                //eslint-disable-next-line camelcase
                include_docs: true
            };

            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: [{
                    doc: this.docs[0]
                }, {
                    doc: this.docs[1]
                }, {
                    doc: this.docs[2]
                }]
            }));

            var success;
            this.database.putVersioned(updatedDoc)
                .then(function() {
                    success = true;
                });
            this.$rootScope.$apply();

            expect(success).toBe(true);
            expect(this.PouchDBWrapper.prototype.allDocs).toHaveBeenCalledWith(params);
            expect(this.PouchDBWrapper.prototype.put.calls.length).toBe(2);
            expect(this.PouchDBWrapper.prototype.put).toHaveBeenCalledWith({
                id: 'one',
                _id: 'one/4',
                _rev: 'four',
                meta: {
                    versionNumber: 4
                },
                latest: false
            });

            expect(this.PouchDBWrapper.prototype.put).toHaveBeenCalledWith({
                id: 'one',
                _id: 'one/5',
                _rev: 'five',
                meta: {
                    versionNumber: 5
                },
                latest: true
            });
        });
    });

    it('should save existing object with the same id if it has not the latest version', function() {

        var updatedDoc = {
            id: 'one',
            _id: 'one/2',
            _rev: 'two',
            meta: {
                versionNumber: 2
            }
        };

        var params = {
            endkey: 'one',
            startkey: 'one\uffff',
            descending: true,
            //eslint-disable-next-line camelcase
            include_docs: true
        };

        this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
            rows: [{
                doc: this.docs[0]
            }, {
                doc: this.docs[1]
            }, {
                doc: this.docs[2]
            }]
        }));

        var success;
        this.database.putVersioned(updatedDoc)
            .then(function() {
                success = true;
            });
        this.$rootScope.$apply();

        expect(success).toBe(true);
        expect(this.PouchDBWrapper.prototype.allDocs).toHaveBeenCalledWith(params);
        expect(this.PouchDBWrapper.prototype.put.calls.length).toBe(1);
        expect(this.PouchDBWrapper.prototype.put).toHaveBeenCalledWith({
            id: 'one',
            _id: 'one/2',
            _rev: 'two',
            meta: {
                versionNumber: 2
            },
            latest: false
        });
    });

    it('should save existing object with the same id as the latest version', function() {

        var updatedDoc = {
            id: 'one',
            _id: 'one/1',
            _rev: 'one',
            meta: {
                versionNumber: 1
            }
        };

        var params = {
            endkey: 'one',
            startkey: 'one\uffff',
            descending: true,
            //eslint-disable-next-line camelcase
            include_docs: true
        };

        this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
            rows: []
        }));

        var success;
        this.database.putVersioned(updatedDoc)
            .then(function() {
                success = true;
            });
        this.$rootScope.$apply();

        expect(success).toBe(true);
        expect(this.PouchDBWrapper.prototype.allDocs).toHaveBeenCalledWith(params);
        expect(this.PouchDBWrapper.prototype.put.calls.length).toBe(1);
        expect(this.PouchDBWrapper.prototype.put).toHaveBeenCalledWith({
            id: 'one',
            _id: 'one/1',
            _rev: 'one',
            meta: {
                versionNumber: 1
            },
            latest: true
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

            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: [{
                    doc: this.docs[0]
                }, {
                    doc: this.docs[1]
                }, {
                    doc: this.docs[2]
                }]
            }));

            var result;
            this.database.getAll()
                .then(function(docs) {
                    result = docs;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.docs);
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

    describe('allDocsWithLatestVersion', function() {

        beforeEach(function() {

            this.docs = [{
                id: 'one',
                _id: 'one/4',
                _rev: 'one',
                meta: {
                    versionNumber: 4
                },
                latest: true
            }, {
                id: 'two',
                _id: 'two/1',
                _rev: 'two',
                meta: {
                    versionNumber: 1
                },
                latest: true
            }, {
                id: 'three',
                _id: 'three/6',
                _rev: 'three',
                meta: {
                    versionNumber: 6
                },
                latest: true
            }];
        });

        it('should return list of all docs', function() {

            this.PouchDBWrapper.prototype.allDocsWithLatestVersion.andReturn(this.$q.resolve([
                this.docs[0],
                this.docs[1],
                this.docs[2]
            ]));

            var result;
            this.database.allDocsWithLatestVersion()
                .then(function(docs) {
                    result = docs;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.docs);
        });

        it('should return empty list if database is empty', function() {
            this.PouchDBWrapper.prototype.allDocsWithLatestVersion.andReturn(this.$q.resolve([]));

            var result;
            this.database.allDocsWithLatestVersion()
                .then(function(docs) {
                    result = docs;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([]);
        });

    });

    describe('allDocsByIndex', function() {

        it('should return list of docs with the given id', function() {

            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: [{
                    doc: this.docs[0]
                }, {
                    doc: this.docs[1]
                }, {
                    doc: this.docs[2]
                }]
            }));

            var result;
            this.database.allDocsByIndex(this.docs[0].id)
                .then(function(docs) {
                    result = docs;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.docs);
        });

        it('should return list of docs with the given id and version', function() {
            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: [{
                    doc: this.docs[0]
                }]
            }));

            var result;
            this.database.allDocsByIndex(this.docs[0].id, this.docs[0].meta.versionNumber)
                .then(function(docs) {
                    result = docs;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([this.docs[0]]);
        });

        it('should return empty list if any record from database matches', function() {
            this.PouchDBWrapper.prototype.allDocs.andReturn(this.$q.resolve({
                rows: []
            }));

            var result;
            this.database.allDocsByIndex(this.docs[0].id, this.docs[0].meta.versionNumber)
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