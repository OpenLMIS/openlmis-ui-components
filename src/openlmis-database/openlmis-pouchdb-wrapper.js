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
        .factory('PouchDBWrapper', PouchDBWrapper);

    PouchDBWrapper.$inject = ['PouchDB', '$q'];

    function PouchDBWrapper(PouchDB, $q) {

        PouchDBWrapper.prototype.get = get;
        PouchDBWrapper.prototype.put = put;
        PouchDBWrapper.prototype.remove = remove;
        PouchDBWrapper.prototype.destroy = destroy;
        PouchDBWrapper.prototype.allDocs = allDocs;
        PouchDBWrapper.prototype.bulkDocs = bulkDocs;

        return PouchDBWrapper;

        function PouchDBWrapper(name) {
            this.pouchDb = new PouchDB(name);
            this.name = name;
        }

        function get(id) {
            return $q.when(this.pouchDb.get(id));
        }

        function put(doc) {
            return $q.when(this.pouchDb.put(doc));
        }

        function destroy() {
            return $q.when(this.pouchDb.destroy());
        }

        function remove(id, revId) {
            return $q.when(this.pouchDb.remove(id, revId));
        }

        function allDocs(params) {
            return $q.when(this.pouchDb.allDocs(params));
        }

        function bulkDocs(docs) {
            return $q.when(this.pouchDb.bulkDocs(docs));
        }

    }

})();