<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 22/07/2015
 * Time: 08:14
 */

// === Locations ================================================================================= //

$app->get('/locations','getLocations');
function getLocations() {
    global $db;
    $rows = $db->selectComplex("
    SELECT  id_location, description_f, DATE_FORMAT(gl.start_date,'%Y-%m-%d') as start_date,
            DATE_FORMAT(gl.end_date,'%Y-%m-%d') as end_date, further_information, type_location,
            gl.id_agent, CONCAT(nom, ' ', prenom) as name
            -- ,actif
    FROM gestion_location gl
    LEFT JOIN cpas_agents on cpas_agents.id_agent = gl.id_agent
--    left join cpas_contrats on cpas_agents.id_agent = cpas_contrats.id_agent
    order by gl.type_location asc, gl.description_f asc
    ");
    echoResponse(200, $rows);
};

$app->put('/location/:id', 'putLocation');
function putLocation($id){
    global $app;
    $data = json_decode($app->request()->getBody());

    $data->dt_update = date("Y-m-d H:i:s");
    $condition = array('id_location'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("gestion_location", $data, $condition, $mandatory);
    if($rows["status"]=="success"){
        $rows['data'] = $data;
        $rows["message"] = "location information updated successfully.";
        $rows["dt_update"] = date("d-m-Y H:i:s");
    }
    echoResponse(200, $rows);
};

$app->post('/location', 'postLocation');
function postLocation()
{
    global $app;
    $data = json_decode($app->request()->getBody());

    $mandatory = array();
    $data->dt_creation = date("Y-m-d H:i:s");

    global $db;
    $rows = $db->insert("gestion_location", $data, $mandatory);
    if($rows["status"]=="success") {
        $rows["message"] = "Location added successfully.";
        $rows['lastInsertId'] = $rows['data'];
        $rows["dt_creation"] = date("d-m-Y H:i");
    }
    echoResponse(200, $rows);
};

$app->get('/agents','getAgents');
function getAgents() {
    global $db_test;
    $rows = $db_test->selectComplex("select cpas_agents.id_agent, nom , prenom
                                        from cpas_contrats
                                        left join cpas_agents on cpas_agents.id_agent = cpas_contrats.id_agent
                                        where id_cel = 58 and actif = 1");
    echoResponse(200, $rows);
};