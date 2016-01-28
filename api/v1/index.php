<?php
require '../libs/Slim/Slim.php';
require_once 'dbHelper.php';
//
//\Slim\Slim::registerAutoloader();
//$app = new \Slim\Slim();
//$app = \Slim\Slim::getInstance();
//$db = new dbHelper();

define("RVA_SERVICE", 15);
define("TRAVAUX_SERVICE", 19);
define("ID_ECONOMAT", 4);
define("ID_MAGASIN_TRAVAUX", 7);

//\Slim\Slim::registerAutoloader();
$app = new Slim();
//$app = \Slim\Slim::getInstance();
$db = new dbHelper(DB_NAME);
$db_test = new dbHelper(DB_NAME_TEST);


/**
 * Database Helper Function templates
 */
/*
select(table name, where clause as associative array)
insert(table name, data as associative array, mandatory column names as array)
update(table name, column names as associative array, where clause as associative array, required columns as array)
delete(table name, where clause as array)
*/

include_once 'rva/articles.php';

include_once 'rva/batiments.php';

include_once 'rva/locations.php';

include_once 'rva/suppliers.php';

include_once 'rva/familys.php';


include_once 'travaux/locations.php';

include_once 'travaux/stocks.php';

include_once 'travaux/tools.php';

// ======== Start Session ============================= //

$app->get('/session', 'getSession');
function getSession() {
    global $db;
    $session = $db->getSession();
    echoResponse(200, $session );
};

$app->put('/agent', 'putAgent');
function putAgent() {
    global $app,$db;
    $data = json_decode($app->request()->getBody());
//    $rows = $db->selectComplex("
//          SELECT
//              id_agent,
//              registre_id,
//              nom,
//              prenom,
//              initiales,
//              langue,
//              tel_1,
//              url_photo,
//              genre,
//              email,
//              password_email,
//              start_date,
//              end_date,
//              AGENT.id_dep AS id_dep,
//              AGENT.id_ser AS id_ser,
//              AGENT.id_fonc as id_fonc,
//              AGENT.status as status,
//              SERV.label_f AS service,
//              SERV.fax AS fax,
//              DEPT.label_f AS department,
//              FUNC.label_f AS fonction
//          FROM cpas_agents AS AGENT
//              JOIN cpas_departements AS DEPT
//                  ON AGENT.id_dep = DEPT.id_dep
//              JOIN cpas_services AS SERV
//                  ON AGENT.id_ser = SERV.id_ser
//              JOIN cpas_fonctions AS FUNC
//                  ON AGENT.id_fonc = FUNC.id_fonc
//          WHERE login_nt = '$data->session_username'
//		                                ");


    $rows = $db->selectComplex("
                    SELECT AGENT.id_agent,
                      AGENT.registre_id,
                      nom,
                      prenom,
                      initiales,
                      langue,
                      AGENT.tel_1 AS tel_agent,
                      url_photo,
                      genre,
                      email,
                      password_email,
                      SERV.fax AS fax,
                      CONTRAT.id_contrat AS id_contrat,
                      CONTRAT.id_hors_dep AS id_hors_dep,
                      CONTRAT.id_dep AS id_dep,
                      CONTRAT.id_ser AS id_ser,
                      CONTRAT.id_cel AS id_cel,
                      CONTRAT.id_fonc as id_fonc,
                      HORSDEPT.label_F AS hors_department,
                      DEPT.label_F AS department,
                      SERV.label_F AS service,
                      CELL.label_F AS cellule,
                      FUNC.label_F AS fonction,
                      CONTRAT.tel_1,
                      CONTRAT.tel_2,
                      CONTRAT.start_date,
                      CONTRAT.end_date,
                      CONTRAT.flag_resp_ser as resp_ser,
                      CONTRAT.flag_resp_dep as resp_dep,
                      AGENT.status as status
                      FROM cpas_agents AS AGENT
                      left join cpas_contrats as CONTRAT on CONTRAT.id_agent = AGENT.id_agent and CONTRAT.actif = 1
                      left join cpas_fonctions as FUNC on FUNC.id_fonc = CONTRAT.id_fonc and FUNC.actif = 1
                      left join cpas_hors_departements as HORSDEPT on HORSDEPT.id_hors_dep = CONTRAT.id_hors_dep and HORSDEPT.actif = 1
                      left join cpas_departements as DEPT on DEPT.id_dep = CONTRAT.id_dep and DEPT.actif = 1
                      left join cpas_services as SERV on SERV.id_ser = CONTRAT.id_ser and SERV.actif = 1
                      left join cpas_cellules as CELL on CELL.id_cel = CONTRAT.id_cel and CELL.actif = 1
                      where login_nt ='$data->session_username'

    ");


    if($rows['status'] == 'success'){
        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['agent'] = $rows['data'];
        $array = explode('<|&|>',base64_decode($data->agent_session));
        $agent_session = array();
        foreach ($array as $result) {
            $b = explode('=', $result);
            $agent_session[$b[0]] = $b[1];
        }

        $agent_session['session_group'] = explode(',', $agent_session['session_group']);
        $rows['agent_session'] = $agent_session;
        $_SESSION['agent_session'] = $agent_session;
    }
    echoResponse(200, $rows);
};

$app->get('/logout','getLogout');
function getLogout() {
    global $db;
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = $session;
    echoResponse(200, $response);
};

// ======== SELECT LIST STOCK ARTICLE IN ALL STOCK ROOM ================================ //

$app->get('/stocks', 'getStocks');
function getStocks() {
    global $db;
    $rows = $db->selectComplex("
          select g_stock.id_stock,
              g_stock.id_location,
              g_stock.id_article,
              g_stock.id_service,
              g_stock.quantite_current,
			  g_article.nom as nom_article,
			  g_article.unite,
			  g_article.code_barre as ref_article,
			  g_salle.numero,
			  g_salle.etage,
			  g_salle.description_f as salleDescription,
			  gf.description as nameFamily,
			  g_stock.availability,
			  g_stock.status,
			  g_stock.stock_alert,
			  g_stock.stock_min
            from gestion_stock g_stock
            left join gestion_article g_article
              on g_stock.id_article = g_article.id_article
            left join gestion_salle g_salle
              on g_stock.id_location = g_salle.id_salle
            left join gestion_family gf
              on g_article.id_family = gf.id_family
              where g_stock.type_stock = 'ROOM'
          order by gf.code asc, g_article.order_article, g_salle.description_f
		                                ");
    echoResponse(200, $rows);
};

// ======== SELECT LIST STOCK ARTICLE IN SPECIFIC STOCK ROOM  =============================== //
$app->get('/stocksSalles/:id_location', 'getStocksSalles');
function getStocksSalles($id_location){
    global $db;
    $rows = $db->selectComplex("
          select g_stock.id_stock,
              g_stock.id_location,
              g_stock.id_article,
              g_stock.id_service,
              g_stock.quantite_current,
			  g_article.nom as nom_article,
			  g_stock.availability,
			  g_stock.status,
			  g_stock.stock_alert,
			  g_stock.stock_min
            from gestion_stock g_stock
            left join gestion_article g_article
              on g_stock.id_article = g_article.id_article
            left join gestion_salle g_salle
              on g_stock.id_location = g_salle.id_salle
              where g_stock.type_stock = 'ROOM'
			    and g_stock.id_location =".$id_location);
    echoResponse(200, $rows);
};

// ======== SELECT LIST SUPPLIERS FOR ARTICLE =============================================== //
$app->get('/stocksSuppliers/:id_article', 'getStocksSuppliers');
function getStocksSuppliers($id_article){
    global $db;
    $rows = $db->selectComplex("
          select g_stock.id_stock,
              g_stock.id_location,
              g_stock.id_article,
              g_stock.id_service,
              g_stock.quantite_current,
			  g_stock.availability,
			  g_stock.status,
			  g_stock.stock_alert,
			  g_stock.stock_min,
			  g_supplier.name
            from gestion_stock g_stock
            left join gestion_Suppliers g_supplier
              on g_stock.id_location = g_supplier.id_supplier
            where g_stock.type_stock = 'SUPPLIER'
              and g_stock.id_article =".$id_article);
    echoResponse(200, $rows);
};

// ======== SELECT LIST STOCK_ARTICLE_TO IN ALL STOCK_ROOM EXCLUD CURRENT_STOCK_ROOM ============ //

$app->put('/stocksTo', 'putStocksTo');
function putStocksTo(){
    global $db, $app;
    $data = json_decode($app->request()->getBody());

    $id_location = $data->id_location;
    $id_article = $data->id_article;
    $rows = $db->selectComplex("
          select g_stock.id_stock,
              g_stock.id_location,
              g_stock.id_article,
              g_stock.id_service,
              g_stock.quantite_current,
			  g_article.nom as nom_article,
              g_salle.description_f as salleDescription,
			  g_stock.availability,
			  g_stock.status,
			  g_stock.stock_alert,
			  g_stock.stock_min
            from gestion_stock g_stock
            left join gestion_article g_article
              on g_stock.id_article = g_article.id_article
            left join gestion_salle g_salle
              on g_stock.id_location = g_salle.id_salle
              where g_stock.type_stock = 'ROOM'
			    and g_stock.id_location != ".$id_location."
			    and g_stock.id_article = ".$id_article);
    echoResponse(200, $rows);
};

$app->put('/stocks/:id_stock', 'putStocks');
function putStocks($id){
    global $app;
    $data = json_decode($app->request()->getBody());
    $data->dt_update = date("Y-m-d H:i:s");
    $condition = array('id_stock'=>$id);
    $mandatory = array();
    global $db;
    $rows = $db->update("gestion_stock", $data, $condition, $mandatory);
    if($rows["status"]=="success"){
        $rows["message"] = "stock information updated successfully.";
        $rows["dt_update"] = date("d-m-Y H:i:s");
    }
    echoResponse(200, $rows);
};


// ========= insert New Stock Salle ================================================= //

$app->post('/Stocks', 'postStocks');
function postStocks(){
    global $app;
    $data = json_decode($app->request()->getBody());

    $data->dt_creation = date("Y-m-d H:i:s");
    $data->id_service = RVA_SERVICE;
    $data->quantite_current = 0;
    $data->status = 'Active';
    $data->type_stock = 'ROOM';
    $data->availability = 'Available';

    $AllsubRows = array();
//    for($i = 1; $i < 5; $i++){
        global $db;
        $mandatory = array();
        $subRows = array();
//        $data->id_location = $i;
        $rows = $db->insert("gestion_stock", $data, $mandatory);
        if($rows["status"]=="success") {
            $rows["message"] = "Stock Movement added successfully.";
            $lastInsertId = $rows['data'];

            $data_mvt_stock = new stdClass();

            $data_mvt_stock->type_mvt = 'INIT_INVENTORY';
            $data_mvt_stock->date_mvt = date("Y-m-d H:i:s");
            $data_mvt_stock->from_id_stock = $lastInsertId;
            $data_mvt_stock->to_id_stock = $lastInsertId;
            $data_mvt_stock->quantite = $data->quantite_current;
            $data_mvt_stock->dt_creation = date("Y-m-d H:i:s");
            $data_mvt_stock->further_information = 'INIT_INVENTORY' ;

            $mandatory = array();
            $stockEtage = $db->insert("gestion_stock_mvt_x", $data_mvt_stock, $mandatory);
            array_push($subRows, $stockEtage);
        }
        $rows['SubRows'] =  $subRows;
//    }

    echoResponse(200, $rows);
};



// ========= INSERT NEW MOVEMENT & UPDATE FROM_STOCK AND TO_STOCK ============================ //
$app->post('/StockMvt', 'postStockMvt');
function postStockMvt(){
    global $app;
    $data = json_decode($app->request()->getBody());

    $data_mvt_stock = new stdClass();

    $data_mvt_stock->type_mvt               = $data->type_mvt;
    $data_mvt_stock->date_mvt               = $data->date_mvt;
    $data_mvt_stock->from_id_stock          = $data->stockArticle->id_stock;
    $data_mvt_stock->to_id_stock            = $data->to_stockArticle->id_stock;
    $data_mvt_stock->quantite               = $data->quantite;
    $data_mvt_stock->dt_creation            = date("Y-m-d H:i:s");
    $data_mvt_stock->further_information    = (!empty($data->further_information) ? $data->further_information : '') ;
    $data_mvt_stock->price                  = (!empty($data->price)? $data->price : '') ;
    $data_mvt_stock->purchase_order         = (!empty($data->purchase_order)? $data->purchase_order : '') ;
    $data_mvt_stock->date_order             = (!empty($data->date_order)? $data->date_order : '') ;
    $data_mvt_stock->pack_carton            = (!empty($data->pack_carton)? $data->pack_carton : '') ;

    $mandatory = array();
    global $db;
    $subRows = array();
    $rows = $db->insert("gestion_stock_mvt_x", $data_mvt_stock, $mandatory);
    if($rows["status"]=="success"){
        $rows["message"] = "Stock Movement added successfully.";

        $dataStockUpdate = new stdClass();

        if($data_mvt_stock->type_mvt == 'INTERNAL'){

            $dataStockUpdate->dt_update = date("Y-m-d H:i:s");
            $dataStockUpdate->quantite_current = $data->stockArticle->quantite_current - $data_mvt_stock->quantite;
            $condition = array('id_stock'=>$data_mvt_stock->from_id_stock);
            $stockEtage = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);
            array_push($subRows, $stockEtage);

            $dataStockUpdate->quantite_current = $data->to_stockArticle->quantite_current + $data_mvt_stock->quantite;
            $condition = array('id_stock'=>$data_mvt_stock->to_id_stock);
            $rows2 = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);
            array_push($subRows, $rows2);
        }

        if($data_mvt_stock->type_mvt == 'INVENTORY'){

            $dataStockUpdate->dt_update = date("Y-m-d H:i:s");
            $dataStockUpdate->quantite_current = $data_mvt_stock->quantite;
            $condition = array('id_stock'=>$data_mvt_stock->from_id_stock);
            $stockEtage = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);
            array_push($subRows, $stockEtage);
        }

        if($data_mvt_stock->type_mvt == 'DELIVERY'){

            $dataStockUpdate->dt_update = date("Y-m-d H:i:s");
            $dataStockUpdate->quantite_current = $data->stockArticle->quantite_current - $data_mvt_stock->quantite;
            $condition = array('id_stock'=>$data_mvt_stock->from_id_stock);
            $stockEtage = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);
            array_push($subRows, $stockEtage);

            $dataStockUpdate->quantite_current = $data->to_stockArticle->quantite_current + $data_mvt_stock->quantite;
            $condition = array('id_stock'=>$data_mvt_stock->to_id_stock);
            $rows2 = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);
            array_push($subRows, $rows2);
        }
        $rows['SubRows'] =  $subRows;
    }
    echoResponse(200, $rows);
};

// === Get Movements ========================================================================= //
$app->get('/movements/:id_stock', 'getMovements');
function getMovements($id)
{
    global $db;
    $condition = array('from_id_stock' => $id);
    $rows = $db->selectComplex("
    SELECT  gsm.id_mvt,	gsm.from_id_stock,	gsm.to_id_stock,
        DATE_FORMAT(gsm.dt_creation,'%d-%m-%Y %H:%i ') as dt_creation,gsm.further_information,
        DATE_FORMAT(gsm.date_mvt,'%d %M %Y') as date_mvt,
        gsm.type_mvt,
        gsm.quantite,
        g_salle_f.description_f   as nameStock_from ,g_salle_f.etage,g_salle_f.numero,
        g_salle_t.description_f   as nameStock_to   ,g_salle_t.etage,g_salle_t.numero,
        g_sup.name,
        g_salle_ts.description_f  as nameStock_to_s,g_salle_ts.etage,g_salle_ts.numero
        FROM gestion_stock_mvt_x gsm
        left join gestion_stock gs_f        on gs_f.id_stock = gsm.from_id_stock  and gsm.type_mvt = 'INTERNAL'
        left join gestion_salle g_salle_f   on g_salle_f.id_salle = gs_f.id_location

        left join gestion_stock gs_t        on gs_t.id_stock = gsm.to_id_stock    and gsm.type_mvt = 'INTERNAL'
        left join gestion_salle g_salle_t   on g_salle_t.id_salle = gs_t.id_location

        left join gestion_stock gss         on gss.id_stock = gsm.from_id_stock   and gsm.type_mvt = 'DELIVERY'
        left join gestion_Suppliers g_sup   on g_sup.id_supplier = gss.id_location

        left join gestion_stock gs_ts       on gs_ts.id_stock = gsm.to_id_stock   and gsm.type_mvt = 'DELIVERY'
        left join gestion_salle g_salle_ts  on g_salle_ts.id_salle = gs_ts.id_location

        WHERE gsm.from_id_stock = $id
        OR gsm.to_id_stock = $id
        Order By gsm.date_mvt DESC
    ");
    echoResponse(200, $rows);
};

// === Get Movements Stock TRAVAUX ===================================================== //

$app->get('/movementsStock/:id_stock', 'getMovementsStock');
function getMovementsStock($id)
{
    global $db;
    $condition = array('from_id_stock' => $id);
    $rows = $db->selectComplex("
        SELECT
            gsm.id_mvt,
            gsm.from_id_stock,
            gsm.to_id_stock,
            gsm.further_information,
            DATE_FORMAT(gsm.dt_creation,'%d-%m-%Y %H:%i ')  as dt_creation,
            DATE_FORMAT(gsm.date_mvt,'%d %M %Y')            as date_mvt,
            gsm.type_mvt,
            gsm.quantite,

            g_location.description_f   as nameStock_from ,
            g_location_t.description_f   as nameStock_to ,
            g_sup.name,
            g_location_s.description_f  as nameStock_to_s

		FROM gestion_stock_mvt_x gsm

            left join gestion_stock gs_f            on gs_f.id_stock = gsm.from_id_stock  and gsm.type_mvt = 'INTERNAL'
            left join gestion_location g_location   on g_location.id_location = gs_f.id_location

            left join gestion_stock gs_t            on gs_t.id_stock = gsm.to_id_stock    and gsm.type_mvt = 'INTERNAL'
            left join gestion_location g_location_t on g_location_t.id_location = gs_t.id_location

            left join gestion_stock gss             on gss.id_stock = gsm.from_id_stock   and gsm.type_mvt = 'DELIVERY'
            left join gestion_Suppliers g_sup       on g_sup.id_supplier = gss.id_location

            left join gestion_stock gs_ts           on gs_ts.id_stock = gsm.to_id_stock   and gsm.type_mvt = 'DELIVERY'
            left join gestion_location g_location_s on g_location_s.id_location = gs_ts.id_location

        WHERE gsm.from_id_stock = $id
        OR gsm.to_id_stock = $id
        Order By gsm.dt_creation ASC
    ");
    echoResponse(200, $rows);
};

// ====== Get Suppliers Mouvements ====================================== //
$app->get('/movementSupplier/:id_stock', 'getMovementSupplier');
function getMovementSupplier($id)
{
    global $db;
    $rows = $db->selectComplex("
    SELECT  gsm.id_mvt,	gsm.from_id_stock,	gsm.to_id_stock,
        DATE_FORMAT(gsm.dt_creation,'%d-%m-%Y %H:%i ') as dt_creation,
        DATE_FORMAT(gsm.date_mvt,'%d %M %Y') as date_mvt,
        DATE_FORMAT(gsm.date_order,'%d %M %Y') as date_order,
        gsm.type_mvt,
        gsm.quantite,
        TRUNCATE(gsm.price,2) as price,
        gsm.purchase_order,
        gsm.pack_carton,
        gsm.further_information,
        ga.nom as nom_article,
        gsup.name as name_supplier
        FROM gestion_stock_mvt_x gsm
        -- retrive name article
        LEFT JOIN gestion_stock gs on gs.id_stock = gsm.to_id_stock
        LEFT JOIN gestion_article ga on ga.id_article = gs.id_article
        -- retrive name Suppliers
        LEFT JOIN gestion_stock gss on gss.id_stock = gsm.from_id_stock
        LEFT JOIN gestion_Suppliers gsup on gsup.id_supplier = gss.id_location
        WHERE gsm.type_mvt = 'DELIVERY'
        AND gsm.to_id_stock = $id
        ORDER BY gsm.date_mvt DESC"
    );
    echoResponse(200, $rows);
}


// stocksSallesToExcel
$app->put('/stocksSallesToExcel/:id_location', 'putStocksSallesToExcel');
function putStocksSallesToExcel($id_location){
    global $db, $app;
    $file_exist= false;
    $data = json_decode($app->request()->getBody());

    $data->dt_creation = date("Y-m-d H:i:s");
    $result = array();

    $rows = $db->selectComplex("
      select    g_stock.id_stock,
                g_stock.id_location,
                g_stock.id_article,
                g_stock.id_service,
                g_stock.quantite_current,
			    g_article.nom as nom_article,
			    g_stock.availability,
			    g_stock.status,

			    g_stock.stock_alert,
			    g_stock.stock_min,
			    g_article.unite,
			    g_stock_from.id_stock as from_id_stock
            from gestion_stock g_stock
			left join gestion_stock g_stock_from
			  on g_stock_from.id_article = g_stock.id_article and g_stock_from.id_location = 4
            left join gestion_article g_article
              on g_stock.id_article = g_article.id_article
            left join gestion_salle g_salle
              on g_stock.id_location = g_salle.id_salle
            where g_stock.type_stock = 'ROOM'
			  and g_stock.id_location =".$id_location);

    $result['rowsExport'] = $rows;
    include '../../partials/RVA/listArticleXls.php';

    if(!$file_exist){
        $mandatory = array();
        unset($data->nameSalle);
        $stockEtage = $db->insert("gestion_file", $data, $mandatory);
        $result["gestion_file"] = $stockEtage;
    }
    $result["file_exist"] = $file_exist;

    echoResponse(200, $result);
};


$app->put('/OrderWeeklyStock', 'putOrderWeeklyStock');
function putOrderWeeklyStock(){
    global $db, $app;
    $data = json_decode($app->request()->getBody());
    $logTransactions = array();

    foreach($data->rows as $row){
        $logTransaction = array();
        if(isset($row->stock_etage) && $row->stock_etage >= 0 ){

            $data_mvt_stock = new stdClass();

            $data_mvt_stock->type_mvt           = 'INVENTORY_CONSUMPTION';
            $data_mvt_stock->date_mvt           = $data->date_mvt; // date de mouvement
            $data_mvt_stock->from_id_stock      = $row->id_stock;
            $data_mvt_stock->to_id_stock        = $row->id_stock;
            $data_mvt_stock->quantite           = $row->stock_etage;
            $data_mvt_stock->dt_creation        = date("Y-m-d H:i:s");
            $data_mvt_stock->further_information = ('inventaire de consommation') ;

            $mandatory = array();
            $rows2 = $db->insert("gestion_stock_mvt_x", $data_mvt_stock, $mandatory);

            if($rows2["status"]=="success") {
                $rows2["message"] = "Stock Movement added successfully. [ INVENTORY_CONSUMPTION ]";

                // Update StockEtage

                $dataStockUpdate = new stdClass();
                $dataStockUpdate->dt_update = date("Y-m-d H:i:s");
                $dataStockUpdate->quantite_current = $row->stock_etage;
                $condition = array('id_stock' => $row->id_stock);
                $rows3 = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);

                if($rows3["status"]=="success")
                    $row->quantite_current = $row->stock_etage; //update quantite_current

                array_push($logTransaction, $rows3);

            }
            array_push($logTransaction, $rows2);
        }
        else array_push($logTransaction, array('message' => 'stock_etage is Not define!!! OR equal quantite_current', 'row' => $row));

        if(isset($row->recue) && $row->recue > 0){

            // Add Mouvement From StockParamedical TO StockEtage
            $data_mvt_stock_recue = new stdClass();

            $data_mvt_stock_recue->type_mvt             = 'INTERNAL';
            $data_mvt_stock_recue->date_mvt             = $data->date_mvt; // date de mouvement
            $data_mvt_stock_recue->from_id_stock        = $row->from_id_stock;
            $data_mvt_stock_recue->to_id_stock          = $row->id_stock;
            $data_mvt_stock_recue->quantite             = $row->recue;
            $data_mvt_stock_recue->dt_creation          = date("Y-m-d H:i:s");
            $data_mvt_stock_recue->further_information  = (' Recue de Economat vers Etage ') ;
            $mandatory = array();
            $rows4 = $db->insert("gestion_stock_mvt_x", $data_mvt_stock_recue, $mandatory);

            if($rows4["status"]=="success"){
                $rows4["message"] = "Stock Movement added successfully. [ INTERNAL ]";

                // Update StockEtage

                $dataStockUpdate                    = new stdClass();
                $dataStockUpdate->dt_update         = date("Y-m-d H:i:s");
                $dataStockUpdate->quantite_current  = $row->quantite_current + $row->recue;
                $condition = array('id_stock' => $row->id_stock);
                $rows6 = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);

                array_push($logTransaction, $rows6);

                // Update StockParamedical

                $dataStockUpdate->quantite_current  = $row->quantite_current_paramedical - $row->recue;
                $condition = array('id_stock' => $row->from_id_stock);
                $rows5 = $db->update("gestion_stock", $dataStockUpdate, $condition, $mandatory);

                array_push($logTransaction, $rows5);
            }
            array_push($logTransaction, $rows4);
        }
        else array_push($logTransaction, array('message' => 'Recue is Not define!!!', 'row' => $row));

        array_push($logTransactions, $logTransaction);
    }
    echoResponse(200, $logTransactions);
};

//=============================== FinalizeOrder  =================================//

$app->put('/finalizeOrder/:id_location', 'putFinalizeOrder');
function putFinalizeOrder($id_location){
    global $db, $app;
    $data = json_decode($app->request()->getBody());
    $rows = $db->selectComplex("
      select    g_stock.id_stock,
                g_stock.id_location,
                g_stock.id_article,
                g_stock.id_service,
                g_stock.quantite_current,
			    g_article.nom as nom_article,
			    g_stock.availability,
			    g_stock.status,

			    g_salle.description_f,
			    'notUpdate' as status,

			    g_stock.stock_alert,
			    g_stock.stock_min,
			    g_article.unite,
			    g_article.code_barre as ref,
                g_stock_from.id_stock as from_id_stock,
                g_stock_from.quantite_current as quantite_current_paramedical
            from gestion_stock g_stock
			left join gestion_stock g_stock_from
			  on g_stock_from.id_article = g_stock.id_article and g_stock_from.id_location = ".ID_ECONOMAT."
            left join gestion_article g_article
              on g_stock.id_article = g_article.id_article
            left join gestion_salle g_salle
              on g_stock.id_location = g_salle.id_salle
            left join gestion_family gf on gf.id_family = g_article.id_family
            where g_stock.type_stock = 'ROOM'
			  and g_stock.id_location =$id_location
			  and g_stock.status = 'Active'
            order by gf.code asc, g_article.order_article
			  ");

    echoResponse(200, $rows);
};



//=============================== StockStatusPDF =================================//



$app->get('/StockStatusPDF', 'getStockStatusPDF');
function getStockStatusPDF() {

    require('../libs/FPDF/mysql_table.php');

    class PDF extends PDF_MySQL_Table{
        function Header(){
            //Title
            $this->SetFont('Times','',20);
            $this->Cell(0,5,'RESIDENCE JEAN VAN AA',0,1,'C');
            $this->Ln(0);
            $this->SetFont('Arial','',10);
            $this->Cell(0,5,'CHAUSSEE DE BOONDAEL 104 1050 BRUXELLES',0,1,'C');
            $this->Ln(2);
            $this->SetFont('Times','',18);
            $this->Cell(0,6,'INVENTAIRE ECONOMAT',0,1,'C');
            $this->SetFont('Arial','',12);
            $this->Cell(0,6,date('d F Y H:i'),0,1,'C');
            $this->Ln(3);
            //Ensure table header is output
            parent::Header();
        }
    }

    $pdf = new PDF();

    $pdf->AddPage();
//Second table: specify 3 columns
    $pdf->AddCol('Description_Produit', 100,'','L');
    $pdf->AddCol('COND',                20,'','C');
    $pdf->AddCol('Reference',           30,'','C');
    $pdf->AddCol('STOCK',               25,'','C');
    $prop=array('HeaderColor'=>array(147,240,255),
        'color1'=>array(),
        'color2'=>array(),
        'padding'=>3);
    $pdf->Table("SELECT ga.nom as Description_Produit,
                        ga.unite as COND,
				        ga.code_barre as Reference,
				        gs.quantite_current as STOCK,
				        gf.description as nameFamily
                from  gestion_stock gs
                left join gestion_article ga on ga.id_article = gs.id_article
                left join gestion_family gf on gf.id_family = ga.id_family
                where gs.type_stock = 'ROOM'
                and gs.id_location = ".ID_ECONOMAT."
                order by gf.code asc, ga.order_article",$prop);

    $pdf->Output('StockStatus'.date("Y-m-d_H-i").'.pdf','D');
//
    //var_dump($result);
    //echoResponse(200, $result);
};

// =========================== GenerateWeeklyOrderFilePDF ===========================//

$app->get('/GenerateWeeklyOrderFilePDF/:nameSalle', 'getGenerateWeeklyOrderFilePDF');
function getGenerateWeeklyOrderFilePDF($location) {

    require('../libs/FPDF/mysql_table.php');

    global $db;
    $row = $db->selectComplex("SELECT * FROM gestion_salle where id_salle = $location LIMIT 1");
    $data = $row["data"][0];
    //var_dump($data); die();

    $pdf = new PDF_MySQL_Table();

    $pdf->AddPage();

    $pdf->SetFont('Times','',20);
    $pdf->Cell(0,5,'RESIDENCE JEAN VAN AA',0,1,'C');
    $pdf->Ln(1);
    $pdf->SetFont('Arial','',10);
    $pdf->Cell(0,5,'CHAUSSEE DE BOONDAEL 104 1050 BRUXELLES',0,1,'C');
    $pdf->Ln(2);
    $pdf->SetFont('Times','',13);
    $pdf->Cell(0,6,$data['service'].'                  COMMANDE HEBDOMADAIRE',0,1,'L');
    $pdf->Cell(0,6,$data['description_f']."                                                                                                   Date : ............................",0,1,'L');
    $pdf->SetFont('Arial','',10);
    $pdf->Cell(0,6,'PERSONNE RESPONSABLE DE LA COMMANDE : ................................................................... ',0,1,'L');

    $pdf->Ln(1);

    $pdf->Header();


//Second table: specify 3 columns
    $pdf->AddCol('ARTICLE', 85, '','L');
    $pdf->AddCol('COND',    15, '','C');
    $pdf->AddCol('REF',     20, '','L');
    $pdf->AddCol('BESOIN',  17, '','C');
    $pdf->AddCol('STOCK',   17, '','L');
    $pdf->AddCol('COMM',    17, '','C');
    $pdf->AddCol('RECUE',   17, '','C');
    $prop=array('HeaderColor'=>array(147,240,255),
        'color1'=>array(),
        'color2'=>array(),
        'padding'=>3);
    $pdf->Table("SELECT    ga.nom as ARTICLE,
                           ga.unite as COND,
                           ga.code_barre as REF,
                           gs.stock_min as BESOIN,
                           null as STOCK,
                           null as COMM,
                           null as RECUE,
                           gf.description as nameFamily
                from  gestion_stock gs
                left join gestion_article ga on ga.id_article = gs.id_article
                left join gestion_family gf on gf.id_family = ga.id_family
                where gs.type_stock = 'ROOM'
                and gs.id_location = $location
                and gs.status = 'Active'
                order by gf.code asc, ga.nom ",$prop);

    $pdf->Ln(2);
    $pdf->SetFont('Arial','',10);
    $pdf->Cell(0,6," Le bon doit etre contresigne par le Responsable du ".$data['service']. " : ..............................",0,1,'L');

    $pdf->SetFont('Arial','',12);
    $pdf->Cell(0,6,"Signature Responsable ".$data['service']." : ",0,1,'R');

//    $pdf->Ln(1);
    $pdf->SetFont('Arial','',9);
    $pdf->Cell(0,6," Mise a jour ".date("d/m/Y H:i"),0,1,'L');

    $pdf->Output("commande_Hebdomadaire_".str_replace(' ', '_', $data['service'])."_".date("Y-m-d_H-i").".pdf",'D');

//    echoResponse(200, );
};


//===================================================================================//
function echoResponse($status_code, $response) {
    global $app;
    $app->status($status_code);
    $app->contentType('application/json');
	//var_dump($response);
    echo json_encode($response);
	//JSON_NUMERIC_CHECK
}

$app->get('/hello/:name', 'getHello');
function getHello($name) {
    echo "Hallo $name";
}

$app->run();
?>
