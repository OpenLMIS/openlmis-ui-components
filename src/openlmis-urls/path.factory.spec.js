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

describe('pathFactory', function() {

    beforeEach(function() {
        module('openlmis-urls');

        inject(function($injector) {
            this.pathFactory = $injector.get('pathFactory');
        });
    });

    it('drops empty arguments', function() {
        this.url = this.pathFactory('/', false, '');

        expect(this.url).toBe('/');

        this.url = this.pathFactory('/foo', '', 'bar/');

        expect(this.url).toBe('/foo/bar/');

        this.url = this.pathFactory('', 'bar/');

        expect(this.url).toBe('bar/');
    });

    it('leaves the first slash, if entered', function() {
        this.url = this.pathFactory('/foo', 'bar/');

        expect(this.url).toBe('/foo/bar/');

        this.url = this.pathFactory('foo', 'bar/');

        expect(this.url).toBe('foo/bar/');
    });

    it('leaves trailing slash on last argument, if entered', function() {
        this.url = this.pathFactory('/foo', 'bar/');

        expect(this.url).toBe('/foo/bar/');

        this.url = this.pathFactory('/foo', '/baz/', 'bar/');

        expect(this.url).toBe('/foo/baz/bar/');

        this.url = this.pathFactory('/foo', '/baz/', 'bar');

        expect(this.url).toBe('/foo/baz/bar');
    });

    it('should combine trailing slashes from arguments', function() {
        // Two arguments
        this.url = this.pathFactory('/foo/', '/bar/');

        expect(this.url).toBe('/foo/bar/');
        // n arguments, varried slashes
        this.url = this.pathFactory('/foo/', '/baz/bar/', 'blip');

        expect(this.url).toBe('/foo/baz/bar/blip');
    });

});
