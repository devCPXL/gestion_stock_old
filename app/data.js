app.factory("Data", ['$http', '$location',
    function ($http, $q, $location) {

        var serviceBase = 'api/v1/';

        var obj = {};

        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
		/*
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
		*/
        obj.remove = function (q) {
            return  $http['delete'](serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        return obj;
}]);


//app.factory('Page', function() {
//    var title = 'Gestion Stock Web Application';
//    return {
//        title: function() { return title; },
//        setTitle: function(newTitle) { title = newTitle }
//    };
//});

app.factory('myService', function() {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }
});

app.factory('jsonNumericCheck', function(){
    function d(data){
        for (var key in data) {
            if(data.hasOwnProperty(key)){
                var obj = data[key];
                for (var prop in obj) {
                    if(obj.hasOwnProperty(prop)){
                        //console.log(prop + " = " + obj[prop]);
                        if(!isNaN(obj[prop]) && obj[prop]){
                            obj[prop] = parseInt(obj[prop]);
                        }
                    }
                }
            }
        }
        return data;
    }
    return {d:d};
});

app.factory('generateCodeFile', function(){
    function g(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 23; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    return {g:g};
});
