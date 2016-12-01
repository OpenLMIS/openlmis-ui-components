angular.module('openlmis.administration').filter('orderObjectsBy', function(){
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;

        var columns = [];

        for(var objectKey in input) {
            columns.push(input[objectKey]);
        }
        return columns.sort(sort);;

        function sort(a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        }
    }
});
