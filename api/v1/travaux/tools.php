<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 12/08/2015
 * Time: 11:52
 */

$app->get('/tools/:id_service','getTools');
function getTools($id_service) {
    global $db;
    $rows = $db->selectComplex("
        SELECT ga.id_article, ga.nom, ga.code_barre, ga.description_f, ga.id_family, ga.mark, ga.vat, ga.unite, gf.code,
        gf.description, gs.id_stock, gs.id_location, gs.id_article as gs_id_article, gs.quantite_current,
        gs.stock_alert, gs.stock_min, gs.type_stock, gs.status, gl.description_f as name_location
        FROM gestion_article ga
        LEFT JOIN gestion_stock gs
            ON ga.id_article = gs.id_article AND gs.type_stock = 'TOOL'
        LEFT JOIN gestion_family gf
            ON gf.id_family = ga.id_family
        LEFT JOIN gestion_location gl
            ON gl.id_location = gs.id_location
        WHERE ga.id_service = $id_service
        AND ga.id_family IN(3)
        ORDER BY ga.unite, ga.nom
    ");
    echoResponse(200, $rows);
};

$app->get('/stocksLocation/:stockType/:id_location','getStockslocation');
function getStockslocation($stockType, $id_location) {
    global $db;
    $constant = 'constant';
    $rows = $db->selectComplex("
        SELECT gs.id_stock, gs.id_location, gs.id_article as gs_id_article, gs.quantite_current,
        gs.stock_alert, gs.stock_min, gs.type_stock, gs.status , ga.id_article, ga.nom as nom_article, ga.code_barre,
        ga.description_f, ga.id_family, ga.mark, ga.vat, ga.unite
        FROM gestion_stock gs
            LEFT JOIN gestion_article ga
                ON ga.id_article = gs.id_article
        WHERE ga.id_service = {$constant('TRAVAUX_SERVICE')}
            AND gs.id_location = $id_location
            AND gs.type_stock = '".$stockType."'
    ");
    echoResponse(200, $rows);
};

// ========= INSERT NEW MOVEMENT & UPDATE FOR TOOLS FROM STOCK TO STOCK ========= //
$app->post('/ToolMvt', 'postToolMvt');
function postToolMvt(){
    global $app, $db;
    $data = json_decode($app->request()->getBody());

    // ===== Check if Stock Exist !!!
    $oneRow = $db->selectComplex("SELECT * FROM gestion_stock
                                  WHERE id_location = ".$data->SelectLocation_to->id_location."
                                  AND id_article = ".$data->stockArticle->gs_id_article."
                                  AND type_stock = '".$data->type_stock."'
                                  ");

    $to_stockArticle = new stdClass();
    if(empty($oneRow['data'])){ //=== NO data === Create Stock TOOL

        $data1 = new stdClass();

        $data1->id_service          = TRAVAUX_SERVICE;
        $data1->id_article          = $data->stockArticle->gs_id_article;
        $data1->id_location         = $data->SelectLocation_to->id_location;
        $data1->type_stock          = $data->type_stock;
        $data1->status              = 'Active';
        $data1->stock_min           = 1;
        $data1->stock_alert         = 1;
        $data1->quantite_current    = 0;
        $data1->dt_creation         = date("Y-m-d H:i:s");

        $rows = $db->insert("gestion_stock", $data1, array());
        if($rows["status"]=="success") {
            $rows["message"] = "Stock TOOL added successfully.";
            $data1->id_stock = $rows['data'];
            $to_stockArticle = $data1;
        }
    }
    else{ // === data Exist === Copy it into 'to_stockArticle'

        //=== extract First Element of Result and Convert it to Object
        $to_stockArticle = (object) $oneRow['data'][0];
    }

    $data->to_stockArticle = $to_stockArticle;

    //=== Create Movement TOOL ===//

    $data_mvt_tool = new stdClass();

    $data_mvt_tool->type_mvt            = $data->type_mvt;
    $data_mvt_tool->date_mvt            = $data->date_mvt;
    $data_mvt_tool->from_id_stock       = $data->stockArticle->id_stock;
    $data_mvt_tool->to_id_stock         = $data->to_stockArticle->id_stock;
    $data_mvt_tool->quantite            = $data->quantite;
    $data_mvt_tool->dt_creation         = date("Y-m-d H:i:s");
    $data_mvt_tool->further_information = (!empty($data->further_information) ? $data->further_information : '') ;

    $mandatory = array();
    $subRows = array();
    $rows = $db->insert("gestion_stock_mvt_x", $data_mvt_tool, $mandatory);
    if($rows["status"]=="success"){
        $rows["message"] = "Stock Movement added successfully.";

        $dataStockUpdate = new stdClass();

        if($data_mvt_tool->type_mvt == 'INTERNAL'){

            $dataStockUpdate->dt_update         = date("Y-m-d H:i:s");
            $dataStockUpdate->quantite_current  = $data->stockArticle->quantite_current - $data_mvt_tool->quantite;
            $condition = array('id_stock'=>$data_mvt_tool->from_id_stock);
            $rows1 = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);
            array_push($subRows, $rows1);

            $dataStockUpdate->quantite_current  = $data->to_stockArticle->quantite_current + $data_mvt_tool->quantite;
            $condition = array('id_stock'=>$data_mvt_tool->to_id_stock);
            $rows2 = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);
            array_push($subRows, $rows2);
        }

        $rows['SubRows'] =  $subRows;
    }
    echoResponse(200, $rows);
};

// ** Stock Materials ** ============================================================================================
