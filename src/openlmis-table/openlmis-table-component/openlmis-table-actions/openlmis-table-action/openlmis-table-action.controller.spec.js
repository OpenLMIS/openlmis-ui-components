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

describe('OpenlmisTableActionController', function() {
    var $controller, TABLE_CONSTANTS;

    beforeEach(module('openlmis-table'));

    beforeEach(module(function($provide) {
        $provide.constant('TABLE_CONSTANTS', {
            defaultDisplayActionFunction: jasmine.createSpy('defaultDisplayActionFunction')
        });
    }));

    beforeEach(inject(function(_$controller_, _TABLE_CONSTANTS_) {
        $controller = _$controller_;
        TABLE_CONSTANTS = _TABLE_CONSTANTS_;
    }));

    describe('$onInit', function() {
        it('should set default displayAction if undefined', function() {
            var actionConfig = {
                displayAction: undefined
            };
            var ctrl = $controller('OpenlmisTableActionController', {
                $scope: {},
                actionConfig: {
                    displayAction: undefined
                }
            });

            ctrl.actionConfig = actionConfig;

            ctrl.$onInit();

            expect(ctrl.actionConfig.displayAction).toEqual(TABLE_CONSTANTS.defaultDisplayActionFunction);
        });

        it('should not change displayAction if it is defined', function() {
            var actionConfig = {
                displayAction: 'customAction'
            };
            var ctrl = $controller('OpenlmisTableActionController', {
                $scope: {},
                actionConfig: {
                    displayAction: 'customAction'
                }
            });

            ctrl.actionConfig = actionConfig;

            ctrl.$onInit();

            expect(ctrl.actionConfig.displayAction).toEqual('customAction');
        });

        it('should set classes to empty string if undefined', function() {
            var actionConfig = {
                classes: undefined
            };
            var ctrl = $controller('OpenlmisTableActionController', {
                $scope: {},
                actionConfig: {
                    classes: undefined
                }
            });

            ctrl.actionConfig = actionConfig;

            ctrl.$onInit();

            expect(ctrl.actionConfig.classes).toEqual('');
        });

        it('should not change classes if it is defined', function() {
            var actionConfig = {
                classes: 'custom-class'
            };
            var ctrl = $controller('OpenlmisTableActionController', {
                $scope: {},
                actionConfig: {
                    classes: 'custom-class'
                }
            });

            ctrl.actionConfig = actionConfig;

            ctrl.$onInit();

            expect(ctrl.actionConfig.classes).toEqual('custom-class');
        });
    });
});
