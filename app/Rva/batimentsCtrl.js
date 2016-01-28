app.controller('batimentsCtrl', function ($scope, $modal, $filter, Data) {
    $scope.batiment = {};
    Data.get('batiments').then(function(data){
        $scope.batiments = data.data;
    });

    //$scope.changeBatimentStatus = function(batiment){
    //    batiment.status = (batiment.status=="Active" ? "Inactive" : "Active");
    //    Data.put("batiments/"+batiment.id_batiment,{status:batiment.status});
    //};
    //$scope.deleteProduct = function(product){
    //    if(confirm("Are you sure to remove the product")){
    //        Data.delete("products/"+product.id).then(function(result){
    //            $scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.id}));
    //        });
    //    }
    //};
    $scope.open = function (p,size) {
        //console.log(p);
        var modalInstance = $modal.open({
          templateUrl: 'partials/RVA/batimentEdit.html',
          controller: 'batimentEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.batiments.push(selectedObject);
                $scope.batiments = $filter('orderBy')($scope.batiments, 'id_batiment', 'reverse');
            }else if(selectedObject.save == "update"){
                p.description_f = selectedObject.description_f;
                p.nom = selectedObject.nom;
                p.dt_update = selectedObject.dt_update;
                p.dt_creation = selectedObject.dt_creation;
            }
        });
    };
    
 $scope.columns = [
     {text:"ID",predicate:"id_batiment",sortable:true,dataType:"number"},
     {text:"CODE",predicate:"nom",sortable:true},
     {text:"DESCRIPTION",predicate:"description_f",sortable:true},
     //{text:"DATE UPDATE",predicate:"dt_update",sortable:true,dataType:"date"},
     //{text:"DATE CREATION",predicate:"dt_creation",sortable:true,dataType:"date"},
     {text:"ACTION",predicate:"",sortable:false}
 ];

});


app.controller('batimentEditCtrl', function ($scope, $modalInstance, item, Data) {

    $scope.batiment = angular.copy(item);

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    $scope.title = (item.id_batiment > 0) ? 'Editer batiment' : 'Ajouter batiment';
    $scope.buttonText = (item.id_batiment > 0) ? 'Mise à jour batiment' : 'Ajouter nouveau batiment';

    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.batiment);
    }
    $scope.saveBatiment = function (batiment) {
        batiment.uid = $scope.uid;
        if(batiment.id_batiment > 0){
            //console.log(batiment);
            //delete batiment.dt_creation;
            Data.put('batiments/'+batiment.id_batiment, batiment).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(batiment);
                    x.save = 'update';
                    if(result.status == "success")
                        x.dt_update = result.dt_update;
                    $modalInstance.close(x);
                }else{
                    console.log(result);
                }
            });
        }else{
            Data.post('batiments', batiment).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(batiment);
                    x.save = 'insert';
                    x.id_batiment = result.data;
                    if(result.status == "success")
                        x.dt_creation = result.dt_creation;
                    $modalInstance.close(x);
                }else{
                    console.log(result);
                }
            });
        }
    };
});
