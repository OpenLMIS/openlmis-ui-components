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

describe('OpenlmisTableController', function() {
    var $controller, $rootScope, $scope, openlmisTableService, openlmisTableSortingService, OpenlmisTableController;

    beforeEach(module('openlmis-table'));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        openlmisTableService = {
            setColumnsDefaults: jasmine.createSpy('setColumnsDefaults').andCallFake(function(columns) {
                columns.forEach(function(column) {
                    if (!column.popover) {
                        column.popover = {
                            template: '',
                            text: ''
                        };
                    }
                });
            }),
            getElementsConfiguration: jasmine.createSpy('getElementsConfiguration').andCallFake(function(tableConfig) {
                return tableConfig.data.map(function(item) {
                    return tableConfig.columns.map(function(column) {
                        return {
                            value: openlmisTableService.getElementPropertyValue(item, column.propertyPath),
                            template: column.template,
                            item: item,
                            displayCell: column.displayColumn ? column.displayColumn(item) : true
                        };
                    });
                });
            }),
            getHeadersConfiguration: jasmine.createSpy('getHeadersConfiguration').andCallFake(function(columns) {
                var usedHeaders = [];
                return columns.map(function(column) {
                    var alreadyUsed = usedHeaders.includes(column.header);
                    usedHeaders.push(column.header);
                    return {
                        text: column.header,
                        template: column.headerTemplate,
                        isDisplayed: !alreadyUsed
                    };
                });
            }),
            getElementPropertyValue: jasmine.createSpy('getElementPropertyValue')
                .andCallFake(function(obj, propertyPath) {
                    if (!obj || !propertyPath) {
                        return undefined;
                    }

                    return propertyPath.split('.').reduce(function(acc, key) {
                        return acc && acc[key];
                    }, obj);
                })
        };

        openlmisTableSortingService = {
            setHeadersClasses: jasmine.createSpy('setHeadersClasses'),
            sortTable: jasmine.createSpy('sortTable'),
            isColumnSortable: jasmine.createSpy('isColumnSortable').andReturn(true)
        };

        OpenlmisTableController = $controller('OpenlmisTableController', {
            $scope: $scope,
            openlmisTableService: openlmisTableService,
            openlmisTableSortingService: openlmisTableSortingService
        });

        OpenlmisTableController.tableConfig = {
            initialSelectAll: true,
            columns: [
                {
                    header: 'Name',
                    propertyPath: 'name',
                    template: '<div>{{ item.name }}</div>'
                },
                {
                    header: 'Age',
                    propertyPath: 'age',
                    template: '<div>{{ item.age }}</div>'
                }
            ],
            data: [
                {
                    name: 'John Doe',
                    age: 30
                },
                {
                    name: 'Jane Smith',
                    age: 25
                }
            ]
        };
    }));

    describe('$onInit', function() {
        it('should initialize the table configuration and set selectAll correctly', function() {
            OpenlmisTableController.$onInit();

            expect(OpenlmisTableController.selectAll)
                .toBe(true);

            expect(openlmisTableService.setColumnsDefaults)
                .toHaveBeenCalledWith(OpenlmisTableController.tableConfig.columns);

            expect(openlmisTableSortingService.setHeadersClasses)
                .toHaveBeenCalledWith(OpenlmisTableController.tableConfig.columns);

            expect(openlmisTableService.getElementsConfiguration)
                .toHaveBeenCalledWith(OpenlmisTableController.tableConfig);

            expect(openlmisTableService.getHeadersConfiguration)
                .toHaveBeenCalledWith(OpenlmisTableController.tableConfig.columns);
        });
    });

    describe('sortTable', function() {
        it('should call openlmisTableSortingService.sortTable if the column is sortable', function() {
            spyOn(OpenlmisTableController, 'isColumnSortable').andReturn(true);

            var column = 'someColumn';

            OpenlmisTableController.sortTable(column);

            expect(openlmisTableSortingService.sortTable)
                .toHaveBeenCalledWith(column);
        });
    });

    describe('getItem', function() {
        it('should return the correct item from elementsConfiguration', function() {
            OpenlmisTableController.$onInit();

            var result = OpenlmisTableController.getItem(0, 0);

            expect(result)
                .toEqual(OpenlmisTableController.tableConfig.data[0]);
        });
    });

    describe('$watch for tableConfig changes', function() {
        it('should update elementsConfiguration when tableConfig.data changes', function() {

            OpenlmisTableController.tableConfig = {
                columns: [
                    {
                        header: 'Name',
                        propertyPath: 'name'
                    },
                    {
                        header: 'Age',
                        propertyPath: 'age'
                    }
                ],
                data: [
                    {
                        name: 'John Doe',
                        age: 30
                    }
                ]
            };

            spyOn($scope, '$watch').andCallThrough();

            OpenlmisTableController.$onInit();

            expect(OpenlmisTableController.tableConfig).toBeDefined();
            expect(OpenlmisTableController.tableConfig.data).toBeDefined();

            expect($scope.$watch)
                .toHaveBeenCalled();

            expect(OpenlmisTableController.elementsConfiguration)
                .toBeDefined();
        });
    });
});
