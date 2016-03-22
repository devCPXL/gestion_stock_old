<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 26/02/2016
 * Time: 14:55
 */
require_once '../../api/v1/dbHelper.php';

$db = new dbHelper(DB_NAME);

$contentsFile = file_get_contents('List_Products_Rva.json');

$products = json_decode($contentsFile, true);

$results = array();
$i = 0;
foreach($products as $product) {
$i++;
    $product = (object) $product;

    echo '<pre>'.$i. ' - ' . print_r($product, true) . '</pre>';

    $article = new stdClass();

    $article->code_barre    = $product->code_barre;
    $article->nom           = $product->nom;
    $article->description_f = $product->description_f;
    $article->mark          = $product->mark;
    $article->type_article  = $product->type_article;
    $article->price         = $product->price;
    $article->vat           = $product->vat;
    $article->unite         = $product->unite;
    $article->id_family     = $product->id_family;
    $article->quantite      = 0;
    $article->status        = "Active";
    $article->id_service    = 15; // Rva Service
    $article->dt_creation = date("Y-m-d H:i:s");

    $rows = $db->insert("gestion_article", $article, $mandatory);

    $lastInsertId = $rows['data'];

    array_push($results, $rows);

// Insert SUPPLIER Stock
    $stockSupplier = new stdClass();
    $stockSupplier->id_article      = $lastInsertId;
    $stockSupplier->id_location     = $product->id_supplier;
    $stockSupplier->type_stock      = "SUPPLIER";
    $stockSupplier->prix_current    = $product->price;
    $stockSupplier->dt_creation     = date("Y-m-d H:i");
    $stockSupplier->status          = 'Active';
    $stockSupplier->stock_min       = 0;
    $stockSupplier->stock_alert     = 0;
    $stockSupplier->quantite_current = 0;
    $stockSupplier->id_service      = 15; // Rva Service

    $rows1 = $db->insert("gestion_stock", $stockSupplier, $mandatory);
    array_push($results, $rows1);

// Insert MATERIAL Stock
    $stockStore = new stdClass();
    $stockStore->id_article      = $lastInsertId;
    $stockStore->id_location     = 4; // id_salle "Stock Economat RVA"
    $stockStore->type_stock      = "ROOM";
    $stockStore->dt_creation     = date("Y-m-d H:i");
    $stockStore->status          = 'Active';
    $stockStore->stock_min       = 1;
    $stockStore->stock_alert     = 1;
    $stockStore->quantite_current = empty($product->quantite_current) ? 0 : $product->quantite_current;
    $stockStore->id_service      = 15; // Rva Service

    $rows2 = $db->insert("gestion_stock", $stockStore, $mandatory);
    array_push($results, $rows2);

}
echo json_encode($results);