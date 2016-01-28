<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 23/03/2015
 * Time: 08:25
 */

require_once '../api/v1/dbHelper.php';
$db = new dbHelper();
$rows = $db->select("gestion_article","id_article,nom,code_barre,description_f,quantite,unite,status",array());



foreach ($rows['data'] as $row) {
    var_dump($row['nom']);
}