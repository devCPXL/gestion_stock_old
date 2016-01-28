app.controller('articlesCtrl', function ($scope, $modal, $filter, $route, Data, jsonNumericCheck) {
    $scope.article = {};
    $scope.familyFilter = [];

    $scope.loadData = function(){

        Data.get('familys/'+ID_RVA_SERVICE).then(function(data){
            $scope.familys = data.data;
        });

        Data.get('articles/'+ID_RVA_SERVICE).then(function(data){
            $scope.articles = jsonNumericCheck.d(data.data);

            var family = '';
            for (key = 0; key < $scope.articles.length; key++) {
                if($scope.articles[key].family != family){
                    family = $scope.articles[key].family;
                    $scope.articles.splice( key, 0,
                        {
                            type            : "hr",
                            //code_barre      : "",
                            //description_f   : "",
                            family          : family,
                            //id_article      : "",
                            //id_family       : "",
                            //id_service      : "",
                            //mark            : "",
                            nom             : family,
                            //quantite        : "",
                            //status          : "Active",
                            //unite           : "",
                            vat             : null
                        }
                    )
                }
            }

        });

    };
    $scope.loadData();

    $scope.changeArticleStatus = function(article){
        article.status = (article.status=="Active" ? "Inactive" : "Active");
        Data.put("articles/"+article.id_article,{status:article.status});
    };

    $scope.open = function (p,size) {
        if(angular.isUndefined(p.id_article)){
            p.id_family = 1;
        }
        var modalInstance = $modal.open({
          templateUrl: 'partials/RVA/articleEdit.html',
          controller: 'articleEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                selectedObject.family = $('#SelectFamily option:selected').text();
                $scope.articles.push(selectedObject);
                //$scope.articles = $filter('orderBy')($scope.articles, 'id_article', 'reverse');

            }else if(selectedObject.save == "update"){
                p.description_f = selectedObject.description_f;
                p.code_barre    = selectedObject.code_barre;
                p.quantite      = selectedObject.quantite;
                p.unite         = selectedObject.unite;
                p.id_family     = selectedObject.id_family;
                p.family        = selectedObject.family;
                p.vat           = selectedObject.vat;
            }
            //$scope.loadData(); // Fix empty item in FamilyFilter
            $route.reload();
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
        {text:"REFERENCE",predicate:"REFERENCE",sortable:true},
        {text:"NOM",predicate:"nom",sortable:true},
        //{text:"QUANTITE",predicate:"quantite",reverse:true,sortable:true,dataType:"number"},
        {text:"UNITE",predicate:"unite ",sortable:true},
        {text:"TVA",predicate:"vat",sortable:true},
        {text:"FAMILLE",predicate:"FAMILLE",sortable:true},
        //{text:"STATUS",predicate:"status",sortable:true},
        {text:"ACTION",predicate:"",sortable:false}
    ];

});


app.controller('articleEditCtrl', function ($rootScope, $scope, $route, $modal, $modalInstance, item, Data, jsonNumericCheck) {
    var id_suppliers_Disabled = [];
    var id_suppliers_active = [];
    var id_suppliers = [];

    item.order_article = parseInt(item.order_article);

    if (!Array.prototype.remove) {
        Array.prototype.remove = function(vals, all) {
            var i, removedItems = [];
            if (!Array.isArray(vals)) vals = [vals];
            for (var j=0;j<vals.length; j++) {
                if (all) {
                    for(i = this.length; i--;){
                        if (this[i] === vals[j]) removedItems.push(this.splice(i, 1));
                    }
                }
                else {
                    i = this.indexOf(vals[j]);
                    if(i>-1) removedItems.push(this.splice(i, 1));
                }
            }
            return removedItems;
        };
    }

    $scope.loadData = function () {
        Data.get('familys/'+ID_RVA_SERVICE).then(function(data){
            $scope.familys = data.data;
        });

        Data.get('suppliers/'+ID_RVA_SERVICE).then(function(data){
            $scope.suppliers = data.data;
        });
    };
    $scope.loadData();

    //$scope.article = jsonNumericCheck.d(angular.copy(item));
    $scope.article = angular.copy(item);
    console.log($scope.article);
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    $scope.title = (item.id_article > 0) ? 'Editer article' : 'Ajouter article';
    $scope.buttonText = (item.id_article > 0) ? 'Mise à jour article' : 'Ajouter nouveau article';

    if(item.id_article > 0){
        id_suppliers_active = [];
        id_suppliers_Disabled = [];
        id_suppliers = [];
        Data.get('stocksSuppliers/'+item.id_article).then(function(data){
            $scope.id_suppliers = data.data;
            console.log(data.data);
            if(data.data != ""){
                $scope.id_suppliers.forEach(function(entry) {
                    id_suppliers.push(entry.id_location.toString());
                });


                $scope.article["id_suppliers"] = id_suppliers;
                console.log("id_suppliers : " + id_suppliers);
                console.log("id_suppliers_active : " + id_suppliers_active);
                console.log("id_suppliers_Disabled : " + id_suppliers_Disabled);
            }
        });
    }

    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.article);
    };
    $scope.saveArticle = function (article) {
        console.log(article);
        article.family = $('#SelectFamily option:selected').text();
        article.id_service = $rootScope.id_service; // get Current Service RVA or TRAVAUX
        article.uid = $scope.uid;
        if(article.id_article > 0){

            //var removedItems = article.id_suppliers.remove(id_suppliers, true);

            console.log("before : " + article.id_suppliers);

            id_suppliers.forEach(function(entry) {
                article.id_suppliers = jQuery.grep(article.id_suppliers, function(value) {
                    return value != entry;
                });
            });
            console.log("after : " + article.id_suppliers);
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

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){

        $('#SelectFamily, #SelectSupplier').selectpicker();
        if(angular.isUndefined(item.id_article)){
            //$("#SelectFamily").val($("#target option:eq(1)").val());
        }else
            $("#SelectFamily").selectpicker('val', item.id_family);

        if($scope.article.id_suppliers){
            $("#SelectSupplier").selectpicker('val', id_suppliers);
            $scope.article.id_suppliers.forEach(function(entry) {
                $('#SelectSupplier option[value='+entry+']').prop('disabled', true);
            });
        }

        $('#SelectFamily, #SelectSupplier').selectpicker('refresh');
    });

    $scope.openFamilyForm = function (p,size) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/familyEdit.html',
            controller: 'familyEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {
            $scope.loadData();
            p.id_family = selectedObject.id_family;

            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
                $("#SelectFamily option:first").remove();
                $("#SelectFamily").val(p);
                $('#SelectFamily').selectpicker('refresh');
            });

            console.log(p);
            $scope.article.id_family = selectedObject.id_family;;
            console.log($scope.article);

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
