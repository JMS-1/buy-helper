<?php
	include('connect.php');

	$request = file_get_contents('php://input');
	$json = json_decode($request, true);
	$userid = $json['userid'];
	$list = $json['list'];

	$insert = $con->prepare('INSERT INTO prices (userid, list) VALUES(?, ?)');
	$insert->bind_param('ss', $userid, $list);

	$success = $insert->execute();

	$insert->close();
	$con->close();

	header('Content-Type: application/json; charset=utf-8');

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: origin, x-requested-with, content-type');
	header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');

	$response["success"] = $success;
	
	echo json_encode($response);
?>