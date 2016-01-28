<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 23/06/2015
 * Time: 16:13
 */

// === Articles ================================================================================= //

$app->get('/articles/:id_service','articles');
function articles($id_service) {
    global $db;

    $rows = $db->selectComplex("
    SELECT
    ga.id_article,
    ga.id_service,
    ga.nom,
    ga.code_barre,
    ga.description_f,
    ga.id_family,
    gf.description as family,
    ga.quantite,
    ga.unite,
    ga.status,
    ga.vat,
    ga.mark,
    ga.order_article
    FROM gestion_article ga
    LEFT JOIN gestion_family gf ON gf.id_family = ga.id_family
    WHERE ga.id_service = $id_service
    ORDER BY gf.code asc, ga.order_article"
    );
    echoResponse(200, $rows);
};

$app->get('/article/:id', 'getArticle');
function getArticle($id){
    global $db;
    $condition = array('id_article'=>$id);
    $rows = $db->select('gestion_article', 'id_article, nom', $condition);
    echoResponse(200, $rows);
};

// ========== list item that does not yet have stock in a room. =============================================== //
$app->get('/articlesToAddStock/:id_location/:id_service','getArticlesToAddStock');
function getArticlesToAddStock($id_location, $id_service){
    global $db;
    $rows = $db->selectComplex("
    select  ga.id_article,
            ga.id_service,
            ga.nom
    from gestion_article ga
    left join (select *
                from gestion_stock
                where type_stock = 'ROOM'
                  and id_location = ".$id_location.") gs
        on gs.id_article = ga.id_article
        where gs.id_stock is null
        and ga.id_service = ".$id_service
    );
    echoResponse(200, $rows);
};



$app->post('/articles', 'postArticles');
function postArticles(){
    global $app;
    $data = json_decode($app->request()->getBody());

    $id_suppliers = $data->id_suppliers;
    unset($data->id_suppliers);
    unset($data->save);
    unset($data->family);
    $stockMagasin = (!empty($data->stockMagasin) ? $data->stockMagasin : false) ; // fixe Error Undefined property: stdClass::$stockMagasin
    unset($data->stockMagasin);

    $mandatory = array();
    $data->dt_creation = date("Y-m-d H:i:s");
    global $db;
    $rows = $db->insert("gestion_article", $data, $mandatory);

    if($rows["status"]=="success"){
        $rows["message"] = "Article added successfully.";
        $lastInsertId = $rows['data'];
        $rows["dt_creation"] = date("d-m-Y H:i");

        foreach($id_suppliers as $value) {
            $mandatory = array();
            $data2 = new stdClass();
            $data2->id_article      = $lastInsertId;
            $data2->id_location     = $value;
            $data2->type_stock      = "SUPPLIER";
            $data2->prix_current    = 0.0;
            $data2->dt_creation     = date("Y-m-d H:i");
            $data2->status          = 'Active';
            $data2->stock_min       = 0;
            $data2->stock_alert     = 0;
            $data2->quantite_current = 0;
            $data2->id_service      = $data->id_service;

            $rows2 = $db->insert("gestion_stock", $data2, $mandatory);
            if($rows2["status"]=="success")
                $rows2["message"] = "Stock Supplier added successfully.";
            array_push($rows, $rows2);
        }

        if($stockMagasin){
            $data3 = new stdClass();
            $data3->id_article          = $lastInsertId;
            $data3->id_location         = ID_MAGASIN_TRAVAUX; // id_location "Bâtiment  F"
            $data3->type_stock          = "TOOL";
            $data3->dt_creation         = date("Y-m-d H:i");
            $data3->status              = 'Active';
            $data3->stock_min           = 1;
            $data3->stock_alert         = 1;
            $data3->quantite_current    = 1;
            $data3->id_service          = $data->id_service;

            $rows3 = $db->insert("gestion_stock", $data3, $mandatory);
            if($rows3["status"]=="success")
                $rows3["message"] = "Stock TOOL added successfully.";
            array_push($rows, $rows3);
        }
    }
    echoResponse(200, $rows);
};

$app->put('/articles/:id', 'putArticles');
function putArticles($id){
    global $app;
    $data = json_decode($app->request()->getBody());

    $id_suppliers = $data->id_suppliers;
    unset($data->id_suppliers);

    $stockMagasin = (!empty($data->stockMagasin) ? $data->stockMagasin : false) ; // fixe Error Undefined property: stdClass::$stockMagasin
    unset($data->stockMagasin);

    $dt_update = 'dt_update';
    $data->$dt_update = date("Y-m-d H:i:s");
    unset($data->save);
    unset($data->family);
    $condition = array('id_article'=>$id);
    $mandatory = array();

    $data1 = new stdClass();

    $data1->nom             = $data->nom;
    $data1->description_f   = $data->description_f;
    $data1->code_barre      = $data->code_barre;
    $data1->id_family       = $data->id_family;
    $data1->mark            = $data->mark;
    $data1->unite           = $data->unite;
    $data1->vat             = $data->vat;
    $data1->order_article   = (!empty($data->order_article) ? $data->order_article : '');

    global $db;
    $rows = $db->update("gestion_article", $data1, $condition, $mandatory);
    $subRows = array();
    if($rows["status"]=="success" || $rows["message"]=="No row updated"){
        $rows["message"] = "Article information updated successfully.";
        $rows["dt_update"] = date("d-m-Y H:i");

        foreach($id_suppliers as $value) {
            $mandatory = array();
            $data2 = new stdClass();
            $data2->id_article      = $id; // id_article
            $data2->id_location     = $value;
            $data2->type_stock      = "SUPPLIER";
            $data2->dt_creation     = date("Y-m-d H:i");
            $data2->status          = 'Active';
            $data2->prix_current    = 0.0;
            $data2->stock_min       = 0;
            $data2->stock_alert     = 0;
            $data2->quantite_current = 0;
            $data2->id_service      = $data->id_service;

            $rows2 = $db->insert("gestion_stock", $data2, $mandatory);
            if($rows2["status"]=="success")
                $rows2["message"] = "Stock supplier added successfully.";

            array_push($subRows, $rows2);
        }
        // comment code to create stock if not Exist
//        if($stockMagasin){
//            $data3 = new stdClass();
//            $data3->id_article      = $id;
//            $data3->id_location     = ID_MAGASIN_TRAVAUX; // id_location "Bâtiment E MAGASIN"
//            $data3->type_stock      = "TOOL";
//            $data3->dt_creation     = date("Y-m-d H:i");
//            $data3->status          = 'Active';
//            $data3->stock_min       = 1;
//            $data3->stock_alert     = 1;
//            $data3->quantite_current = 1;
//            $data3->id_service      = $data->id_service;
//
//            $rows3 = $db->insert("gestion_stock", $data3, $mandatory);
//            if($rows3["status"]=="success")
//                $rows3["message"] = "Stock TOOL added successfully.";
//            array_push($subRows, $rows3);
//        }
    }

    $rows['SubRows'] =  $subRows;
    echoResponse(200, $rows);
};