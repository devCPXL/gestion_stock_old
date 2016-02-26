<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 23/06/2015
 * Time: 16:19
 */

// === Family Articles ================================================================================= //

$app->get('/familys/:id_service', 'getFamilys');
function getFamilys($id_service) {
    global $db;
    $condition = array('id_service'=>$id_service);
    $rows = $db->select("gestion_family","id_family, code, description",$condition);
    echoResponse(200, $rows);
};

$app->get('/family/:id', 'getFamily');
function getFamily($id){
    global $db;
    $condition = array('id_family'=>$id);
    $rows = $db->select("gestion_family","id_family, code, description", $condition);
    echoResponse(200, $rows);
};

$app->put('/family/:id', 'putFamily');
function putFamily($id){
    global $app;
    $data = json_decode($app->request()->getBody());
    unset($data->save);
    unset($data->dt_creation);
    $dt_update = 'dt_update';
    $data->$dt_update = date("Y-m-d H:i:s");
    $condition = array('id_family'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("gestion_family", $data, $condition, $mandatory);
    if($rows["status"]=="success"){
        $rows['data'] = $data;
        $rows["message"] = "Family information updated successfully.";
        $rows["dt_update"] = date("d-m-Y H:i:s");
    }
    echoResponse(200, $rows);
};

$app->post('/family', 'postFamily');
function postFamily(){
    global $app;
    $data = json_decode($app->request()->getBody());
    $dt_creation = 'dt_creation';
    $data->$dt_creation = date("Y-m-d H:i:s");
    $mandatory = array();
    global $db;
    $rows = $db->insert("gestion_family", $data, $mandatory);
    if($rows["status"]=="success"){
        $rows["message"] = "Family added successfully.";
        $rows["dt_creation"] = date("d-m-Y H:i:s");
    }
    echoResponse(200, $rows);
};

$app->get('/familysTOOL/:id_service', 'getFamilysTools');
function getFamilysTools($id_service) {
    global $db;
    $rows = $db->selectComplex("Select id_family, code, description
                                From gestion_family
                                Where id_service = $id_service
                                and id_family IN(3)");
    echoResponse(200, $rows);
};


$app->get('/familysMATERIAL/:id_service', 'getFamilysMaterials');
function getFamilysMaterials($id_service) {
    global $db;
    $rows = $db->selectComplex("Select id_family, code, description
                                From gestion_family
                                Where id_service = $id_service
                                and id_family NOT IN(3)");
    echoResponse(200, $rows);
};

//familysTools