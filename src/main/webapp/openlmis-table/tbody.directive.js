(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-table:tbodyTitle
     *
     * @description
     * Takes the title attribute from a tbody element and changes it into a stylable banner.
     *
     * @example
     * To add a title heading to any tbody element, just add a title element with a translated string (this element will not translate strings for you)
     * ```
     * <table>
     *   <tbody title="Category Title">
     *     <tr><td>123</td><td>456</td></tr>
     *     <tr><td>Foo</td><td>Bar</td></tr>
     *   </tbody>
     * </table>
     * ```
     * Which will produce the following markup
     * ```
     * <table>
     *   <tbody>
     *     <tr class="title"><td colspan="2"><div>Category Title</div></td></tr>
     *     <tr><td>123</td><td>456</td></tr>
     *     <tr><td>Foo</td><td>Bar</td></tr>
     *   </tbody>
     * </table>
     * ```
     */
    angular
        .module('openlmis-table')
        .directive('tbody', tbodyTitle);

    tbodyTitle.$inject = ['$compile'];
    function tbodyTitle($compile) {
        var template = '<tr class="title"><td colspan="{{colspan}}" ><div class="sticky" style="width:{{width}}">{{title}}</div></td></tr>';

        return {
            restrict: 'E',
            replace: false,
            link: link
        };

        function link(scope, element, attrs) {
            if(attrs.title && attrs.title != ""){
                var titleScope = scope.$new(true);

                titleScope.title = attrs.title;
                element.removeAttr('title');

                scope.$watch(function(){
                    return element.children('tr:not(.title):first').children('td, th').length;
                }, function(num){
                    titleScope.colspan = num
                });

                var titleElement = $compile(template)(titleScope);
                element.prepend(titleElement);

                scope.$watch(function(){
                    var tableElement = element.parent('table');
                    if(tableElement.width() > tableElement.parent().width()){
                        return tableElement.parent().width();
                    }
                    return false;
                }, function(width){
                    if(width){
                        titleScope.width = width + 'px';
                    } else {
                        titleScope.width = 'auto';
                    }
                });

            }
        }
    }

})();
