<?php
	include('connect.php');

	$request = file_get_contents('php://input');
	$json = json_decode($request, true);
	$userid = $json['userid'];

	$list = null;

	$query = $con->prepare('SELECT list FROM prices WHERE userid = ? ORDER BY stamp desc LIMIT 1');
	$query->bind_param('s', $userid);
	$query->bind_result($list);
	
	$query->execute();
	$query->fetch();

	$query->close();
	$con->close();

	header('Content-Type: application/json; charset=utf-8');

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: origin, x-requested-with, content-type');
	header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');

	$response['list'] = $list;

	echo json_encode($response);
?>