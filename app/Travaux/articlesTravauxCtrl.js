app.controller('articlesTravauxCtrl', function ($rootScope, $scope, $modal, $filter, Data) {
    $scope.article = {};
    $scope.familyFilter = [];

    $scope.loadData = function(){

        Data.get('familys/'+$rootScope.id_service).then(function(data){
            $scope.familys = data.data;
        });

        Data.get('articles/'+$rootScope.id_service).then(function(data){
            $scope.articles = data.data;
        });

    };
    $scope.loadData();

    $scope.changeArticleStatus = function(article){
        article.status = (article.status=="Active" ? "Inactive" : "Active");
        Data.put("articles/"+article.id_article,{status:article.status});
    };

    $scope.open = function (p,size) {
        //if(angular.isUndefined(p.id_article)){
        //    p.id_family = 1;
        //}
        var modalInstance = $modal.open({
          templateUrl: 'partials/TRAVAUX/articleEdit.html',
          controller: 'articleTravauxEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            },
            stockMagasin: function () {
              return false;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            //if(selectedObject.save == "insert"){
            //    selectedObject.family = $('#SelectFamily option:selected').text();
            //    $scope.articles.push(selectedObject);
            //    $scope.articles = $filter('orderBy')($scope.articles, 'id_article', 'reverse');
            //
            //}else if(selectedObject.save == "update"){
            //    p.description_f = selectedObject.description_f;
            //    p.code_barre    = selectedObject.code_barre;
            //    p.quantite      = selectedObject.quantite;
            //    p.unite         = selectedObject.unite;
            //    p.id_family     = selectedObject.id_family;
            //    p.family        = selectedObject.family;
            //    p.vat           = selectedObject.vat;
            //}
            $scope.loadData();
        });
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        //$('#filterFamily').selectpicker();
        $('#filterFamily').selectpicker('refresh');

        var i= 1;
        $('.tableFloatingHeader th').each(function() {
            tdWidth = $(this).outerWidth();
            $(".tableFloatingHeaderOriginal th:nth-of-type("+i+")").css({'min-width': tdWidth+'px' , 'max-width': tdWidth+'px' });
            //console.log(i + ' : ' + tdWidth);
            i++;
        });
    });

    $scope.columns = [
        {text:"ID",predicate:"id_article",sortable:true,dataType:"number"},
        {text:"MARQUE",predicate:"Marque",sortable:true},
        {text:"MODELE",predicate:"Modele",sortable:true},
        {text:"REFERENCE",predicate:"REFERENCE",sortable:true},
        {text:"TYPE",predicate:"Type",sortable:true},
        {text:"DESCRIPTION",predicate:"DESCRIPTION",sortable:true},
        //{text:"QUANTITE",predicate:"quantite",reverse:true,sortable:true,dataType:"number"},
        {text:"TVA",predicate:"vat",sortable:true},
        {text:"FAMILLE",predicate:"FAMILLE",sortable:true},
        {text:"STATUS",predicate:"status",sortable:true},
        {text:"ACTION",predicate:"",sortable:false}
    ];

});


app.controller('articleTravauxEditCtrl', function ($rootScope, $scope, $route, $modal, $modalInstance, item, Data, stockMagasin) {
    var id_suppliers = [];

    if (typeof item === "undefined") {
        item = {};
        $scope.article = {};
    }
    else{
        $scope.article = angular.copy(item);
    }

    console.log(item);

    $scope.loadData = function () {
        //Data.get('familys/'+$rootScope.id_service).then(function(data){
        //    $scope.familys = data.data;
        //    if(!item.id_article > 0)
        //        $scope.article.id_family = $scope.familys[0].id_family;
        //});

        if(stockMagasin){
            Data.get('familysTools/'+$rootScope.id_service).then(function(data){
                $scope.familys = data.data;
                if(!item.id_article > 0)
                    $scope.article.id_family = $scope.familys[0].id_family;
            });
        }else
            Data.get('familys/'+$rootScope.id_service).then(function(data){
                $scope.familys = data.data;
                if(!item.id_article > 0)
                    $scope.article.id_family = $scope.familys[0].id_family;
            });

        Data.get('suppliers/'+$rootScope.id_service).then(function(data){
            $scope.suppliers = data.data;
        });
    };

    $scope.loadData();

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };

    $scope.title = (item.id_article > 0) ? 'Editer article' : (stockMagasin) ? 'Ajouter Outil' : 'Ajouter article';
    $scope.buttonText = (item.id_article > 0) ? 'Mise à jour article' : 'Ajouter nouveau article';

    if(item.id_article > 0){
        id_suppliers = [];
        Data.get('stocksSuppliers/'+item.id_article).then(function(data){
            $scope.id_suppliers = data.data;
            console.log(data.data);
            if(data.data != "" && $scope.id_suppliers != null){
                $scope.id_suppliers.forEach(function(entry) {
                    id_suppliers.push(entry.id_location.toString());
                });
                $scope.article["id_suppliers"] = id_suppliers;
            }
        });
    }

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){

        $('#SelectFamily, #SelectSupplier').selectpicker();


        if(item.id_article > 0){
            $("#SelectFamily").selectpicker('val', item.id_family);
            $("#SelectSupplier").selectpicker('val', id_suppliers);
            $scope.article.id_suppliers.forEach(function(entry) {
                $('#SelectSupplier option[value='+entry+']').prop('disabled', true);
            });
        }

        $('#SelectFamily, #SelectSupplier').selectpicker('refresh');
    });

    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.article);
    };
    $scope.saveArticle = function (article) {
        console.log(article);
        article.family = $('#SelectFamily option:selected').text();
        article.uid = $scope.uid;
        if(article.id_article > 0){

            console.log("before : " + article.id_suppliers);
            id_suppliers.forEach(function(entry) {
                article.id_suppliers = jQuery.grep(article.id_suppliers, function(value) {
                    return value != entry;
                });
            });
            console.log("after : " + article.id_suppliers);
            article.stockMagasin = stockMagasin; // For manage tools to create stock to the Article
            article.id_service = $rootScope.id_service; // define which service
            console.log(article);

            Data.put('articles/'+article.id_article, article).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(article);
                    x.save = 'update';
                    //delete $scope.article.id_suppliers_to_delete;
                    $modalInstance.close(x);
                }else{
                    console.log(result);
                }
            });
        }else{
            article.status = 'Active';
            article.id_service = $rootScope.id_service; // define which service
            article.stockMagasin = stockMagasin; // For manage tools to create stock to the Article
            Data.post('articles', article).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(article);
                    x.save = 'insert';
                    x.id_article = result.data;
                    $modalInstance.close(x);
                }else{
                    console.log(result);
                }
            });
        }
    };

    $scope.openFamilyForm = function (p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/familyEdit.html',
            controller: 'familyEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                },
                id_service: function(){
                    return $rootScope.id_service;
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {
            $scope.familys = {};
            //-- Reload scope familys
            Data.get('familys/'+$rootScope.id_service).then(function(data){
                $scope.familys = data.data;
            });

            $route.reload();

            if(selectedObject.save == "insert"){
                //$scope.loadData();
                //$route.reload();
            }else if(selectedObject.save == "update"){

                //$route.reload();
            }
        });
    };
});