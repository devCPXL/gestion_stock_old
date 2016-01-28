<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 23/06/2015
 * Time: 16:17
 */

// === Salles ================================================================================= //

$app->get('/salles2', 'getSalles2');
function getSalles2() {
    global $db;
    $rows = $db->select("gestion_salle","id_salle, description_f, numero, etage",array());
    echoResponse(200, $rows);
};

$app->get('/salles', 'getSalles');
function getSalles() {
    global $db;
    $rows = $db->selectComplex("select
            gs.id_salle,
            gs.service,
            gs.id_batiment,
            gs.description_f,
            gb.description_f as description_batiment,
            gb.nom,
            gs.numero,
            gs.etage,
            gs.date_order_delivery,
            DATE_FORMAT(gs.dt_update,'%d-%m-%Y %H:%i') as dt_update,
            DATE_FORMAT(gs.dt_creation,'%d-%m-%Y') as dt_creation
            FROM gestion_salle gs
            LEFT JOIN gestion_batiment gb ON gb.id_batiment = gs.id_batiment
            ORDER BY gs.service, gs.description_f

		                                ");
    echoResponse(200, $rows);
};

$app->get('/sallesFinalizeOrder', 'getSallesFinalizeOrder');
function getSallesFinalizeOrder() {
    global $db;
    $rows = $db->selectComplex("SELECT
            gs.id_salle,
            gs.id_salle,
            gs.id_batiment,
            gs.description_f,
            gs.service,
            gs.date_order_delivery,
            gb.description_f as description_batiment,
            gb.nom,
            gs.numero,
            gs.etage,
            DATE_FORMAT(gs.dt_update,'%d-%m-%Y %H:%i') as dt_update,
            DATE_FORMAT(gs.dt_creation,'%d-%m-%Y') as dt_creation
            FROM gestion_salle gs
            LEFT JOIN gestion_batiment gb on gb.id_batiment = gs.id_batiment
            WHERE gs.id_salle NOT IN (4) ");
    echoResponse(200, $rows);
};

$app->get('/sallesProvisioning/:id', 'getSallesProvisioning');
function getSallesProvisioning($id) {
    global $db;
    $condition = array('id_salle'=>$id);
    $mandatory = array();
    $rows = $db->select("gestion_salle_provisioning","id_salle_provisioning",$condition, $mandatory);
    echoResponse(200, $rows);
};

$app->post('/salles', 'postSalles');
function postSalles(){
    global $app;
    $data = json_decode($app->request()->getBody());

//    $sallesProvisioning = $data->sallesProvisioning;
//    unset($data->sallesProvisioning);

    $dt_creation = 'dt_creation';
    $data->$dt_creation = date("Y-m-d H:i");

    $mandatory = array();
    global $db;
    $rows = $db->insert("gestion_salle", $data, $mandatory);
    if($rows["status"]=="success"){
        $rows["message"] = "Salle added successfully.";
        $lastInsertId = $rows['data'];
        $rows["dt_creation"] = date("d-m-Y H:i");

//        foreach($sallesProvisioning as $value) {
//            $mandatory = array();
//
//            $key = 'id_salle';
//            $key1 = 'id_salle_provisioning';
//            $data2 = new stdClass();
//
//            $data2->$key = $lastInsertId;
//            $data2->$key1 = $value;
//            $rows2 = $db->insert("gestion_salle_provisioning", $data2, $mandatory);
//            if($rows2["status"]=="success")
//                $rows2["message"] = "Salle provisioning added successfully.";
//        }
    }
    echoResponse(200, $rows);

};

$app->put('/salles/:id', 'putSalles');
function putSalles($id){
    global $app;
    $data = json_decode($app->request()->getBody());

//    $sallesProvisioning = $data->sallesProvisioning;
//    unset($data->sallesProvisioning);
    unset($data->description_batiment);
    unset($data->dt_creation);
    unset($data->save);

    $dt_update = 'dt_update';
    $data->$dt_update = date("Y-m-d H:i");

    $condition = array('id_salle'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("gestion_salle", $data, $condition, $mandatory);

    if($rows["status"]=="success" || $rows["message"]=="No row updated"){
        $rows["message"] = "Salle information updated successfully.";
        $rows["dt_update"] = date("d-m-Y H:i");
//        $rows_delete = $db->delete("gestion_salle_provisioning", array('id_salle'=>$id));

//        if($rows_delete["status"]=="success" || $rows_delete["message"]=="No row deleted"){
//
//            foreach($sallesProvisioning as $value) {
//                $mandatory = array();
//
//                $key = 'id_salle';
//                $key1 = 'id_salle_provisioning';
//                $data2 = new stdClass();
//
//                $data2->$key = $id;
//                $data2->$key1 = $value;
//                $rows2 = $db->insert("gestion_salle_provisioning", $data2, $mandatory);
//                if($rows2["status"]=="success")
//                    $rows2["message"] = "Salle provisioning added successfully.";
//            }
//        }
    }
    echoResponse(200, $rows);
};