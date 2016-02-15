app.controller('stocksRvaCtrl', function ($scope, $rootScope, $modal, $filter, Data, $location, $window, myService, jsonNumericCheck) {
    $scope.stock = {};


    $scope.boxFamily = '';
    $scope.loadData = function(){

        Data.get('stocks').then(function(data){
            $scope.stocks = jsonNumericCheck.d(data.data);

            //var nameFamily = '';
            //
            //for(var key in $scope.stocks){
            //    if($scope.stocks.hasOwnProperty(key)){
            //
            //        if($scope.stocks[key].nameFamily != nameFamily){
            //            nameFamily = $scope.stocks[key].nameFamily;
            //            $scope.stocks.splice( key, 0,
            //                {
            //                    type                : 'hr',
            //                    //nom_article         : nameFamily,
            //                    salleDescription    : '',
            //                    nameFamily          : nameFamily,
            //                    status              : "Active"
            //                }
            //            )
            //        }
            //    }
            //}

        });

        //Data.get('articles/'+id_serviceRva).then(function(data){
        //    $scope.articles = data.data;
        //    $scope.filterArticle = {
        //        nom_article : $scope.articles[0].description_f
        //    };
        //});

        //Data.get('salles').then(function(data){
        //    $scope.salles = data.data;
        //    $scope.filterSalle = {
        //        salleDescription : $scope.salles[0].description_f
        //    };
        //});

    };
    $scope.loadStocks = function(){
        Data.get('stocks').then(function(data){
            $scope.stocks = jsonNumericCheck.d(data.data);
        });
    };
    $scope.loadData();


    $scope.changeStockStatus = function(stock){
        stock.status = (stock.status=="Active" ? "Inactive" : "Active");
        Data.put("stocks/"+stock.id_stock,{status:stock.status});
    };

    $scope.changeStockAvailability = function(stock){
        stock.availability = (stock.availability == "Available" ? "Not_Available" : "Available");
        Data.put("stocks/"+stock.id_stock,{availability:stock.availability});
    };

    $scope.changeStockAlert = function(stock){
        //console.log('stock_alert : '+stock.stock_alert);
        Data.put("stocks/"+stock.id_stock,{stock_alert:stock.stock_alert});
    };

    $scope.changeStockMin = function(stock){
        //console.log('stock_min : '+stock.stock_min);
        Data.put("stocks/"+stock.id_stock,{stock_min:stock.stock_min});
    };

    $scope.onFocusNumber = function(){
        console.log('onFocus');
    };

    $scope.openStockEditAddMvt = function (p, size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/RVA/stockEditAddMvt.html',
          controller: 'stockRvaEditAddMvtCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(stock) {
            console.log(stock);
            $scope.loadStocks();
            $scope.filterArticle = {'nom_article' : stock.stockArticle.nom_article};
        });
    };

    $scope.openStockEdit = function (p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/stockEdit.html',
            controller: 'stockRvaEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function(stock) {
            console.log(stock);
            $scope.loadStocks();
            $scope.filterArticle = {'nom_article' : stock.stockArticle.nom_article};

        });
    };

    $scope.openStockAdd = function (p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/StockAdd.html',
            controller: 'stockRvaAddCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {
            console.log(selectedObject);
            $scope.loadStocks();

            $scope.filterArticle.nom_article = selectedObject;
        });
    };

    $scope.openStockDelivery = function(p,size){
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/stockDelivery.html',
            controller: 'stockRvaDeliveryCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function() {
            $scope.loadStocks();
        });
    };

    $scope.openStockDeliveryList = function(p,size){
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/stockDeliveryList.html',
            controller: 'stockRvaDeliveryListCtrl',
            size: size,
            resolve: {
                item: function(){
                    return p;
                }
            }
        });
        modalInstance.result.then(function() {
        });
    };

    $scope.openDeliveryList = function(p,size){
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/stockDeliveryList.html',
            controller: 'stockRvaDeliveryListCtrl',
            size: size,
            resolve: {
                item: function(){
                    return false;
                }
            }
        });
        modalInstance.result.then(function() {
        });
    };

    $scope.getListMvt = function(stock){
        console.log(stock);
        var str = document.URL;
        //myService.set(stock);
        var n = str.indexOf("#");
        var host = str.substring(0, n);
        //var name_article = stock.nom_article.replace(/[^a-zA-Z ]/g, ""); // Remove all special characters except space from a string
        $window.stock = stock;
        $window.open(host+'#/RVA/MouvementsStock/'+stock.id_stock, '_blank');
    };

    $scope.openOrderInternal = function(p,size){
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/orderInternal.html',
            controller: 'orderInternalCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function() {

        });
    };

    $scope.openOrderInternalFinalize = function(p, size){
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/orderInternalFinalize.html',
            controller: 'orderInternalFinalizeCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function() {

        });
    };

    $scope.openStockStatus = function(){
        var str = document.URL;
        var n = str.indexOf("#");
        var host = str.substring(0, n);
        host = host.replace('index.html','');
        $window.open(host+'api/v1/StockStatusPDF', '_blank');
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){

        $('#filterArticle, #filterSalle, #filterFamily').selectpicker();
        $('#filterArticle, #filterSalle, #filterFamily').selectpicker('refresh');

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
        //{text:"ID",predicate:"id_stock",sortable:true,dataType:"number"},
        {text:"Salle_Stock",predicate:"Salle_Stock",sortable:true, class:'hidden-xs'},
        {text:"ARTICLE",predicate:"ARTICLE",reverse:true,sortable:true,dataType:"number"},
        {text:"COND",predicate:"COND ",sortable:true},
        {text:"REF",predicate:"REF ",sortable:true},
        {text:"FAMILLE",predicate:"Famille",sortable:true},
        {text:"STOCK",predicate:"STOCK ",sortable:true},
        {text:"BESOIN",predicate:"BESOIN",sortable:true},
        //{text:"ALERT",predicate:"ALERT ",sortable:true},
        {text:"LISTE",predicate:"LISTE",sortable:true},
        {text:"INV",predicate:"INV",sortable:true},
        //{text:"Stocks",predicate:"Stocks",sortable:true},
        {text:"RECEPTION",predicate:"RECEPTION"}
        ,{text:"STATUS",predicate:"STATUS",sortable:true}
    ];

});


app.controller('stockRvaEditAddMvtCtrl', function ($scope, $route, $modal, $modalInstance, item, Data, toaster) {

    $scope.title = 'Ajouter Mouvement';
    $scope.buttonText = 'Ajouter Mouvement';
    $scope.to_stocksArticle = [];
    $scope.quantiteMax = 100;

    $scope.loadData = function () {
        Data.get('salles').then(function(data){
            $scope.salles = data.data;
            $scope.stockMvt = { id_salle : null};
        });
    };

    $scope.loadData();

    $scope.changeSalleStock = function(id_salle){
        Data.get('stocksSalles/'+id_salle).then(function(data){
            if(data.data.length > 0){
                $scope.stocksArticle = data.data;
                $scope.to_stocksArticle = [];
                var first_id_article = JSON.stringify($scope.stocksArticle[0]);
                //console.log(first_id_article);
                $scope.stockMvt = {
                    id_salle : id_salle,
                    stockArticle : '',
                    date_mvt : $scope.stockMvt.date_mvt,
                    quantite : $scope.stockMvt.quantite
                };
            }else{
                $scope.stocksArticle = [''];
                $scope.stockMvt = {
                    id_salle : id_salle,
                    stockArticle : '',
                    date_mvt : $scope.stockMvt.date_mvt,
                    quantite : $scope.stockMvt.quantite
                };
            }

        });
    };

    $scope.changeStockArticle = function(stockArticle){
        var stockArticle = JSON.parse(stockArticle);
        $scope.quantiteMax = stockArticle.quantite_current;
        //$scope.stockMvt.quantite = $scope.quantiteMax %2;
        var to_stockArticle = [];
        Data.put('stocksTo',stockArticle).then(function(data){
            if(data.data.length > 0){
                $scope.to_stocksArticle = data.data;
                to_stockArticle = JSON.stringify($scope.to_stocksArticle[0]);
                $scope.stockMvt = {
                    id_salle : stockArticle.id_location,
                    stockArticle : JSON.stringify(stockArticle),
                    to_stockArticle : to_stockArticle,
                    date_mvt : $scope.stockMvt.date_mvt,
                    quantite : ($scope.stockMvt.quantite > $scope.quantiteMax)? $scope.quantiteMax : $scope.stockMvt.quantite
                };
            }
            else{
                $scope.to_stocksArticle = [];
                $("#SelectStockArticleTo option").remove();
                $("#SelectStockArticleTo").selectpicker('refresh');
                to_stockArticle = '';
                $scope.stockMvt = {
                    id_salle : stockArticle.id_location,
                    stockArticle : JSON.stringify(stockArticle),
                    to_stockArticle : to_stockArticle,
                    date_mvt : $scope.stockMvt.date_mvt,
                    quantite : ($scope.stockMvt.quantite > $scope.quantiteMax)? $scope.quantiteMax : $scope.stockMvt.quantite
                };
            }
        });
    };

    $scope.stock = angular.copy(item);

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        $('#SelectStockSalle, #SelectStockArticle, #SelectStockArticleTo').selectpicker();
        $('#SelectStockSalle, #SelectStockArticle, #SelectStockArticleTo').selectpicker('refresh');
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };


    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.stock);
    };

    $scope.saveStockMvt = function (stockMvt) {
        stockMvt.uid = $scope.uid;
        console.log(stockMvt);

        stockMvt.stockArticle = JSON.parse(stockMvt.stockArticle);
        stockMvt.to_stockArticle = JSON.parse(stockMvt.to_stockArticle);
        stockMvt.type_mvt = 'INTERNAL';

        console.log(stockMvt);
        $modalInstance.close(stockMvt);
        Data.post('StockMvt', stockMvt).then(function (result) {
            if(result.status != 'error'){
                console.log(result)
                $modalInstance.close(stockMvt);
                toaster.pop('success', "succés", '<ul><li>Ajout effectué avec succés</li></ul>', 5000, 'trustedHtml');
            }else{
                console.log(result);
                $modalInstance.close();
                toaster.pop('error', "Erreur", '<ul><li>Erreur pendant l \'Ajout du mouvement</li></ul>', null, 'trustedHtml');
            }
        });
    };
});

app.controller('stockRvaEditCtrl', function ($scope, $route, $filter, $modalInstance, item, Data, toaster) {

    console.log(item);

    //if(item.type_form == 'INVENTORY'){
    $scope.displayFormINV = true;
    $scope.title = 'Inventaire';
    $scope.subTitle = item.nom_article;
    $scope.buttonText = 'Ajouter Inventaire'
    //}
    //else if(item.type_form == 'UPDATESTOCK'){
    //    $scope.displayFormUpdateStock = true;
    //    $scope.title = 'Mise à jour Stock Min & Alert';
    //    $scope.buttonText = 'Mise à jour Stock'
    //}

    //displayFormINV
    //displayFormUpdateStock

    var DateNow = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.stockMvt = {
        date_mvt : DateNow,
        quantite : item.quantite_current,
        stock_min : item.stock_min,
        stock_alert : item.stock_alert
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.stock);
    };

    $scope.saveStockMvt = function(stockMvt){
        stockMvt.uid = $scope.uid;
        stockMvt.stockArticle = item;
        stockMvt.to_stockArticle = item;
        stockMvt.type_mvt = 'INVENTORY';

        console.log(stockMvt);
        Data.post('StockMvt', stockMvt).then(function (result) {
            if(result.status != 'error'){
                console.log(result)
                toaster.pop('success', "succés", '<ul><li>Mouvement Inventaire effectué avec succés</li></ul>', 5000, 'trustedHtml');
                $modalInstance.close(stockMvt);

            }else{
                console.log(result);
                toaster.pop('error', "Erreur", '<ul><li>Erreur pendant l \'Ajout du Mouvement Inventaire</li></ul>', null, 'trustedHtml');
                $modalInstance.close();
            }
        });
    };
});


app.controller('stockRvaAddCtrl', function ($scope, $route, $modal, $modalInstance, item, Data, toaster) {

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
        Data.get('articlesToAddStock/'+id_location+'/'+ID_RVA_SERVICE).then(function(data){
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
        $('#SelectSalle, #SelectArticle, #SelectFamily').selectpicker();
        $('#SelectSalle, #SelectArticle, #SelectFamily').selectpicker('refresh');
    });

});

app.controller('stockRvaDeliveryCtrl', function ($scope, $route, $modal, $modalInstance, $filter, item, Data, toaster) {
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

app.controller('orderInternalCtrl', function ($scope, $route, $modal, $window, $modalInstance, item, Data, $filter, generateCodeFile, toaster) {

    var DateNow = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.title = 'COMMANDE HEBDOMADAIRE';
    $scope.buttonText = 'Générer & Télécharger';
    $scope.btDownloadFile = true;
    $scope.linkFile = "";
    $scope.orderInternal = {};
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };

    $scope.loadData = function () {
        Data.get('sallesFinalizeOrder').then(function(data){
            $scope.salles = data.data;
            $scope.orderInternal = {
                location: $scope.salles[0].id_salle,
                date: DateNow
            };
        });
    };

    $scope.loadData();

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        $('#SelectStockSalle').selectpicker();
        //$("#SelectStockSalle").selectpicker('val', $scope.salles[0]);
        $('#SelectStockSalle').selectpicker('refresh');
    });

    $scope.generateWeeklyOrderFile = function(orderInternal){

        var nameSalle = $('#SelectStockSalle option:selected').text().replace(/\s/g, '');
        var str = document.URL;
        var n = str.indexOf("#");
        var host = str.substring(0, n);
        host = host.replace('index.html','');
        //$window.salle = orderInternal.location;
        //console.log(encodeURIComponent(orderInternal.location));

        //Data.post('GenerateWeeklyOrderFilePDF', orderInternal.location).then(function (result) {
        //    $window.open(result);
        //});

        $window.open(host+'api/v1/GenerateWeeklyOrderFilePDF/' + orderInternal.location, '_blank');

    };

});


app.controller('stockRvaDeliveryListCtrl', function ($scope, $route, $modal, $modalInstance, $filter, item, Data, toaster) {

    console.log(item);
    $scope.title = 'Liste Reception ';
    if(item != false){
        $scope.title = $scope.title + item.salleDescription;
        $scope.subTitle = item.nom_article;
        var original = item;
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };

    $scope.isClean = function() {
        return angular.equals(original, $scope.stock);
    };

    $scope.loadData = function () {
        if(item != false){
            Data.get('movementSupplier/'+item.id_stock).then(function(data){
                $scope.movementSupplier = data.data;

            });
        }else
            Data.get('movementSupplier/gsm.to_id_stock').then(function(data){
                $scope.movementSupplier = data.data;
            });
    };
    $scope.stock = angular.copy(item);
    $scope.loadData();

    $scope.columns = [
        {text:"ID",predicate:"id_stock",sortable:true,dataType:"number"},
        {text:"FOURNISSEUR",predicate:"FOURNISSEUR",sortable:true},
        {text:"ARTICLE",predicate:"ARTICLE",sortable:true},
        {text:"BC",predicate:"BC",sortable:true},
        {text:"DATE COMMANDE",predicate:"Date Commande"},
        {text:"DATE RECEPTION",predicate:"Date Reception",sortable:true},
        {text:"QTE",predicate:"Quantite recu",sortable:true},
        {text:"PRIX HT",predicate:"prix Hors Tva",sortable:true},
        {text:"PPC",predicate:"Paquet par carton",sortable:true},
        {text:"NB CARTON",predicate:"nombre de carton"},
        {text:"COMMENTAIRE",predicate:"Commentaire",sortable:true}
    ];


});