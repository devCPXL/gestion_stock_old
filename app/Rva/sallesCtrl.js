
app.controller('sallesCtrl', function ($scope, $route, $modal, $filter, Data) {
    $scope.salle = {};
    Data.get('salles').then(function(data){
        $scope.salles = data.data;
    });

    $scope.open = function (p,size) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/RVA/salleEdit.html',
            controller: 'salleEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){

                selectedObject.description_batiment = $('#SelectBatiment option:selected').text();
                $scope.salles.push(selectedObject);
                //$scope.salles = $filter('orderBy')($scope.salles, 'id_salle', 'reverse');
            }
            else if(selectedObject.save == "update"){
                p.service = selectedObject.service;
                p.description_f = selectedObject.description_f;
                p.description_batiment = $('#SelectBatiment option:selected').text();
                p.numero = selectedObject.numero;
                p.etage = selectedObject.etage;
                p.date_order_delivery = selectedObject.date_order_delivery;
                p.id_batiment = selectedObject.id_batiment;
                p.dt_update = selectedObject.dt_update;
            }
        });
    };
    
    $scope.columns = [
        {text:"ID",         predicate:"id_salle",       sortable:true,dataType:"number"},
        {text:"SERVICE",    predicate:"SERVICE",        sortable:true},
        {text:"DESCRIPTION",predicate:"description_f",  sortable:true},
        {text:"BATIMENT",   predicate:"Batiment",       sortable:true},
        {text:"N°/ETAGE",   predicate:"NUM/ETAGE",      sortable:true,dataType:"number"},
        {text:"ACTION",     predicate:"Action",         sortable:false}
    ];

});


app.controller('salleEditCtrl', function ($scope, $modalInstance, item, Data) {

    //$scope.salle = {};
    $scope.salle = (angular.isDefined(item.id_salle))? angular.copy(item) : {service : 'Service Cuisine'};
    $scope.services = ['Service Cuisine', 'Service Générale', 'Service Hôtellerie', 'Service Incontinence', 'Service Lingerie', 'Service Logistique'];
    $scope.title = (item.id_salle > 0) ? 'Editer salle' : 'Ajouter salle';
    $scope.buttonText = (item.id_salle > 0) ? 'Mise à jour salle' : 'Ajouter nouveau salle';

    Data.get('batiments').then(function(data){
        $scope.batiments = data.data;
        if(angular.isUndefined(item.id_salle))
            $scope.salle.id_batiment = $scope.batiments[0].id_batiment;

    });
    Data.get('salles').then(function(data){
        $scope.salles2 = data.data;
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };


    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.salle);
    }
    $scope.saveSalle = function (salle) {
        salle.uid = $scope.uid;
        //console.log(salle);
        if(salle.id_salle > 0){
            delete salle.nom;
            Data.put('salles/'+salle.id_salle, salle).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(salle);
                    x.save = 'update';
                    if(result.status == "success")
                        x.dt_update = result.dt_update;
                    $modalInstance.close(x);
                    //alert("la Salle est mit à jour avec succès... ");
                }else{
                    console.log(result);
                }
            });
        }else{
            Data.post('salles', salle).then(function (result) {
                if(result.status != 'error'){
                    //alert("la Salle est créé avec succès... ");
                    console.log(result);
                    console.log(result.status);
                    var x = angular.copy(salle);
                    x.save = 'insert';
                    x.id_salle = result.data;
                    x.dt_creation = result.dt_creation;
                    $modalInstance.close(x);
                    console.log(x);
                }else{
                    console.log(result);
                }
            });
        }
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $("#SelectBatiment, #SelectService").selectpicker();

        if(angular.isUndefined(item.id_salle)){

        }
            //$("#SelectBatiment").selectpicker('val', 8);
        else
            $("#SelectBatiment").selectpicker('val', $scope.salle.id_batiment);

        $("#SelectBatiment, #SelectService").selectpicker('refresh');
    });

});
