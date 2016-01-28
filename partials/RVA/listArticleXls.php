<?php

/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 23/03/2015
 * Time: 08:14
 */

/**
 * PHPExcel
 *
 * Copyright (C) 2006 - 2014 PHPExcel
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category   PHPExcel
 * @package    PHPExcel
 * @copyright  Copyright (c) 2006 - 2014 PHPExcel (http://www.codeplex.com/PHPExcel)
 * @license    http://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt	LGPL
 * @version    1.8.0, 2014-03-02
 */

/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('europe/brussels');

define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');


///** Include Php File */
//require_once '../api/v1/dbHelper.php';
//$db = new dbHelper();
//$rows = $db->select("gestion_article","id_article,nom,code_barre,description_f,quantite,unite,status",array());

/** Include PHPExcel */
require_once '../../../PHPExcel_1.8.0_doc/Classes/PHPExcel.php';
//echo '../PHPExcel_1.8.0_doc/Classes/PHPExcel.php';

// Generate Name File
//$data->nameSalle = iconv('utf-8','ASCII//IGNORE//TRANSLIT',$data->nameSalle);
//$linkFile = "XlsxExport/commande_hebdomadaire_".$data->nameSalle."_".$data->date.".xlsx";
//$nameFile = "commande_hebdomadaire_".$data->nameSalle."_".$data->date.".xlsx";

//$data->linkFile = $linkFile;
//$data->nameFile = $nameFile;

$result["keywordsFile"] = $data;

// Create new PHPExcel object
//echo date('H:i:s') , " Create new PHPExcel object" , EOL;
$objPHPExcel = new PHPExcel();

// Set document properties
//echo date('H:i:s') , " Set document properties" , EOL;
$objPHPExcel->getProperties()->setCreator("CPAS La Résidence van Aa")
    ->setLastModifiedBy("Nizar Lakroubassi ")
    ->setTitle("Liste Articles Office 2007 XLSX")
    ->setSubject("Liste Article Office 2007 XLSX")
    ->setDescription("Liste Article for Office 2007 XLSX")
    ->setKeywords(json_encode((array)$data))
    ->setCategory("Commande article");

// Set default font
//echo date('H:i:s') , " Set default font" , EOL;
$objPHPExcel->getDefaultStyle()->getFont()->setName('Arial')
    ->setSize(10);

// Add some data, resembling some different data types
//echo date('H:i:s') , " Add some data" , EOL;
$objPHPExcel->getActiveSheet()->setCellValue('B3', 'SERVICE SOINS');
$objPHPExcel->getActiveSheet()->setCellValue('C3', 'COMMANDE HEBDOMADAIRE');
$objPHPExcel->getActiveSheet()->setCellValue('B4', 'ETAGE :     1er ETAGE');

$objPHPExcel->getActiveSheet()->setCellValue('E4', 'DATE :');
$objPHPExcel->getActiveSheet()->setCellValue('B5', 'PERSONNE RESPONSABLE DE LA COMMANDE : ……………………………………');

$objPHPExcel->getActiveSheet()->setCellValue('A6', 'Ref.');
$objPHPExcel->getActiveSheet()->setCellValue('B6', 'ART.');
$objPHPExcel->getActiveSheet()->setCellValue('C6', 'COND.');
$objPHPExcel->getActiveSheet()->setCellValue('D6', 'BESOIN.');
$objPHPExcel->getActiveSheet()->setCellValue('E6', 'STOCK.');
$objPHPExcel->getActiveSheet()->setCellValue('F6', 'COMMANDE.');
$objPHPExcel->getActiveSheet()->setCellValue('G6', 'RECUE.');


$style = array(
    'alignment' => array(
        'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
    )
);
$objPHPExcel->getActiveSheet()->getStyle("A1:B1")->applyFromArray($style);
$objPHPExcel->getActiveSheet()->getStyle("B")->applyFromArray($style);

$i = 7;
foreach ($rows['data'] as $row) {
    $row['nom_article'];
    $objPHPExcel->getActiveSheet()->setCellValue("A".$i, $row['id_stock'].'|'.$row['from_id_stock'] );    $objPHPExcel->getActiveSheet()->setCellValue("B".$i, $row['nom_article'] );
    $objPHPExcel->getActiveSheet()->setCellValue("C".$i, $row['unite'] );
    $objPHPExcel->getActiveSheet()->setCellValue("D".$i, $row['stock_min'] );
    $objPHPExcel->getActiveSheet()->setCellValue("G".$i, $row['quantite_current'] );

    $objPHPExcel->getActiveSheet()->getStyle("A".$i)->applyFromArray($style);
    $objPHPExcel->getActiveSheet()->getStyle("B".$i)->applyFromArray($style);
    $objPHPExcel->getActiveSheet()->getStyle("C".$i)->applyFromArray($style);
    $objPHPExcel->getActiveSheet()->getStyle("D".$i)->applyFromArray($style);
    $objPHPExcel->getActiveSheet()->getStyle("E".$i)->applyFromArray($style);
    $objPHPExcel->getActiveSheet()->getStyle("F".$i)->applyFromArray($style);
    $objPHPExcel->getActiveSheet()->getStyle("G".$i)->applyFromArray($style);

    $i++;
}


//$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
//$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setVisible(false);

// Rename worksheet
//echo date('H:i:s') , " Rename worksheet" , EOL;
$objPHPExcel->getActiveSheet()->setTitle('Liste Article');


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

// Save Excel 2007 file
if (!file_exists("../../XlsxExport/".$nameFile)){
    //echo date('H:i:s') , " Write to Excel2007 format" , EOL;
    $callStartTime = microtime(true);

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save("../../XlsxExport/".$nameFile);
//$objWriter->save(str_replace('.php', '.xlsx', __FILE__));
    $callEndTime = microtime(true);
    $callTime = $callEndTime - $callStartTime;
    //echo date('H:i:s') , " File written to " , str_replace('.php', '.xlsx', pathinfo(__FILE__, PATHINFO_BASENAME)) , EOL;
    //echo 'Call time to write Workbook was ' , sprintf('%.4f',$callTime) , " seconds" , EOL;
// Echo memory usage
    //echo date('H:i:s') , ' Current memory usage: ' , (memory_get_usage(true) / 1024 / 1024) , " MB" , EOL;
}
else{
    //echo 'file Exist';
    $file_exist = true;
}



//echo date('H:i:s') , " Reload workbook from saved file" , EOL;
//$callStartTime = microtime(true);
//

//$nameFile = "commande_hebdomadaire_".$data->nameSalle."_".$data->date_order.".xlsx";
//$objPHPExcel = PHPExcel_IOFactory::load($nameFile);

//$callEndTime = microtime(true);
//$callTime = $callEndTime - $callStartTime;
//echo 'Call time to reload Workbook was ' , sprintf('%.4f',$callTime) , " seconds" , EOL;
//// Echo memory usage
//echo date('H:i:s') , ' Current memory usage: ' , (memory_get_usage(true) / 1024 / 1024) , " MB" , EOL;
//
//
//var_dump($objPHPExcel->getActiveSheet()->toArray());
//
//
//// Echo memory peak usage
//echo date('H:i:s') , " Peak memory usage: " , (memory_get_peak_usage(true) / 1024 / 1024) , " MB" , EOL;
//
//// Echo done
//echo date('H:i:s') , " Done testing file" , EOL;
//echo 'File has been created in ' , getcwd() , EOL;

