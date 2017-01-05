
<?php 
	
	$file = fopen("data/104.csv", "r");
	//$str=array();

	
	while(! feof($file))
  	{
  		$str[]=fgets($file);
  		
  	}
  	fclose($file);
  	$length=count($str);
  	//echo $str[2];
  	//echo $length;
  	for ($i=1;$i<3;$i++) {
  		$d=explode(',',$str[$i],-7);
  		$data[]=$d;
  	}
  	//$result=Array();
  	//$result[]=$data;

  	for($i=1;$i<6;$i++){
  		//unset($str);
  		//unset($data);
  		//echo "data/1050".$i.".csv";
  		//$data=Array();
  		$str=Array();
  		
  		$file=fopen("data/1050".$i.".csv", "r");

		while(! feof($file))
  		{
  			$str[]=fgets($file);
  	
  		}
  		fclose($file);
  		//$length=count($str);
  		//print_r($str);
  		//echo $i;
  		//unset($str);
  		//echo $length;


  		for ($j=1;$j<3;$j++) {
  			$s=explode(',',$str[$j]);
  			$data[]=$s;
  			//print_r($s);
  			//echo $str[j]."1\n";
  			}
  			//echo count($s);
  			
/*  			
  		unset($s);
  		//print_r($data);
  		//break;
  		-

  		$result[]=$data;
  		print_r($data);
  */	
  }
  //print_r($result);
  //print_r($data);
  $file = fopen("data/data.json", "w");
  	fwrite($file,json_encode($data));
  		//print_r($result);

  	fclose( file );
?>
