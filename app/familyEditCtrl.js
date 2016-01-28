/**
 * Created by lakroubassi.n on 13/07/2015.
 */
app.controller('familyEditCtrl', function ($rootScope, $scope, $route, $modalInstance, item, Data) {
    $scope.family = {};
    //console.log(item);
    if(angular.isDefined(item)){
        Data.get('family/'+item).then(function(data){
            $scope.family = data.data[0];
            console.log($scope.family);
        });
        $scope.title = 'Editer Type';
        $scope.buttonText = 'Mise à jour Type';
    }else{
        $scope.title = 'Ajouter nouveau Type';
        $scope.buttonText = 'Ajouter nouveau Type';
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.article);
    };

    $scope.saveFamily = function (family) {
        console.log(family);
        if(angular.isDefined(item)){
            Data.put('family/'+family.id_family, family).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(family);
                    x.save = 'update';
                    x.id_family = family.id_family;
                    $modalInstance.close(x);
                    //$route.reload();
                }else{
                    console.log(result);
                }
            });
        }else{
            family.id_service = $rootScope.id_service;
            console.log(family);
            Data.post('family', family).then(function (result) {
                if(result.status != 'error'){
                    var x = angular.copy(family);
                    x.save = 'insert';
                    x.id_family = family.id_family;
                    $modalInstance.close(x);
                    //$route.reload();
                }else{
                    console.log(result);
                }
            });
        }
    };

});