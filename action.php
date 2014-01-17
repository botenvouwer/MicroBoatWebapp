<?php

	include('engine.php');
	
	$action = $_REQUEST['action'];
	$subaction = $_REQUEST['subaction'];
	
	if(!class_exists($action)){
		echo '<error id="01">Fatal error: action "'.$action.'" does not exist</error>';
		exit;
	}
	
	$action = new $action();
	
	if(!method_exists($action, $subaction)){
		$subaction = 'main';
	}
	
	if(!method_exists($action, $subaction)){
		echo '<error id="02">Fatal error: level "'.$_REQUEST['action'].'->'.$subaction.'" does not exist</error>';
		exit;
	}
	
	//$action->db = new PDO(''); //uitilize your database driver
	//$action->conf = loadconf(); //load your configurations
	//$action->path = createsymlinks(); //create your file paths and urls
	$action->param = (isset($_REQUEST['param']) ? $_REQUEST['param'] : '');
	
	$action->$subaction();
	
?>