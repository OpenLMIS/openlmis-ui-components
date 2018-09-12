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

describe('openlmis-table.directive:OpenlmisTablePane', function() {

    var $scope, $compile, $rootScope;

    beforeEach(function() {
        module('openlmis-table');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
        });

        $scope = $rootScope.$new();
    });

    describe('md-virtual-repeat-container', function() {
        var tablePaneElement;

        beforeEach(function() {
            tablePaneElement = compileTablePane();
        });

        it('changes ng-repeat to md-virtual-repeat', function() {
            var text = tablePaneElement.html();

            expect(text.indexOf('ng-repeat')).toBe(-1);
            expect(text.indexOf('md-virtual-repeat')).not.toBe(-1);
        });

        it('adds md-virtual-repeat-container around the table element', function() {
            var table = tablePaneElement.find('table');
            expect(table.parents('.md-virtual-repeat-container').length).toBe(1);
        });

        it('adds md-virtual-repeat-scroller', function() {
            expect(tablePaneElement.find('.md-virtual-repeat-scroller').length).toBe(1);
        });

        afterEach(function() {
            tablePaneElement.remove();
        });
    });

    describe('watches scroll', function() {

        var scroller, tablePaneElement;

        beforeEach(function() {
            spyOn(_, 'throttle').andCallFake(function(fn) {
                return function(e) {
                    fn(e);
                };
            });

            tablePaneElement = compileTablePane();
            scroller = tablePaneElement.find('.md-virtual-repeat-scroller');
        });

        it('is throttled', function() {
            scroller.trigger('scroll');
            expect(_.throttle).toHaveBeenCalled();
        });

        it('updates viewport position', function() {
            var tablePaneCtrl = tablePaneElement.controller('openlmisTablePane');
            spyOn(tablePaneCtrl, 'updateViewportPosition');

            scroller.trigger('scroll');

            expect(tablePaneCtrl.updateViewportPosition).toHaveBeenCalled();
        });

        afterEach(function() {
            tablePaneElement.remove();
        });
    });

    function compileTablePane() {
        var tbody = '<tbody><tr ng-repeat="item in items"><td></td><td></td><td></td></tr></tbody>',
            markup = '<div class="openlmis-table-pane"><table>' + tbody + '</table></div>',
            element = angular.element(markup);
        angular.element('body').append(element);

        return $compile(element)($scope);
    }

});