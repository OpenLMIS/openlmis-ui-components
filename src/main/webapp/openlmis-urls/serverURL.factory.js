(function(){
    "use strict";

    angular.module("openlmis-urls")
        .service("OpenlmisURLService", OpenlmisURLService);

    OpenlmisURLService.$inject = ['PathFactory'];
    function OpenlmisURLService(PathFactory){
        var service = {};

        service.url = "/";
        service.format = formatURL;
        service.check = checkURL;

        // The serverURL can be set with a grunt build argument
        // --serverURL=http://openlmis.server:location
        var serverURL = "@@OPENLMIS_SERVER_URL";
        if(serverURL.substr(0,2) != "@@"){
            service.url = serverURL;
        }

        var serverURLs = [];
        var bypassURLs = ["ui-grid", "bootstrap", "uib"];
        function addURLtoServerURLs(url){
            var rootURL = getRootURL(url);
            if(!checkURL(rootURL)){
                serverURLs.push(rootURL);
            }
        }

        function getRootURL(url){
            var offset = 0;
            if(url.substr(0, 7).toLowerCase() == 'http://'){
                offset = 7;
            } else if(url.substr(0, 8).toLowerCase() == 'https://'){
                offset = 8;
            }

            var splitPosition = undefined;
            var firstBackslashPosition = url.substr(offset).indexOf("/");
            if(firstBackslashPosition >= 1){
                splitPosition = offset + url.substr(offset).indexOf("/");
            }
            return url.substr(0, splitPosition);
        }

        function formatURL(){
            var parts = [];
            angular.forEach(arguments, function(arg, index){
                if(index==0 && arg.substr(0, 4).toLowerCase() == 'http'){
                    addURLtoServerURLs(arg);
                } else if(index==0) {
                    parts.push(service.url);
                }
                parts.push(arg);
            });
            return PathFactory.apply(this, parts);
        }

        function checkURL(url){
            var urlsToCheck = serverURLs.concat(service.url);
            for(var i=0; i<bypassURLs.length; i++){
                if(url.substring(0, bypassURLs[i].length) == bypassURLs[i]){
                    return false;
                }
            }
            for(var i=0; i<urlsToCheck.length; i++){
                if(url.indexOf(urlsToCheck[i]) == 0){
                    return true;
                }
            }
            return false;
        }

        return service;
    }

    angular.module("openlmis-core")
        .factory("OpenlmisURL", OpenlmisURLFactory);

    OpenlmisURLFactory.$inject = ['OpenlmisURLService'];
    function OpenlmisURLFactory(OpenlmisURLService){
        return function(){
            return OpenlmisURLService.format.apply(this, arguments);
        }
    }

})();
