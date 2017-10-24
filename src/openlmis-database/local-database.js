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

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-database.LocalDatabase
     *
     * @description
     * Represents a single local database. Currently this uses PouchDB internally. If multiple
     * instances of this class are created with the same resource name they both reference the same
     * database.
     */
    angular
        .module('openlmis-database')
        .factory('LocalDatabase', LocalDatabase);

    LocalDatabase.$inject = ['PouchDB', '$filter'];

    function LocalDatabase(PouchDB, $filter) {

        LocalDatabase.prototype.put = put;
        LocalDatabase.prototype.get = get;
        LocalDatabase.prototype.getAll = getAll;
        LocalDatabase.prototype.search = search;
        LocalDatabase.prototype.remove = remove;
        LocalDatabase.prototype.removeAll = removeAll;

        return LocalDatabase;

        /**
         * @ngdoc method
         * @methodOf openlmis-database.LocalDatabase
         * @constructor
         * @name LocalDatabase
         *
         * @description
         * Creates a new database for the given resource, if the database doesn't exist yet. If
         * there already is a database for the given resource name, a connection to that database
         * will be created. There can never be more than one databases for a single resource name.
         *
         * @param       {[type]} resourceName the name of the resource to create/open the database
         */
        function LocalDatabase(resourceName) {
            this.pouchDb = new PouchDB(resourceName);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.LocalDatabase
         * @name put
         *
         * @description
         * Saves the given document (object) into the database. If an document with the same ID
         * already exist in the database it will be updated. The document must be and object with
         * the 'id' property set or exception will be thrown.
         *
         * @param  {Object}     doc the document to be saved (updated) into the database
         * @return {Promise}        the promise, which resolves when the document has been
         *                          successfully saved into the database, the promise will be
         *                          rejected if document couldn't be saved for any reason
         */
        function put(doc) {
            validate(doc);

            var pouchDb = this.pouchDb;
            return pouchDb.get(doc.id)
            .then(function(stored) {
                doc._id = stored._id;
                doc._rev = stored._rev;
            })
            .catch(function() {
                doc._id = doc.id;
            })
            .then(function() {
                return pouchDb.put(doc);
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.LocalDatabase
         * @name get
         *
         * @description
         * Retrieves document with the given ID from the database. The id must be defined, otherwise
         * an exception will me thrown.
         *
         * @param  {String}     id  the ID of the document to retrieve from the database
         * @return {Promise}        the promise, which resolves when the document has been retrieved
         *                          from the database, the promise will be rejected if the document
         *                          couldn't be retrieved for any reason
         */
        function get(id) {
            validateId(id);
            return this.pouchDb.get(id);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.LocalDatabase
         * @name getAll
         *
         * @description
         * Retrieves all documents stored in the database, no specific order is respected.
         *
         * @return {Promise}    the promise, which resolves to list of all the documents stored in
         *                      the database, the promise will be rejected if the documents couldn't
         *                      be retrieved for any reason
         */
        function getAll() {
            return this.search()
            .then(function(docs) {
                return docs;
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.LocalDatabase
         * @name search
         *
         * @description
         * Retrieves all the documents matching given options. If the options are not defined then
         * all documents are returned.
         *
         * @param  {Object}     options the options to filter documents with
         * @return {Promise}            the promise, which resolves when the documents have been
         *                              retrieved from the database, the promise will be rejected
         *                              if the documents couldn't be retrieved for any reason
         */
        function search(options) {
            return this.pouchDb.allDocs({
                include_docs: true
            })
            .then(extractDocs)
            .then(function(docs) {
                if (options) {
                    return $filter('filter')(docs, options);
                }
                return docs;
            });
        }

        /**
         * @ngdoc methodOf
         * @methodOf openlmis-database.LocalDatabase
         * @name remove
         *
         * @description
         * Removes the document with the given id from the database. If the ID is not given an
         * exception will be thrown. If object with the given ID doesn't exist in the database
         * the returned promise will be rejected.
         *
         * @param  {String}     id  the ID of the document to delete
         * @return {Promise}        the promise, which resolves when the document has been
         *                          successfully removed from the database, the promise will be
         *                          rejected if the document couldn't be deleted for any reason
         *                          (the document not existing in the database for example)
         */
        function remove(id) {
            validateId(id);

            var pouchDb = this.pouchDb;
            return pouchDb.get(id)
            .then(function(doc) {
                return pouchDb.remove(doc._id, doc._rev);
            });
        }

        /**
         * @ngdoc methodOf
         * @methodOf openlmis-database.LocalDatabase
         * @name removeAll
         *
         * @description
         * Removes all documents from the database.
         *
         * @return {Promise}    the promise, which resolves when the documents have been
         *                      successfully removed from the database, the promise will be
         *                      rejected if the documents couldn't be deleted for any reason
         */
        function removeAll() {
            var database = this,
                name = this.pouchDb.name;

            return this.pouchDb.destroy()
            .then(function(response) {
                database.pouchDb = new PouchDB(name);
            });
        }

        function validate(doc) {
            if (!doc) {
                throw 'Object must be defined!';
            }

            if (!doc.id) {
                throw 'Object must have ID!';
            }
        }

        function validateId(id) {
            if (!id) {
                throw 'ID must be defined!';
            }
        }

        function extractDocs(response) {
            var docs = [];

            for (var row in response.rows) {
                docs.push(response.rows[row].doc);
            }

            return docs;
        }
    }

})();
