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


describe("ServerURL", function () {

  var openlmisUrlService;

  beforeEach(module('openlmis-urls'));

  beforeEach(inject(function (_openlmisUrlService_) {
    openlmisUrlService = _openlmisUrlService_;
    openlmisUrlService.url = "http://localhost";
  }));

  it('format should always return string', function () {
    var url = openlmisUrlService.format("/someURL");
    expect(typeof(url)).toBe("string");
  });

  it("should format relative and absolute urls the same", function(){
    var relativeURL = openlmisUrlService.format("someURL");
    var absoluteURL = openlmisUrlService.format("/someURL");

    expect(relativeURL).toEqual(absoluteURL);
  });

  it("can take N-arguments", function(){
    var url = openlmisUrlService.format("sample", "url");
    expect(url).toEqual("http://localhost/sample/url");

    url = openlmisUrlService.format("sample", "url", "with/three/arguments");
    expect(url).toEqual("http://localhost/sample/url/with/three/arguments");

    url = openlmisUrlService.format("sample", "url", "with", "more", "than", "three/arguments");
    expect(url).toEqual("http://localhost/sample/url/with/more/than/three/arguments");
  });

  it("won't replace urls that start with http", function(){
    var url = openlmisUrlService.format("http://this.is/my", "service");
    expect(url).toEqual("http://this.is/my/service");

    var url2 = openlmisUrlService.format("/this/will/be", "prefixed");
    expect(url2).toEqual("http://localhost/this/will/be/prefixed");
  });

  it("can check urls that belong to the service", function(){
    // Our service
    var url = "http://localhost/sampleURL";
    var bool = openlmisUrlService.check(url);
    expect(bool).toEqual(true);

    // Not our service
    url = "http://www.google.com";
    bool = openlmisUrlService.check(url);
    expect(bool).toEqual(false);
  });

  it("records urls to http endpoints and thinks they are a service", function(){
    openlmisUrlService.format("http://sample.url");
    openlmisUrlService.format("https://more.complicated/url", "with/appended", "sections");

    var url = "http://sample.url/endpoint";
    var bool = openlmisUrlService.check(url);
    expect(bool).toEqual(true);

    url = "https://more.complicated/endpoint";
    bool = openlmisUrlService.check(url);
    expect(bool).toEqual(true);
  });

});
