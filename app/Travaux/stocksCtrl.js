app.controller('stocksTravauxCtrl', function ($scope, $rootScope, $modal, $filter, Data, $location, $window, myService, jsonNumericCheck) {
    $scope.stock = {};
    $scope.filterLocation = {};
    $scope.filterMaterial = {};
    $scope.filterfamily = {};

    $scope.loadData = function(){

        //*** Get All Materials ***//
        Data.get('stocksMaterials/gs.id_location').then(function(data){
            $scope.materials = data.data;
        });


    };

    $scope.loadData();

    $scope.clear = function(filterName) {
        $scope[filterName] = {};
    };

    $scope.changeMaterialStatus = function(stock){
        stock.status = (stock.status=="Active" ? "Inactive" : "Active");
        Data.put("stocks/"+stock.id_stock,{status:stock.status});
    };

    $scope.changeStockAvailability = function(stock){
        stock.availability = (stock.availability == "Available" ? "Not_Available" : "Available");
        Data.put("stocks/"+stock.id_stock,{availability:stock.availability});
    };

    $scope.openAddMvt = function (p, size) {
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
        modalInstance.result.then(function() {
            $scope.loadData();
        });
    };

    $scope.openAddInventory = function (p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/stockEdit.html',
            controller: 'stockEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function() {
            $scope.loadData();
        });
    };

    $scope.openAddMaterial = function (p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/TRAVAUX/articleEdit.html',
            controller: 'articleTravauxEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                },
                type_stock: function () {
                    return "MATERIAL";
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {
            $scope.loadData();
        });
    };

    $scope.getListMvt = function(stock){
        console.log(stock);
        var str = document.URL;
        //myService.set(stock);
        var n = str.indexOf("#");
        var host = str.substring(0, n);
        var name_article = stock.nom.replace(/ /g, '_');
        $window.stock = stock;
        $window.open(host+'#/TRAVAUX/MouvementsStock/'+stock.id_stock, '_blank');
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){

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
        {text:"MODELE",predicate:"MODELE"},
        {text:"DESCRIPTION",predicate:"DESCRIPTION"},
        {text:"REFERENCE",predicate:"REFERENCE"},
        {text:"TYPE",predicate:"TYPE"},
        {text:"UNITE",predicate:"UNITE"},
        {text:"QTE",predicate:"QTE"},
        {text:"FAMILLE",predicate:"FAMILLE"},
        {text:"ACTION",predicate:"ACTION"},
        {text:"LISTE",predicate:"LISTE"},
        {text:"STATUS",predicate:"STATUS"}
    ];

});

app.controller('addMvtCtrl', function ($scope, $route, $modal, $filter, $modalInstance, type_stock, Data, toaster) {
    $scope.title = 'Ajouter mouvement';
    $scope.buttonText = 'Ajouter';
    $scope.qteMax = 0;

    $scope.toolMvt = {
        date_mvt : $filter("date")(Date.now(), 'yyyy-MM-dd')
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
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

        Data.get('stocksLocation/'+type_stock+'/'+id_location).then(function(data){
            $scope.stocksArticle = data.data;
            if(data.data.length > 0){
                $scope.toolMvt.stockArticle = {}
            }else{
                $scope.stocksArticle = [];
            }
        });
        //console.log($scope.toolMvt);
    };
    $scope.changeStockArticle = function(){
        $scope.toolMvt.quantite = 1;
    };

    $scope.qteMax = $scope.toolMvt.quantite;

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
    });

    $scope.savetoolMvt = function(toolMvt){
        //toolMvt.stockArticle = JSON.parse(toolMvt.stockArticle);
        toolMvt.type_mvt = 'INTERNAL';
        toolMvt.type_stock = type_stock;
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


app.controller('stockTravauxAddCtrl', function ($scope, $route, $modal, $modalInstance, item, Data, toaster) {

    $scope.loadData = function () {
        Data.get('salles').then(function(data){
            $scope.salles = data.data;

            $scope.newStock = {
                //id_salle: null
            };
        });
    };

    $scope.changeSalleStock = function(id_location){
        $scope.articles = null; // clear the scope to trigger ngFinishRepeat function
        Data.get('articlesToAddStock/'+id_location+'/'+ID_TRAVAUX_SERVICE).then(function(data){
            if(data.data.length > 0){

                $scope.newStock = {
                    id_location: $scope.newStock.id_location,
                    id_article: data.data[0].id_article,
                    stock_alert: $scope.newStock.stock_alert,
                    stock_min: $scope.newStock.stock_min
                };
                $scope.articles = data.data;
            }
        });
    };

    $scope.loadData();

    $scope.title = 'Ajouter Stock';
    $scope.buttonText = 'Ajouter Stock';

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.stock);
    };

    $scope.saveNewStock = function (newStock) {
        console.log(newStock);
        Data.post('Stocks', newStock).then(function (result) {
            if(result.status != 'error'){
                console.log(result);
                toaster.pop('success', "succés", '<ul><li>Ajout effectué avec succés</li></ul>', 5000, 'trustedHtml');
                var selectedObject =  $('#SelectArticle option:selected').text();
                $modalInstance.close(selectedObject);

            }else{
                console.log(result);
                toaster.pop('error', "Erreur", '<ul><li>Erreur pendant l \'Ajout du Stock</li></ul>', null, 'trustedHtml');
                $modalInstance.close();
            }
        });
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        $('#SelectSalle, #SelectArticle').selectpicker();
        $('#SelectSalle, #SelectArticle').selectpicker('refresh');
    });

});

app.controller('stockDeliveryCtrl', function ($scope, $route, $modal, $modalInstance, $filter, item, Data, toaster) {
    var DateNow = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.title = 'Reception au Stock Economat';
    $scope.subTitle = item.nom_article;
    $scope.buttonText = 'Ajouter Reception';

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.stock);
    };

    $scope.loadData = function () {
        Data.get('stocksSuppliers/'+item.id_article).then(function(data){
            $scope.stocksSuppliers = data.data;
            console.log($scope.stocksSuppliers);
            $scope.DeliveryStock = {
                stockArticle: JSON.stringify($scope.stocksSuppliers[0]),
                date_mvt: DateNow,
                date_order: DateNow

            };
        });
    };
    $scope.stock = angular.copy(item);
    $scope.loadData();

    $scope.saveDeliveryStock = function(DeliveryStock){
        console.log(DeliveryStock);
        DeliveryStock.stockArticle = JSON.parse(DeliveryStock.stockArticle);
        DeliveryStock.to_stockArticle = $scope.stock;
        DeliveryStock.type_mvt = 'DELIVERY';

        DeliveryStock.quantite = DeliveryStock.quantite * DeliveryStock.pack_carton;
        DeliveryStock.price = DeliveryStock.price / DeliveryStock.pack_carton;
        //delete DeliveryStock.pack_carton;

        console.log(DeliveryStock);

        Data.post('StockMvt', DeliveryStock).then(function (result) {
            if(result.status != 'error'){
                console.log(result)
                toaster.pop('success', "succés", '<ul><li>Reception effectué avec succés</li></ul>', 5000, 'trustedHtml');
                $modalInstance.close();
            }else{
                console.log(result);
                toaster.pop('error', "Erreur", '<ul><li>Erreur pendant l \'Ajout de la Réception</li></ul>', null, 'trustedHtml');
                $modalInstance.close();
            }
        });
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        $('#SelectStockSupplier').selectpicker();
        $('#SelectStockSupplier').selectpicker('refresh');
    });

});




