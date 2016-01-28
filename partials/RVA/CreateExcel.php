<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 20/03/2015
 * Time: 10:33
 */

header ('Content-type: text/html; charset=utf-8');
$rootpath = addslashes($_SERVER["DOCUMENT_ROOT"]);
require_once $rootpath.'/product-manager/PHPExcel_1.8.0_doc/Classes/PHPExcel/IOFactory.php';

$objPHPExcel = new PHPExcel();

$objCalc = PHPExcel_Calculation::getInstance();
var_dump($objCalc->listFunctionNames());
//var_dump($objPHPExcel);
