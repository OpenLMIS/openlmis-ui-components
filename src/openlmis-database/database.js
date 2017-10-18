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

    angular
        .module('openlmis-database')
        .factory('Database', Database);

    Database.$inject = ['PouchDB', '$filter'];

    function Database(PouchDB, $filter) {
        return Database;

        function Database(name) {
            var database = this,
                pouchDb = new PouchDB(name);

            database.put = put;
            database.get = get;
            database.search = search;
            database.remove = remove;

            function put(doc) {
                validate(doc);

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

            function get(id) {
                validateId(id);
                return pouchDb.get(id);
            }

            function search(options) {
                return pouchDb.allDocs({
                    include_docs: true
                })
                .then(function(response) {
                    var docs = extractDocs(response);

                    if (options) {
                        return $filter('filter')(docs, options);
                    }
                    return docs;
                });
            }

            function remove(id) {
                validateId(id);

                return pouchDb.get(id)
                .then(function(doc) {
                    return pouchDb.remove(doc._id, doc._rev);
                });
            }
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
