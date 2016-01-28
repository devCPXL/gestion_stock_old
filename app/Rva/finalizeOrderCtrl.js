    /**
 * Created by lakroubassi.n on 15/06/2015.
 */

app.controller('finalizeOrderCtrl', function ($scope, $route, $filter, Data, jsonNumericCheck, toaster) {
    var id_salle;
    var DateNow = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.date_mvt = DateNow;
    Data.get('sallesFinalizeOrder').then(function(data){
        $scope.salles = data.data;
        $scope.filterSalle = {id_salle: $scope.salles[0].id_salle};
        id_salle = $scope.salles[0].id_salle;
    });

    Data.put('finalizeOrder/' + 1, null).then(function(data){
        //console.log(data);
        $scope.rows =  jsonNumericCheck.d(data.data);
        $scope.status = 'notUpdate';
    });

    $scope.changeSalleStock = function(id_salle){
        //$scope.caption = $('#filterSalle option[value='+id_salle+']').text();
        Data.put('finalizeOrder/' + id_salle, null).then(function(data){
            $scope.rows =  jsonNumericCheck.d(data.data);
            //console.log(data);
        })
        $scope.status = 'notUpdate';
    };

    $scope.changeStockInput = function(r){
        if(r.stock_etage != 'null' && !isNaN(r.stock_etage) )
            r.stockOrder = (r.stock_min - r.stock_etage) < 0 ? 0 : (r.stock_min - r.stock_etage);
        else r.stockOrder = 0;
    };

    $scope.save = function(){
        //console.log($scope.rows);
        $scope.rows = jsonNumericCheck.d($scope.rows);
        var DataToSend = {date_mvt: $scope.date_mvt, rows : $scope.rows};
        console.log(DataToSend);
        Data.put('OrderWeeklyStock', DataToSend).then(function(data){
            console.log(data);
        })
        $scope.status = 'updated';
        setTimeout(function() {
            Data.put('finalizeOrder/' + $scope.filterSalle.id_salle, null).then(function(data){
                //console.log(data);
                $scope.rows =  jsonNumericCheck.d(data.data);
                $scope.status = 'notUpdate';
            });
        }, 1500);
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        $('#filterSalle').selectpicker();
        $('#filterSalle').selectpicker('refresh');
    });

    $scope.columns = [
        {text:"ID",predicate:"id_stocks",sortable:true,dataType:"number"},
        {text:"ARTICLE",predicate:"ARTICLE",reverse:true,sortable:true,dataType:"number"},
        {text:"UNITE",predicate:"UNITE",sortable:true},
        {text:"REF",predicate:"REF",sortable:true},
        {text:"STOCK THEORY",predicate:"STOCK",sortable:true},
        //{text:"BESOIN",predicate:"BESOIN",sortable:true},
        {text:"STOCK",predicate:"STOCK",sortable:true},
        //{text:"COMMANDE",predicate:"COMMANDE",sortable:true},
        {text:"RECUE",predicate:"RECUE",sortable:true},
        {text:"ECONOMAT",predicate:"ECONOMAT",sortable:true}
    ];

});