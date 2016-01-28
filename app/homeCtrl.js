/**
 * Created by lakroubassi.n on 15/07/2015.
 */
app.controller('homeCtrl', function ($scope,$rootScope, $location, $route, Data) {
    console.log('homeCtrl');
    console.log($rootScope.rva);
    console.log($rootScope.travaux);
    $scope.go = function ( path ) {
        console.log(path);
        var pathArray = path.split("/");
        pathArray.shift();
        $rootScope.id_service = (pathArray[0] == 'RVA') ? ID_RVA_SERVICE : ((pathArray[0] == 'TRAVAUX') ? ID_TRAVAUX_SERVICE : '');

        //$rootScope.rva = (pathArray[0] == 'RVA') ? true : false;
        //$rootScope.travaux = (pathArray[0] == 'RVA') ? id_serviceRva : ((pathArray[0] == 'TRAVAUX') ? id_serviceTravaux : '');
        console.log(pathArray);
        $location.path( path );
    };
});