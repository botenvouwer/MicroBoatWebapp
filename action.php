<?php
	
	$action = $_REQUEST['action'];
	$subaction = $_REQUEST['level'];
	
	switch($action){
		case 'start':
		
			echo '<start>Oke it works</start>';
		
			break;
		
		default:
			
			echo '<error id="001">Someting went wrong!</error>';
			
			break;
	}
	
?>