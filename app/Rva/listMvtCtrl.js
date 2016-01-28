/**
 * Created by lakroubassi.n on 30/04/2015.
 */

app.controller('listMvtCtrl', function ($scope, $route, $rootScope, $routeParams, $log, Data,$window, myService, jsonNumericCheck) {
    var type = $routeParams.type;
    var id = $routeParams.id;

    var datesInventory = [];
    var inventories = [];
    var inventory = [];
    var v = false;
    $scope.ind = 0;
    $scope.total = 0;

    Data.get('movements/'+id).then(function (data){
        //$scope.movements= data.data;
        $scope.movements = jsonNumericCheck.d(data.data);

        for (var key in $scope.movements) {
            if($scope.movements.hasOwnProperty(key)){

                var obj = $scope.movements[key];
                switch(obj.type_mvt) {
                    case 'INIT_INVENTORY':
                        obj.type_mvt_fr = 'Init Inventaire';
                        break;
                    case 'INVENTORY':
                        obj.type_mvt_fr = 'Inventaire';
                        break;
                    case 'INVENTORY_CONSUMPTION':
                        obj.type_mvt_fr = 'Inventaire Cons';
                        break;
                    case 'DELIVERY':
                        obj.type_mvt_fr = 'Reception';
                        break;
                    case 'INTERNAL':
                        obj.type_mvt_fr = id == obj.from_id_stock ? 'Sortie' : 'Entrée' ;
                        break;
                    default:
                        obj.type_mvt_fr = '';
                }
                if(obj.type_mvt == 'INVENTORY' || obj.type_mvt == 'INIT_INVENTORY' ){
                    if(v)inventories.push(inventory);
                    inventory = [];
                    //datesInventory.push(obj); // enabled
                    v = true;
                }
                inventory.push(obj);
            }
        }
        inventories.push(inventory);


        if(inventories.length > 1){
            var objAll = {};
            objAll.date_mvt = "Tous les mouvements";
            datesInventory.push(objAll);
            inventories.push($scope.movements);
        }

        $scope.datesInventory = datesInventory;
        console.log(datesInventory);
        console.log(inventories);
        console.log(inventory);
        //$scope.movements = inventories[0]; // enabled
        $scope.selectedIndex = 0;
    });

    $scope.changeInventoryList = function($index){
        //alert(i);
        //$scope.selectedIndex = $index;
        //$scope.movements = inventories[$index];
    };
    $scope.getTotals = function(){
        var total = 0;
        var totals = [];
        var totalIn = 0;
        var totalOut = 0;
        for(var i = 0; i < $scope.movements.length; i++){
            var mvt = $scope.movements[i];
            if (mvt.type_mvt == 'INVENTORY' || mvt.type_mvt == 'INIT_INVENTORY'){
                total += mvt.quantite;
                totalIn += mvt.quantite;
            }
            if ($scope.desiredLocation.id_stock == mvt.to_id_stock && $scope.desiredLocation.id_stock != mvt.from_id_stock){
                total += mvt.quantite;
                totalIn += mvt.quantite;
            }
            if ($scope.desiredLocation.id_stock == mvt.from_id_stock && $scope.desiredLocation.id_stock != mvt.to_id_stock){
                total -= mvt.quantite;
                totalOut += mvt.quantite;
            }
        }
        totals['total'] = total;
        totals['totalIn'] = totalIn;
        totals['totalOut'] = totalOut;
        console.log(totals);
        return totals;
    };

    //$scope.desiredLocation = myService.get();
    $scope.desiredLocation = $window.opener.stock;
    //console.log($scope.desiredLocation);




    $rootScope.title = 'Liste Inventaire : '+ $scope.desiredLocation.nom_article;

    $scope.columns = [
        {text:"ID",predicate:"id_mvt",sortable:true,dataType:"number"},
        {text:"DATE MVT",predicate:"date_mvt",sortable:true},
        {text:"DU",predicate:"from_id_stock",dataType:"number"},
        {text:"AU",predicate:"to_id_stock",sortable:true},
        {text:"QUANTITE",predicate:"quantite",sortable:true},
        {text:"TYPE MVT",predicate:"type_mvt",sortable:true},
        {text:"DATE CREATION",predicate:"dt_creation",sortable:true},
        {text:"COMMENT",predicate:"further_information"}


    ];

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        $(document).ready(function() {
            //$('#example').dataTable( {
            //    "scrollY":        "200px",
            //    "scrollCollapse": true,
            //    "paging":         false
            //} );

            var i= 1;
            $('.tableFloatingHeader th').each(function() {
                tdWidth = $(this).outerWidth();
                console.log(i + ' : ' + tdWidth);
                $(".tableFloatingHeaderOriginal th:nth-of-type("+i+")").css({'min-width': tdWidth+'px' , 'max-width': tdWidth+'px' });
                i++;
            });

        } );


    });
});
