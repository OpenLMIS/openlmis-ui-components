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


describe("reportUrlFactory", function () {

  // mocks
  var report, selectedValues, format;

  // injects
  var reportUrlFactory;

  beforeEach(function() {
    module('report');

    module(function($provide){
      $provide.factory('openlmisUrlFactory', function(){
        return function(url){
          return url;
        }
      });
    });

    report = {
      id: "reportId",
      templateParameters: [
        { name: "program" },
        { name: "facility" }
      ]
    };
    format = "pdf";
    selectedValues = { program: "programName", facility: "facilityCode" };

    inject(function (_reportUrlFactory_) {
        reportUrlFactory = _reportUrlFactory_;
    });
  });

  it('should return string', function () {
    var url = reportUrlFactory.buildUrl("/someURL", report, selectedValues, format);
    expect(typeof(url)).toBe("string");
  });

  it("should format relative and absolute urls the same", function(){
    var relativeURL = reportUrlFactory.buildUrl("someURL", report, selectedValues, format);
    var absoluteURL = reportUrlFactory.buildUrl("/someURL", report, selectedValues, format);

    expect(relativeURL).toEqual(absoluteURL);
  });

  it("should format urls with selected values", function(){
    var url = reportUrlFactory.buildUrl("/some", report, selectedValues, format);
    expect(url).toBe('/api/reports/templates/some/reportId/pdf?program=programName&&facility=facilityCode&&');
  });

});
