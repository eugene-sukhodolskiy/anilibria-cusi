<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');


function get_ufilename($uemail) {
	return str_replace("@", ".", $uemail) . ".json";
}

function correctly_uemail_or_error($uemail) {
	if(strlen($uemail) < 5) {
		return die(json_encode([
			"result" => false
		]));
	}
}

function save_action($uemail, $data) {
	$uemail = strip_tags(trim($uemail));
	correctly_uemail_or_error($uemail);

	$filename = get_ufilename($uemail);
	$writable_data = json_encode([
		"uemail" => $uemail,
		"data" => json_decode($data)
	], JSON_PRETTY_PRINT);

	return die(json_encode([
		"result" => file_put_contents("./storage/{$filename}", $writable_data)
	]));
}

function restore_action($uemail) {
	$uemail = strip_tags(trim($uemail));
	correctly_uemail_or_error($uemail);

	$filename = get_ufilename($uemail);
	if(!file_exists("./storage/{$filename}")) {
		return die(json_encode([
			"result" => false
		]));
	}

	$file = json_decode(file_get_contents("./storage/{$filename}"));
	return die(json_encode([
		"result" => $file
	]));
}


if(isset($_POST["uemail"]) && isset($_POST["data"])) {
	save_action($_POST["uemail"], $_POST["data"]);
} elseif(isset($_GET["uemail"])) {
	restore_action($_GET["uemail"]);
}