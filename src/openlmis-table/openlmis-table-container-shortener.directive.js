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

(function() {
    'use strict';

    angular
        .module('openlmis-table')
        .directive('openlmisTableContainer', directive);

    directive.$inject = ['jQuery'];

    function directive(jQuery) {
        var directive = {
            link: link,
            restrict: 'C',
            priority: 15
        };
        return directive;

        function showHideScroll(active) {
            var css = '#fixed-scrollbar::-webkit-scrollbar {' +
                'height: 12px;' +
            '}';
            if (!active.length) {
                css = '#fixed-scrollbar::-webkit-scrollbar {' +
                'height: 0px;}';
            }
            $('<style>')
                .prop('type', 'text/css')
                .html(css)
                .appendTo('head');
        }

        function appendStyles() {
            var customScrollbarStyles = '#fixed-scrollbar::-webkit-scrollbar {' +
                    'height: 12px; }' +

                '#fixed-scrollbar::-webkit-scrollbar-track {' +
                    'background-color: #d7d7d7;}' +

                '#fixed-scrollbar::-webkit-scrollbar-thumb {' +
                    'background-color: #333;' +
                    'border-radius: 10px;}';

            $('<style>')
                .prop('type', 'text/css')
                .html(customScrollbarStyles)
                .appendTo('head');
        }

        function link(scope, element) {
            var flexTable = jQuery('.openlmis-flex-table', element),
                debounceTime = 50;
            flexTable.addClass('fixed-scrollbar');
            var scrollbar = $('<div id="fixed-scrollbar"><div></div></div>')
                .appendTo($(document.body));
            var defaultCss = {
                overflowX: 'auto',
                position: 'fixed',
                width: '100%',
                bottom: '0px'
            };
            scrollbar.hide().css(defaultCss);
            var scrollContent = scrollbar.find('div');
            var throttled = _.throttle(scroll, debounceTime);
            appendStyles();

            function getTop(e) {
                return e.offset().top;
            }

            function getBottom(e) {
                return e.offset().top + e.height();
            }

            var active = $([]);

            function findActive() {
                scrollbar.show();
                active = $([]);
                $('.fixed-scrollbar').each(function() {
                    if (getTop($(this)) < getTop(scrollbar) && getBottom($(this)) > getBottom(scrollbar)) {
                        scrollContent.width = $(this).get(0).scrollWidth;
                        scrollContent.height = 1;
                        active = $(this);
                    }
                });
                fitScroll(active);
                return active;
            }

            function fitScroll(active) {
                showHideScroll(active);
                if (!active.length) {
                    return scrollbar.hide();
                }

                var $scrollContent = $(scrollContent);
                var toolbar = $('.openlmis-toolbar');
                var withToolbar = toolbar && toolbar.innerHeight();
                if (withToolbar) {
                    defaultCss.bottom = withToolbar ? toolbar.innerHeight() + 'px' : '0px';
                    scrollbar.css(defaultCss);
                }
                scrollbar.css({
                    left: active.offset().left,
                    width: active.width()
                });

                $scrollContent.width(active.get(0).scrollWidth);
                $scrollContent.height(1);

                lastScroll = undefined;
            }
            function onscroll() {
                var oldactive = active;
                active = findActive();
                if (oldactive.not(active).length) {
                    oldactive.unbind('scroll', update);
                }
                if (active.not(oldactive).length) {
                    active.scroll(update);
                }
                update();
            }

            var lastScroll;
            function scroll() {
                if (!active.length) {
                    return;
                }
                if (scrollbar.scrollLeft() === lastScroll) {
                    return;
                }
                lastScroll = scrollbar.scrollLeft();
                active.scrollLeft(lastScroll);
            }

            function update() {
                if (!active.length) {
                    return;
                }
                if (active.scrollLeft() === lastScroll) {
                    return;
                }
                lastScroll = active.scrollLeft();
                scrollbar.scrollLeft(lastScroll);
            }

            scrollbar.scroll(throttled);

            onscroll();
            $(window).scroll(onscroll);
            $(window).resize(onscroll);
        }
    }
})();
