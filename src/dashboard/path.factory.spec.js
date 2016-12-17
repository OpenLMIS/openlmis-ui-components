/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe("PathFactory", function () {

    beforeEach(module('openlmis-core'));

    var PathFactory;
    beforeEach(inject(function(_PathFactory_){
        PathFactory = _PathFactory_;
    }));

    it("drops empty arguments", function(){
        url = PathFactory("/", false, "");
        expect(url).toBe("/");

        url = PathFactory("/foo", "", "bar/");
        expect(url).toBe("/foo/bar/");

        url = PathFactory("", "bar/");
        expect(url).toBe("bar/");
    });

    it("leaves the first slash, if entered", function(){
        url = PathFactory("/foo", "bar/");
        expect(url).toBe("/foo/bar/");

        url = PathFactory("foo", "bar/");
        expect(url).toBe("foo/bar/");
    });

    it("leaves trailing slash on last argument, if entered", function(){
        url = PathFactory("/foo", "bar/");
        expect(url).toBe("/foo/bar/");

        url = PathFactory("/foo", "/baz/", "bar/");
        expect(url).toBe("/foo/baz/bar/");

        url = PathFactory("/foo", "/baz/", "bar");
        expect(url).toBe("/foo/baz/bar");
    });

    it("should combine trailing slashes from arguments", function(){
        // Two arguments
        url = PathFactory("/foo/","/bar/");
        expect(url).toBe("/foo/bar/");
        // n arguments, varried slashes
        url = PathFactory("/foo/", "/baz/bar/", "blip");
        expect(url).toBe("/foo/baz/bar/blip");
    });

});