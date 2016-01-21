<?php
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');//allow cross site ajax
header('Access-Control-Allow-Methods: GET');

$type=$_GET["type"];
$data=$_GET["data"];
$url="http://data.taipei/".$type."/".$data;
if($data=="Stop" && $type=="bus" ){
    //Bus Stop Cache
    $url="GetSTOP.json";
}

//for Taipei Metro data
if($type=="mrt"){
    switch ($data) {
        //捷運車站出入口
        case 'entrance':
            $rid="69bce456-b934-42fd-be18-2d3cb1c3ef84";
            break;

        //轉乘車站轉乘步行時間
        case 'walk':
            $rid="cb7c5713-44f6-43e2-b736-f407af94afef";
            break;

        //捷運列車到站資料
        case 'arrive':
            $rid="55ec6d6e-dc5c-4268-a725-d04cc262172b";
            break;
    }
    $url="http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=".$rid;
}

$data  = file_get_contents("compress.zlib://".$url);

echo $data;

?>
