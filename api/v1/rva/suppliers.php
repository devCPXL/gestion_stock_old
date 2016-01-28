<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 23/06/2015
 * Time: 16:18
 */

// === Suppliers ================================================================================= //

$app->get('/suppliers/:id_service', 'getSuppliers');
function getSuppliers($id_service) {
    global $db;
    $condition = array('id_service'=>$id_service);
    $rows = $db->select("gestion_Suppliers","*",$condition);
    echoResponse(200, $rows);
};

$app->post('/suppliers', 'postSupplier');
function postSupplier(){
    global $app;
    $data = json_decode($app->request()->getBody());
    $dt_creation = 'dt_creation';
    $data->$dt_creation = date("Y-m-d H:i");
    $mandatory = array();
    global $db;
    $rows = $db->insert("gestion_Suppliers", $data, $mandatory);
    if($rows["status"]=="success"){
        $rows["message"] = "Supplier added successfully.";
        $rows["dt_creation"] = date("d-m-Y H:i");
    }
    echoResponse(200, $rows);
};

$app->put('/suppliers/:id', 'putSuppliers');
function putSuppliers($id){
    global $app;
    $request = $app->request();
    $data = json_decode($request->getBody());
    unset($data->save);
    unset($data->dt_creation);
    $dt_update = 'dt_update';
    $data->$dt_update = date("Y-m-d H:i");
    $condition = array('id_supplier'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("gestion_Suppliers", $data, $condition, $mandatory);
    if($rows["status"]=="success"){
        $rows["message"] = "Supplier information updated successfully.";
        $rows["dt_update"] = date("d-m-Y H:i");
    }
    echoResponse(200, $rows);
};