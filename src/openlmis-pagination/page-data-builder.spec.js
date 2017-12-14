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
        .module('openlmis-pagination')
        .factory('PageDataBuilder', PageDataBuilder);

    PageDataBuilder.$inject = [];

    function PageDataBuilder() {

        PageDataBuilder.buildWithContent = buildWithContent;

        PageDataBuilder.prototype.withContent = withContent;
        PageDataBuilder.prototype.withNumberOfElements = withNumberOfElements;
        PageDataBuilder.prototype.withTotalElements = withTotalElements;
        PageDataBuilder.prototype.build = build;

        return PageDataBuilder;

        function PageDataBuilder() {
            this.first = true;
            this.last = true;
            this.number = 0;
            this.numberOfElements = 0,
            this.size = 10,
            this.sort = undefined;
            this.totalElements = 0;
            this.totalPages = 0;
            this.content = [];
        }

        function withContent(newContent) {
            this.content = newContent;
            return this;
        }

        function withNumberOfElements(newNumberOfElements) {
            this.numberOfElements = newNumberOfElements;
            return this;
        }

        function withTotalElements(newTotalElements) {
            this.totalElements = newTotalElements;
            return this;
        }

        function build() {
            return new Page(
                this.first, this.last, this.number, this.numberOfElements, this.size, this.sort,
                this.totalElements, this.totalPages, this.content
            );
        }

        function buildWithContent(content) {
            return new PageDataBuilder()
                .withContent(content)
                .withNumberOfElements(content.length)
                .withTotalElements(content.length)
                .build();
        }



    }

})();
