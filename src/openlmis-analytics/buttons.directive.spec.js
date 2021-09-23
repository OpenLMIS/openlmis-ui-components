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

describe('Button directives', function() {

    beforeEach(function() {
        module('openlmis-analytics');

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.$rootScope = $injector.get('$rootScope');
            this.analyticsService = $injector.get('analyticsService');
        });

        spyOn(this.analyticsService, 'track');
    });

    it('will track click events on button elements with the untranslated text', function() {
        var element = this.$compile('<button>{{\'label.name\' | message}}</button>')(this.$rootScope.$new());

        this.$rootScope.$apply();
        angular.element(element[0]).click();

        expect(this.analyticsService.track.mostRecentCall.args[0]).toBe('send');
        expect(this.analyticsService.track.mostRecentCall.args[2]['eventCategory']).toBe('Button Click');
        expect(this.analyticsService.track.mostRecentCall.args[2]['eventAction']).toBe('label.name');
    });

    it('will track click events on input elements of type submit with the untranslated text', function() {
        var element = this
            .$compile('<input type="submit" value="{{\'label.name\' | message}}"/>')(this.$rootScope.$new());

        this.$rootScope.$apply();
        angular.element(element[0]).click();

        expect(this.analyticsService.track.mostRecentCall.args[0]).toBe('send');
        expect(this.analyticsService.track.mostRecentCall.args[2]['eventCategory']).toBe('Button Click');
        expect(this.analyticsService.track.mostRecentCall.args[2]['eventAction']).toBe('label.name');
    });

    it('will track click events on input elements of type button with the untranslated text', function() {
        var element = this
            .$compile('<input type="button" value="{{\'label.name\' | message}}"/>')(this.$rootScope.$new());

        this.$rootScope.$apply();
        angular.element(element[0]).click();

        expect(this.analyticsService.track.mostRecentCall.args[0]).toBe('send');
        expect(this.analyticsService.track.mostRecentCall.args[2]['eventCategory']).toBe('Button Click');
        expect(this.analyticsService.track.mostRecentCall.args[2]['eventAction']).toBe('label.name');
    });

    it('will not track click events on input elements of type other than submit and button', function() {
        var element = this.$compile('<input type="text"/>')(this.$rootScope.$new());

        this.$rootScope.$apply();
        angular.element(element[0]).click();

        expect(this.analyticsService.track.calls.length).toEqual(0);
    });
});