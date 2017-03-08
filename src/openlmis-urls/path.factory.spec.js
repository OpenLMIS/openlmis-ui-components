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


describe("pathFactory", function () {

    beforeEach(module('openlmis-urls'));

    var pathFactory;
    beforeEach(inject(function(_pathFactory_){
        pathFactory = _pathFactory_;
    }));

    it("drops empty arguments", function(){
        url = pathFactory("/", false, "");
        expect(url).toBe("/");

        url = pathFactory("/foo", "", "bar/");
        expect(url).toBe("/foo/bar/");

        url = pathFactory("", "bar/");
        expect(url).toBe("bar/");
    });

    it("leaves the first slash, if entered", function(){
        url = pathFactory("/foo", "bar/");
        expect(url).toBe("/foo/bar/");

        url = pathFactory("foo", "bar/");
        expect(url).toBe("foo/bar/");
    });

    it("leaves trailing slash on last argument, if entered", function(){
        url = pathFactory("/foo", "bar/");
        expect(url).toBe("/foo/bar/");

        url = pathFactory("/foo", "/baz/", "bar/");
        expect(url).toBe("/foo/baz/bar/");

        url = pathFactory("/foo", "/baz/", "bar");
        expect(url).toBe("/foo/baz/bar");
    });

    it("should combine trailing slashes from arguments", function(){
        // Two arguments
        url = pathFactory("/foo/","/bar/");
        expect(url).toBe("/foo/bar/");
        // n arguments, varried slashes
        url = pathFactory("/foo/", "/baz/bar/", "blip");
        expect(url).toBe("/foo/baz/bar/blip");
    });

});
