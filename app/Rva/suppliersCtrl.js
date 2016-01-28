app.controller('suppliersCtrl', function ($rootScope, $scope, $modal, $filter, Data) {
    $scope.supplier = {};
    Data.get('suppliers/'+$rootScope.id_service).then(function(data){
        $scope.suppliers = data.data;
    });

    $scope.jsonStringify = function(s){
        //console.log(JSON.stringify(s));
        return JSON.stringify(s);
    };

    $scope.open = function (p,size) {
        //console.log(p);
        var modalInstance = $modal.open({
          templateUrl: 'partials/RVA/supplierEdit.html',
          controller: 'supplierEditCtrl',
          size: size,
          resolve: {
            item: function () {
              return p;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.suppliers.push(selectedObject);
                $scope.suppliers = $filter('orderBy')($scope.suppliers, 'id_supplier', 'reverse');
            }else if(selectedObject.save == "update"){
                p.Mobile                = selectedObject.Mobile;
                p.bank_account          = selectedObject.bank_account;
                p.city                  = selectedObject.city;
                p.contact_Fax           = selectedObject.contact_Fax;
                p.contact_function      = selectedObject.contact_function;
                p.contact_mail          = selectedObject.contact_mail;
                p.contact_name          = selectedObject.contact_name;
                p.contact_tel           = selectedObject.contact_tel;
                p.country               = selectedObject.country;
                p.fax                   = selectedObject.fax;
                p.further_information   = selectedObject.further_information;
                p.language              = selectedObject.language;
                p.mail                  = selectedObject.mail;
                p.name                  = selectedObject.name;
                p.payment_method        = selectedObject.payment_method;
                p.responsible           = selectedObject.responsible;
                p.street                = selectedObject.street;
                p.tel                   = selectedObject.tel;
                p.zip_code              = selectedObject.zip_code;
                p.client_number         = selectedObject.client_number;
            }
        });
    };
    
    $scope.columns = [
        {text:"ID",predicate:"id_supplier"},
        {text:"NOM",predicate:"name"},
        {text:"ADRESSE",predicate:"street"},
        {text:"MAIL",predicate:"mail"},
        {text:"CONTACT",predicate:"contact_name"},
        {text:"TEL",predicate:"tel"},
        {text:"ACTION",predicate:"ACTION"}
    ];

});


app.controller('supplierEditCtrl', function ($rootScope, $scope, $modalInstance, item, Data) {

    $scope.supplier = angular.copy(item);

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    $scope.title = (item.id_supplier > 0) ? 'Editer Fournisseur' : 'Ajouter Fournisseur';
    $scope.buttonText = (item.id_supplier > 0) ? 'Mise à jour fournisseur' : 'Ajouter nouveau fournisseur';

    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.supplier);
    }
    $scope.saveSupplier = function (supplier) {
        //supplier.uid = $scope.uid;
        if(supplier.id_supplier > 0){
            //console.log(supplier);
            //delete supplier.dt_creation;
            Data.put('suppliers/'+supplier.id_supplier, supplier).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(supplier);
                    x.save = 'update';
                    if(result.status == "success")
                        x.dt_update = result.dt_update;
                    $modalInstance.close(x);
                }else{
                    console.log(result);
                }
            });
        }else{
            supplier.id_service = $rootScope.id_service;
            console.log(supplier);
            Data.post('suppliers', supplier).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(supplier);
                    x.save = 'insert';
                    x.id_supplier = result.data;
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
