
app.controller('locationsCtrl', function ($scope, $route, $modal, $filter, Data, jsonNumericCheck) {
    $scope.locations = {};
    Data.get('locations').then(function(data){
        $scope.locations = jsonNumericCheck.d(data.data);
    });

    $scope.open = function (p,size) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/TRAVAUX/locationEdit.html',
            controller: 'locationEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return p;
                }
            }
        });

        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){

                delete selectedObject.save;
                selectedObject.name = $('#SelectAgent option:selected').text();
                $scope.locations.push(selectedObject);
            }
            else if(selectedObject.save == "update"){

                delete selectedObject.save;
                p.description_f = selectedObject.description_f;
                p.start_date = selectedObject.start_date;
                p.end_date = selectedObject.end_date;
                p.further_information = selectedObject.further_information;
                p.id_agent = selectedObject.id_agent;
                p.name = selectedObject.name;
                p.type_location = selectedObject.type_location;

            }
        });
    };
    
    $scope.columns = [
        {text:"ID",predicate:"id_salle",sortable:true,dataType:"number"},
        {text:"CORPS DE METIER",predicate:"CORPS DE METIER",sortable:false},
        {text:"NOM CHANTIER",predicate:"NOM CHANTIER",sortable:true},
        {text:"DATE DEBUT",predicate:"DATE DEBUT",sortable:true},
        {text:"DATE FIN",predicate:"DATE FIN",sortable:true},
        {text:"AGENT",predicate:"AGENT",sortable:true},
        {text:"COMMENTAIRE",predicate:"COMMENTAIRE",sortable:false},
        {text:"MAJ",predicate:"MAJ",sortable:false}
    ];

});


app.controller('locationEditCtrl', function ($scope, $modalInstance, item, Data, jsonNumericCheck) {
    $scope.location = {};
    $scope.agents = {};
    console.log(item);

    console.log("$scope.agents : ");
    console.log($scope.agents);

    Data.get('agents').then(function(data){
        $scope.agents = data.data;//jsonNumericCheck.d(data.data);

        if(!angular.isDefined(item)){
            $scope.location = {
                id_agent : parseInt($scope.agents[0].id_agent)
            };
        }
    });

    $scope.location = angular.copy(item);

    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
    $scope.title        = (angular.isDefined(item)) ? 'Editer Chantier'        : 'Ajouter Chantier';
    $scope.buttonText   = (angular.isDefined(item)) ? 'Mise à jour Chantier'   : 'Ajouter nouveau Chantier';

    var original = item;
    $scope.isClean = function() {
        return angular.equals(original, $scope.location);
    }
    $scope.saveLocation = function (location) {

        location.uid = $scope.uid;
        delete location.name;
        console.log(location);
        if(angular.isDefined(location.id_location)){
            Data.put('location/'+location.id_location, location).then(function (result) {
                if(result.status != 'error'){
                    location.save = 'update';
                    location.name = $('#SelectAgent option:selected').text();
                    $modalInstance.close(location);
                }else{
                    console.log(result);
                }
            });
        }else{
            Data.post('location', location).then(function (result) {
                if(result.status != 'error'){
                    location.save = 'insert';
                    location.id_location = result.data;
                    $modalInstance.close(location);
                }else{
                    console.log(result);
                }
            });
        }
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {

        $("#SelectAgent").selectpicker();

        $("#SelectAgent").selectpicker('val', item.id_agent);

        //if(angular.isDefined(location.id_location)){
        //    $('#SelectAgent').selectpicker('val',location.id_agent);
        //}
        $("#SelectAgent").selectpicker('refresh');
    });

});
