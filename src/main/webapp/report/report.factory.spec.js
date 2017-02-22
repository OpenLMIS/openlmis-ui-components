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

describe('reportFactory', function() {

  // mocks
  var path = '/path';
  var response = [
    { name: 'name1' },
    { name: 'name2' }
  ];

  // injects
  var $httpBackend, reportFactory;

  beforeEach(function() {
    module('report');

    inject(function(_$httpBackend_, _reportFactory_, openlmisUrlFactory) {
      reportFactory = _reportFactory_;
      $httpBackend = _$httpBackend_;

      $httpBackend.when('GET', openlmisUrlFactory(path))
        .respond(200, response);
    });
  });

  it('should get values for parameters with property access', function() {
    var result;

    reportFactory.getParameterValues(path, 'name')
    .then(function(items) {
        result = items;
    });

    $httpBackend.flush();

    expect(result.length).toBe(response.length);
    expect(result[0]).toBe(response[0].name);
    expect(result[1]).toBe(response[1].name);
  });

  it('should get values for parameters without property access', function() {
    var result;

    reportFactory.getParameterValues(path, null)
    .then(function(items) {
        result = items;
    });

    $httpBackend.flush();

    expect(result.length).toBe(response.length);
    expect(result[0].name).toBe(response[0].name);
    expect(result[1].name).toBe(response[1].name);
  });

});
