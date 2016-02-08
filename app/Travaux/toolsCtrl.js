/**
 * Created by lakroubassi.n on 4/08/2015.
 */
app.controller('toolsCtrl', function ($scope, $rootScope, $modal, $filter, Data, $location, $window, myService, jsonNumericCheck) {
    $scope.stock = {};
    $scope.filterFamily = null;
    //console.log($scope.filterFamily);

    $scope.loadData = function(){

        Data.get('tools/'+$rootScope.id_service).then(function(data){
            $scope.tools = jsonNumericCheck.d(data.data);
            $scope.filterFamily = {description : ''};

        });

        Data.get('familys/'+$rootScope.id_service).then(function(data){
            $scope.familys = data.data;
        });

        Data.get('locations').then(function(data){
            $scope.locations = data.data;
        });

    };

    //$scope.loadStocks = function(){
    //    Data.get('stocks').then(function(data){
    //        $scope.stocks = jsonNumericCheck.d(data.data);
    //    });
    //};

    $scope.loadData();

    $scope.changeStockStatus = function(stock){
        stock.status = (stock.status=="Active" ? "Inactive" : "Active");
        Data.put("stocks/"+stock.id_stock,{status:stock.status});
    };

    $scope.openAddTool = function (p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/TRAVAUX/articleEdit.html',
            controller: 'articleTravauxEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                },
                stockMagasin: function () {
                    return true;
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {

            //p.nom = selectedObject.nom;
            //p.mark = selectedObject.mark;
            //p.code_barre = selectedObject.code_barre;
            // ============= After 1500ms LoadData ========= //
            //setTimeout(function() { $scope.loadData(); }, 1500);

            $scope.loadData();

            //$scope.filterArticle.nom_article = selectedObject;
        });
    };
    $scope.openAddMvt = function(p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/TRAVAUX/stockAddMvtTool.html',
            controller: 'addMvtCtrl',
            size: size,
            resolve: {
                type_stock: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {
            //console.log(selectedObject);
            $scope.loadData();
        });
    };

    $scope.getListMvt = function(stock){
        console.log(stock);
        var str = document.URL;
        myService.set(stock);
        var n = str.indexOf("#");
        var host = str.substring(0, n);
        var name_article = stock.nom.replace(" ", "_");
        $window.stock = stock;
        $window.open(host+'#/TRAVAUX/Stock/'+stock.id_stock, '_blank');
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        $('#filterTool').selectpicker();
        $('#filterTool').selectpicker('refresh');
        $('#filterFamily').selectpicker();
        $('#filterFamily').selectpicker('refresh');
        $('#filterLocation').selectpicker();
        $('#filterLocation').selectpicker('refresh');

        var i= 1;
        $('.tableFloatingHeader th').each(function() {
            tdWidth = $(this).outerWidth();
            $(".tableFloatingHeaderOriginal th:nth-of-type("+i+")").css({'min-width': tdWidth+'px' , 'max-width': tdWidth+'px' });
            //console.log(i + ' : ' + tdWidth);
            i++;
        });

    });

    $scope.go = function ( path ) {
        $location.path( path );
    };

    $scope.columns = [
        {text:"MAGASIN/CHANTIER",predicate:"MAGASIN/CHANTIER"},
        {text:"NOM",predicate:"NOM"},
        {text:"MODELE",predicate:"MODELE"},
        {text:"MARQUE",predicate:"MARQUE"},
        {text:"TYPE",predicate:"TYPE"},
        {text:"DESCRIPTION",predicate:"DESCRIPTION"},

        {text:"ETAT STOCK",predicate:"ETAT STOCK"},
        //{text:"QTE",predicate:"QTE"},
        {text:"FAMILLE",predicate:"FAMILLE"},
        {text:"ACTION",predicate:"ACTION"},
        {text:"LISTE",predicate:"LISTE"},
        //{text:"STATUS",predicate:"STATUS"}
    ];

});
