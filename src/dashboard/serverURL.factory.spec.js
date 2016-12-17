/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

describe("ServerURL", function () {

  var OpenlmisURLService;

  beforeEach(module('openlmis-core'));

  beforeEach(inject(function (_OpenlmisURLService_) {
    OpenlmisURLService = _OpenlmisURLService_;
    OpenlmisURLService.url = "http://localhost";
  }));

  it('format should always return string', function () {
    var url = OpenlmisURLService.format("/someURL");
    expect(typeof(url)).toBe("string");
  });

  it("should format relative and absolute urls the same", function(){
    var relativeURL = OpenlmisURLService.format("someURL");
    var absoluteURL = OpenlmisURLService.format("/someURL");

    expect(relativeURL).toEqual(absoluteURL);
  });

  it("can take N-arguments", function(){
    var url = OpenlmisURLService.format("sample", "url");
    expect(url).toEqual("http://localhost/sample/url");

    url = OpenlmisURLService.format("sample", "url", "with/three/arguments");
    expect(url).toEqual("http://localhost/sample/url/with/three/arguments");

    url = OpenlmisURLService.format("sample", "url", "with", "more", "than", "three/arguments");
    expect(url).toEqual("http://localhost/sample/url/with/more/than/three/arguments");
  });

  it("won't replace urls that start with http", function(){
    var url = OpenlmisURLService.format("http://this.is/my", "service");
    expect(url).toEqual("http://this.is/my/service");

    var url2 = OpenlmisURLService.format("/this/will/be", "prefixed");
    expect(url2).toEqual("http://localhost/this/will/be/prefixed");
  });

  it("can check urls that belong to the service", function(){
    // Our service
    var url = "http://localhost/sampleURL";
    var bool = OpenlmisURLService.check(url);
    expect(bool).toEqual(true);

    // Not our service
    url = "http://www.google.com";
    bool = OpenlmisURLService.check(url);
    expect(bool).toEqual(false);
  });

  it("records urls to http endpoints and thinks they are a service", function(){
    OpenlmisURLService.format("http://sample.url");
    OpenlmisURLService.format("https://more.complicated/url", "with/appended", "sections");

    var url = "http://sample.url/endpoint";
    var bool = OpenlmisURLService.check(url);
    expect(bool).toEqual(true);

    url = "https://more.complicated/endpoint";
    bool = OpenlmisURLService.check(url);
    expect(bool).toEqual(true);
  });

});