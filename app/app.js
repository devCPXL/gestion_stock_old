'use strict';

var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'toaster']); // 'angularFileUpload'

//var id_serviceRva = 260, id_serviceTravaux = 370;
var id_serviceRva = 15, id_serviceTravaux = 19;

const ID_RVA_SERVICE = 15;
const ID_TRAVAUX_SERVICE = 19;

app.config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/home', {
          title: 'Home',
          templateUrl: 'partials/home.html',
          controller: 'homeCtrl'
        })
        .when('/RVA/Articles', {
            title: 'Articles',
            templateUrl: 'partials/RVA/articles.html',
            controller: 'articlesCtrl'
        })
        .when('/RVA/Salles', {
            title: 'Salles',
            templateUrl: 'partials/RVA/salles.html',
            controller: 'sallesCtrl'
        })
        .when('/RVA/Batiments', {
          title: 'Batiments',
          templateUrl: 'partials/RVA/batiments.html',
          controller: 'batimentsCtrl'
        })
        .when('/RVA/Suppliers', {
            title: 'FOURNISSEUR',
            templateUrl: 'partials/RVA/suppliers.html',
            controller: 'suppliersCtrl'
        })
        .when('/RVA/Stocks', {
            title: 'STOCKS',
            templateUrl: 'partials/RVA/stocks.html',
            controller: 'stocksRvaCtrl'
        })
        .when('/RVA/stockstatus', {
            title: 'Stock Status',
            templateUrl: 'php/StockStatus.php'
        })
        .when('/RVA/Exceltohtml', {
            title: 'Stock Status',
            templateUrl: 'partials/RVA/test_lecture_xls.php'
        })
        .when('/RVA/listArticleXls', {
            title: 'listArticleXls',
            templateUrl: 'partials/RVA/listArticleXls.php'
        })
        .when('/RVA/Stock/:type/:id', {
            title: 'Liste de Mouvements',
            templateUrl: 'partials/RVA/movementList.html',
            controller: 'listMvtCtrl'
        })
        .when('/RVA/angularjsFileUpload', {
            title: 'File Upload',
            templateUrl: 'partials/RVA/angularjsFileUpload.html'
            ,controller: 'AppController'
        })
        .when('/RVA/FinalizeOrder', {
            title: 'Finaliser Commande Etage',
            templateUrl: 'partials/RVA/finalizeOrder.html',
            controller: 'finalizeOrderCtrl'
        })
        .when('/TRAVAUX/Articles', {
            title: 'Liste Travaux Articles',
            templateUrl: 'partials/TRAVAUX/articles.html',
            controller: 'articlesTravauxCtrl'
        })
        .when('/TRAVAUX/Suppliers', {
            title: 'Liste Travaux Suppliers',
            templateUrl: 'partials/RVA/suppliers.html',
            controller: 'suppliersCtrl'
        })
        .when('/TRAVAUX/Chantiers', {
            title: 'Liste Travaux Chantiers',
            templateUrl: 'partials/TRAVAUX/locations.html',
            controller: 'locationsCtrl'
        })
        .when('/TRAVAUX/Stocks', {
            title: 'Liste Outils',
            templateUrl: 'partials/TRAVAUX/stocks.html',
            controller: 'stocksTravauxCtrl'
        })
        .when('/TRAVAUX/Tools', {
            title: 'Gestion Outils',
            templateUrl: 'partials/TRAVAUX/Tools.html',
            controller: 'toolsCtrl'
        })
        .when('/TRAVAUX/Stock/:id', {
            title: 'Liste de Mouvements',
            templateUrl: 'partials/TRAVAUX/movementList.html',
            controller: 'listMvtTravauxCtrl'
        })
        .when('/measuremnt', {
            title: 'formDate',
            templateUrl: 'partials/formDate.html',
            controller: 'formDateCtrl'
        })
        .when('/RVA/readXlsx', {
            title: 'readXlsx',
            templateUrl: 'partials/readXlsx.php'
        })
        .otherwise({
            redirectTo: '/home'
        });
      //$locationProvider.html5Mode(true);
}]);

app.run(['$location', '$rootScope','Data', function($location, $rootScope, Data) {
	//console.log("app.run");
    $rootScope.authenticated = true;
    $rootScope.rva = true;
    $rootScope.travaux = true;

    //$rootScope.$_GET = {};
    //$rootScope.$_GET.agent_session = window.localStorage.getItem('agent_session');
    //$rootScope.$_GET.session_langue = window.localStorage.getItem('session_langue');
    //$rootScope.$_GET.session_username = window.localStorage.getItem('session_username');
    //if($rootScope.$_GET.session_username){
    //    Data.put('agent',$rootScope.$_GET).then(function(data){
    //        if(data.status == 'success'){
    //            $rootScope.authenticated = true;
    //            $rootScope.agent = data.data;
    //            $rootScope.agent_session = data.agent_session;
    //            $rootScope.rva = $.inArray('INTRA_STOCK_RVA', $rootScope.agent_session.session_group) > -1;
    //            $rootScope.travaux = $.inArray('INTRA_STOCK_TRAVAUX', $rootScope.agent_session.session_group) > -1;
    //
    //            //console.log($rootScope.agent_session);
    //            //console.log("location.path = /Home");
    //            //$location.path("/home");
		//		//$(location).attr('href', 'http://stackoverflow.com');
		//		//$location.path("/home");
		//		//angular.element(document.getElementById('homeCtrl')).scope();
    //
		//		var host = $location.host();
    //            var protocol = $location.protocol();
		//		//window.location.replace(protocol +'://'+ host +'/gestion_stock/index.html');
		//		//alert('utilisateure trouvee');
    //
    //        }
    //        else
    //            alert('utilisateure non trouvee');
    //    });
    //
    //}
    //else{
    //    var host = $location.host();
    //    var protocol = $location.protocol();
    //    window.location.replace(protocol +'://'+ host +'/coquille_intranet/index4.php');
    //}

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
    //    console.log("$routeChangeStart");
    //
        var pathArray = $location.path().split("/");
        pathArray.shift();
        $rootScope.id_service = (pathArray[0] == 'RVA') ? ID_RVA_SERVICE : ((pathArray[0] == 'TRAVAUX') ? ID_TRAVAUX_SERVICE : '');
    //
    //    Data.get('session').then(function (results) {
    //        //console.log(results);
    //        if ((results.agent) && (results.agent_session)) {
    //            $rootScope.authenticated = true;
    //            $rootScope.agent = results.agent;
    //            $rootScope.agent_session = results.agent_session;
    //            //console.log($rootScope.agent_session);
    //            //window.location.replace('index.html#/home');
    //
    //        } else {
    //            window.localStorage.clear();
    //            $rootScope.agent = {};
    //            $rootScope.agent_session = {};
    //            console.log($rootScope.agent_session);
    //            //$location.path("/home");
    //            var host = $location.host();
    //            var protocol = $location.protocol();
    //            window.location.replace(protocol +'://'+ host +'/coquille_intranet/index4.php');
    //        }
    //    });
    //
    //
    //    if(next.$$route && $rootScope.agent_session){
    //        var nextUrl = next.$$route.originalPath;
    //        var nextUrlArray = nextUrl.split("/");
    //        nextUrlArray.shift();
    //        //if($rootScope.agent_session)
    //        //    if(!($rootScope.agent_session.session_group.toString().indexOf(nextUrlArray[0]) > -1) || nextUrlArray[0] == 'home')
    //        //        $location.path("/home");
    //    }
    });


    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
	//console.log("$routeChangeSuccess");

    });

}]);

app.controller('NavCtrl', function($rootScope, $scope, $location, Data) {
    $scope.isActive = function(route) {
        $scope.path = $location.path();
        return $location.path() === route;
    };
    $scope.includes = function(s){
        //console.log(s);
        return $location.path().includes(s);
    };
    //$scope.logout = function () {
    //    Data.get('logout').then(function (results) {
		//	window.localStorage.clear();
		//	$rootScope.agent = {};
    //        $rootScope.agent_session = {};
		//
    //        var host = $location.host();
    //        var protocol = $location.protocol();
    //        window.location.replace(protocol +'://'+ host +'/coquille_intranet/index4.php');
    //        //Data.toast(results);
    //    });
    //}
});

app.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});

app.controller('formDateCtrl', function($scope, $location, Data) {
    console.log('formDateCtrl');
    $scope.measuremnt = {};
    Data.get('measuremnts').then(function(data){
        $scope.measuremnts = data.data;
        console.log(data.data);
    });

    $scope.savemeasuremnt = function(measuremnt){
        console.log(measuremnt);
        Data.put('measuremnts',measuremnt).then(function(data){
            $scope.measuremnts = data.data;
        });
    };

    $scope.columns = [
        {text:"stn",predicate:"stn",sortable:true},
        {text:"mml1",predicate:"mml1",sortable:true},
        {text:"mml2",predicate:"mml2 ",sortable:true},
        {text:"mm_start",predicate:"mm_start",sortable:true},
        {text:"mm_end",predicate:"mm_end",sortable:true}
    ];

});