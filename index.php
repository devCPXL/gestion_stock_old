<?php
//$rootpath = addslashes($_SERVER["DOCUMENT_ROOT"]);
//
//require_once $rootpath.'\\gestion_stock\\api\\v1\\index.php';
//
////include($rootpath.'\\gen_template\\lib\\manageValueSession.php');
//
//require($rootpath.'\\gen_template\\lib\\udf_mysqli_dblib.php');
//include($rootpath.'\\gen_template\\lib\\file_management.php');
//include($rootpath.'\\gen_template\\lib\\udf_gp.php');
//include($rootpath.'\\config\\config.php');
//include($rootpath.'\\config\\dblib.php');
//include($rootpath.'\\gen_template\\lib\\session_manage.php');
//
//
//$RVA_user =  (strpos(base64_decode($session_group), 'INTRA_STOCK_RVA') > -1)? true : false;
//$TRAVAUX_user =  (strpos(base64_decode($session_group), 'INTRA_STOCK_TRAVAUX') > -1)? true : false;
//
//var_dump(base64_decode($_GET['agent_session']));


//$ss_group = ($session_group == '') ? '' : trim(base64_decode($session_group));
//if (($ss_group == '') || ($ss_group == null))
// $ss_group = '';
//
//$bind = true;
//$title_html = '';
//if (strpos($ss_group, 'INTRA_STOCK_RVA') > -1)
// $title_html = 'Stock RVA';
//else
//{
// if (strpos($ss_group, 'INTRA_STOCK_TRAVAUX') > -1)
//  $title_html = 'Stock TRAVAUX';
// else
// {
//  $title_html = '';
//  $bind = false;
// }
//}
//
//if ($bind != true)
//{
// // exit of program
//}
//
//if ((trim($title_html) == '') || ($title_html == null))
//{
// // exit of program
//}
//
//$mysql_handler = fConnectDb_Msqli($host, $user, $password, $database, $charset);
//if (!$mysql_handler)
//{
// $ss_group = '';
// exit;
//}
//include($rootpath.'\\gen_template\\init_agent_value.php');
//
//if (($id_agent == '') || ($id_agent < 1) || ($id_agent == null)|| (is_numeric($id_agent) != true))
//{
// fCloseDb_Msqli($mysql_handler);
// $ss_group = '';
// exit;
//}
//
//if (date('Y-m-d') < $start_date)
//{
// fCloseDb_Msqli($mysql_handler);
// $ss_group = '';
// exit;
//}
//
//if (($end_date != '') && ($end_date != '0000-00-00') && ($end_date != '00-00-0000') && ($end_date != null))
//{
// if (date('Y-m-d') > $end_date)
// {
//  fCloseDb_Msqli($mysql_handler);
//  $ss_group = '';
//  exit;
// }
//}
//$query = '';
//$var_types = array();
//$vars = array();
//$resultat = array();
//$ligne = array();
//$alert_string = '';
//$problem_string = '';
//
//fCloseDb_Msqli($mysql_handler);
?>
<script type="text/javascript">
    var parts = window.location.search.substr(1).split("&");
    var $_GET = {};
    for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
        window.localStorage.setItem(decodeURIComponent(temp[0]), decodeURIComponent(temp[1]));
    }
    console.log($_GET);
//    window.localStorage.setItem('$_GET', $_GET);
    window.location.replace('index.html');
</script>