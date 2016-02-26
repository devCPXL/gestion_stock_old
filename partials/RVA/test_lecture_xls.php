<?php
header ('Content-type: text/html; charset=utf-8');
echo "flgkndfl ";
$rootpath = addslashes($_SERVER["DOCUMENT_ROOT"]);
require_once $rootpath.'/PHPExcel_1.8.0_doc/Classes/PHPExcel/IOFactory.php';
require_once '../../api/v1/dbHelper.php';

$db = new dbHelper(DB_NAME);

// Chargement du fichier Excel
$objPHPExcel = PHPExcel_IOFactory::load("List_Products_final.xlsx");

/**
 * récupération de la première feuille du fichier Excel
 * @var PHPExcel_Worksheet $sheet
 */
$sheet = $objPHPExcel->getSheet(0);
$results = array();

foreach($sheet->getRowIterator() as $row) {
    $mandatory = array();
    $rowIndex = $row->getRowIndex();

    $article = new stdClass();

    $article->code_barre    = $sheet->getCell('A' . $rowIndex)->getValue();
    $article->nom           = $sheet->getCell('B' . $rowIndex)->getValue();
    $article->description_f = $sheet->getCell('C' . $rowIndex)->getValue();
    $article->mark          = $sheet->getCell('D' . $rowIndex)->getValue();
    $article->type_article  = $sheet->getCell('E' . $rowIndex)->getValue();
    $article->price         = $sheet->getCell('F' . $rowIndex)->getValue();
    $article->vat           = $sheet->getCell('I' . $rowIndex)->getValue();
    $article->unite         = $sheet->getCell('H' . $rowIndex)->getValue();
    $article->id_family     = $sheet->getCell('J' . $rowIndex)->getValue();
    $article->quantite      = 0;
    $article->status        = "Active";
    $article->id_service    = 19;
    $article->dt_creation = date("Y-m-d H:i:s");

    $rows = $db->insert("gestion_article", $article, $mandatory);

    $lastInsertId = $rows['data'];

    array_push($results, $rows);

// Insert SUPPLIER Stock
    $stockSupplier = new stdClass();
    $stockSupplier->id_article      = $lastInsertId;
    $stockSupplier->id_location     = $sheet->getCell('K' . $rowIndex)->getValue(); // id_supplier
    $stockSupplier->type_stock      = "SUPPLIER";
    $stockSupplier->prix_current    = $sheet->getCell('F' . $rowIndex)->getValue();
    $stockSupplier->dt_creation     = date("Y-m-d H:i");
    $stockSupplier->status          = 'Active';
    $stockSupplier->stock_min       = 0;
    $stockSupplier->stock_alert     = 0;
    $stockSupplier->quantite_current = 0;
    $stockSupplier->id_service      = 19;

    $rows1 = $db->insert("gestion_stock", $stockSupplier, $mandatory);
    array_push($results, $rows1);

// Insert MATERIAL Stock
    $stockStore = new stdClass();
    $stockStore->id_article      = $lastInsertId;
    $stockStore->id_location     = 7; //$stockStore id_location _Magasin_
    $stockStore->type_stock      = "MATERIAL";
    $stockStore->dt_creation     = date("Y-m-d H:i");
    $stockStore->status          = 'Active';
    $stockStore->stock_min       = 1;
    $stockStore->stock_alert     = 1;
    $stockStore->quantite_current = (empty($sheet->getCell('G' . $rowIndex)->getValue())) ? 0 : $sheet->getCell('G' . $rowIndex)->getValue();
    $stockStore->id_service      = 19;

    $rows2 = $db->insert("gestion_stock", $stockStore, $mandatory);
    array_push($results, $rows2);

}
echo json_encode($results);

?>
