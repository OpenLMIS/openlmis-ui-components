(function(){
    "use strict";

     angular.module("openlmis-core")
        .factory('PathFactory', PathFactory);

    function PathFactory(){
        return function(){
            // Make arguments object into array
            // PhantomJS treats arguments as object
            var args = [];
            angular.forEach(arguments, function(arg){
                if(arg && arg != "") args.push(arg);
            });

            var parts = [];
            angular.forEach(args, function(arg, index){
                // clone argument to prevent changing original values
                var uri = arg.slice(0);
                // remove trailing slash, unless last argument
                if(index != args.length-1 && uri[uri.length-1] == '/') uri = uri.substr(0, uri.length-1);
                // remove first slash, unless first argument
                if(index != 0 && uri[0] == '/') uri = uri.substr(1, uri.length);

                parts.push(uri);
            });
            var URL = parts.join('/');
            return URL;
        }
    }

})();