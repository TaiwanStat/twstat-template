<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');//allow cross site ajax
header('Access-Control-Allow-Methods: GET');

$data=$_GET['type'];
$url="http://data.taipei/".$data."/".$_GET["data"];
if($_GET["data"]=="Stop"){
    $url="GetSTOP.json";
}

$data  = file_get_contents("compress.zlib://".$url);

echo $data;

?>
