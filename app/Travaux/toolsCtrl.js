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

            $scope.loadData()

            //$scope.filterArticle.nom_article = selectedObject;
        });
    };
    $scope.openMvtTool = function(p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/TRAVAUX/stockAddMvtTool.html',
            controller: 'stockAddMvtToolCtrl',
            size: size,
            resolve: {
                item: function () {
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
        $window.open(host+'#/TRAVAUX/Stock/'+name_article+'/'+stock.id_stock, '_blank');
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

app.controller('stockAddMvtToolCtrl', function ($scope, $route, $modal, $modalInstance, item, Data, toaster) {

    $scope.title = 'Ajouter mouvement';
    $scope.buttonText = 'Ajouter';
    $scope.toolMvt = {};
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.article);
    };

    $scope.loadData = function () {
        Data.get('locations').then(function(data){
            $scope.locations = data.data;
            //$scope.toolMvt.id_location = $scope.locations[0].id_location;
        });
    };
    $scope.loadData();

    $scope.changeLocation = function(id_location){
        $scope.locations_to = $scope.locations;
        //$scope.toolMvt.id_location_to = [''];
        //$('#SelectLocation_to').selectpicker();
        //$('#SelectLocation_to').selectpicker('refresh');
        Data.get('stocksLocation/TOOL/'+id_location).then(function(data){
            if(data.data.length > 0){
                $scope.stocksArticle = data.data;
                var first_id_article = JSON.stringify($scope.stocksArticle[0]);
                $scope.toolMvt.stockArticle = first_id_article;
                //$scope.changeStockArticle(first_id_article);
            }else{
                $scope.stocksArticle = [];
                //$scope.to_stocksArticle = [''];
            }
        });
        //console.log($scope.toolMvt);
    };

    $scope.changeStockArticle = function(stockArticle){
        var stockArticle = JSON.parse(stockArticle);
        $scope.quantiteMax = stockArticle.quantite_current;
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        //$('#SelectLocation, #SelectStockArticle, #SelectLocation_to').selectpicker();
        //$('#SelectLocation, #SelectStockArticle, #SelectLocation_to').selectpicker('refresh');

        $('#SelectStockArticle').selectpicker();
        $('#SelectStockArticle').selectpicker('refresh');

    });

    $scope.savetoolMvt = function(toolMvt){
        toolMvt.stockArticle = JSON.parse(toolMvt.stockArticle);
        toolMvt.type_mvt = 'INTERNAL';
        console.log(toolMvt);

        Data.post('ToolMvt',toolMvt).then(function(result){
            if(result.status != 'error'){
                console.log(result)
                $modalInstance.close();
                toaster.pop('success', "succés", '<ul><li>Ajout effectué avec succés</li></ul>', 5000, 'trustedHtml');
            }else{
                console.log(result);
                $modalInstance.close();
                toaster.pop('error', "Erreur", '<ul><li>Erreur pendant l \'Ajout du mouvement</li></ul>', null, 'trustedHtml');
            }
        });
    };

});
