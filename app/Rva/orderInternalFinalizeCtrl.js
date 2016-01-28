
app.controller('orderInternalFinalizeCtrl', function($scope, FileUploader, $route, $modal, $modalInstance, Data) {
    var uploader = $scope.uploader = new FileUploader({
        url: '../gestion_stock/angular-file-upload-master/examples/simple/upload.php'
    });

    $scope.title = 'IMPORT COMMANDE HEBDOMADAIRE';
    $scope.buttonText = 'Importer';
    $scope.cancel = function () {
        $modalInstance.dismiss('Close');
    };
/*
    $scope.import = function(item){
*/
    $scope.importation = function(item){
        console.info('item : ', item);

        Data.put('importXlsxFile', item.file).then(function(data){
            console.log(data);
        });

    };

    // FILTERS

    uploader.filters.push({
        name: 'xlsFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            //console.log('type : ' + type);
            //console.log('return : ' + '|xls|xlsx|'.indexOf(type));
            return '|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) !== -1;
            //return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
});