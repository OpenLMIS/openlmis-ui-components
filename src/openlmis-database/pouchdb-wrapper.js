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
     * @name openlmis-database.PouchDBWrapper
     *
     * @description
     * Wraps PouchDB with AngularJS promises.
     */
    angular
        .module('openlmis-database')
        .factory('PouchDBWrapper', PouchDBWrapper);

    PouchDBWrapper.$inject = ['PouchDB', '$q'];

    function PouchDBWrapper(PouchDB, $q) {

        PouchDBWrapper.prototype.get = get;
        PouchDBWrapper.prototype.put = put;
        PouchDBWrapper.prototype.remove = remove;
        PouchDBWrapper.prototype.destroy = destroy;
        PouchDBWrapper.prototype.allDocs = allDocs;
        PouchDBWrapper.prototype.bulkDocs = bulkDocs;
        PouchDBWrapper.prototype.allDocsWithLatestVersion = allDocsWithLatestVersion;

        return PouchDBWrapper;

        /**
         * @ngdoc method
         * @methodOf openlmis-database.LocalDatabase
         * @constructor
         * @name LocalDatabase
         *
         * @description
         * Creates a new database for the given resource.
         *
         * @param {string} name  the name of the resource to create/open the database
         */
        function PouchDBWrapper(name) {
            this.pouchDb = new PouchDB(name);
            this.name = name;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.PouchDBWrapper
         * @name get
         *
         * @description
         * Wrapper for the get method of the PouchDB.
         *
         * @param  {string}   id  the ID of the document to retrieve from the database
         * @return {Promise}      the PouchDB promise wrapped in AngularJS one
         */
        function get(id) {
            return $q.when(this.pouchDb.get(id));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.PouchDBWrapper
         * @name put
         *
         * @description
         * Wrapper for the put method of the PouchDB.
         *
         * @param  {string}   doc  the doc to be saved
         * @return {Promise}       the PouchDB promise wrapped in AngularJS one
         */
        function put(doc) {
            return $q.when(this.pouchDb.put(doc));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.PouchDBWrapper
         * @name get
         *
         * @description
         * Wrapper for the destroy method of the PouchDB.
         *
         * @return {Promise}      the PouchDB promise wrapped in AngularJS one
         */
        function destroy() {
            return $q.when(this.pouchDb.destroy());
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.PouchDBWrapper
         * @name remove
         *
         * @description
         * Wrapper for the remove method of the PouchDB.
         *
         * @param  {string}   id     the ID of the document to remove from the database
         * @param  {string}   revId  the revision ID of the document to remove from the database
         * @return {Promise}         the PouchDB promise wrapped in AngularJS one
         */
        function remove(id, revId) {
            return $q.when(this.pouchDb.remove(id, revId));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.PouchDBWrapper
         * @name allDocs
         *
         * @description
         * Wrapper for the allDocs method of the PouchDB.
         *
         * @param  {string}   params  the parameters to search database with
         * @return {Promise}          the PouchDB promise wrapped in AngularJS one
         */
        function allDocs(params) {
            return $q.when(this.pouchDb.allDocs(params));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.PouchDBWrapper
         * @name allDocsWithLatestVersion
         *
         * @description
         * Wrapper for the find method of the PouchDB to search all lastest versioned documents.
         *
         * @return {Promise}                the PouchDB promise wrapped in AngularJS one
         */
        function allDocsWithLatestVersion() {
            var pouchdb = this.pouchDb;
            return pouchdb.createIndex({
                index: {
                    fields: ['latest']
                }
            })
                .then(function() {
                    return $q.when(pouchdb.find({
                        selector: {
                            latest: {
                                $eq: true
                            }
                        },
                        //eslint-disable-next-line camelcase
                        include_docs: true
                    }));
                });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-database.PouchDBWrapper
         * @name allDocs
         *
         * @description
         * Wrapper for the bulkDocs method of the PouchDB.
         *
         * @param  {string}   docs  the documents to save
         * @return {Promise}        the PouchDB promise wrapped in AngularJS one
         */
        function bulkDocs(docs) {
            return $q.when(this.pouchDb.bulkDocs(docs));
        }

    }

})();