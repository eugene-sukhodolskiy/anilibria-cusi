<?php

$conf = require_once "conf.php";

$title_id = intval($_GET["title_id"]);
$episode_num = intval($_GET["episode_num"]);

$request_url = "http://{$conf["api"]["domen"]}/{$conf["api"]["ver"]}/title?id={$title_id}";
$raw_resp = file_get_contents($request_url);

$folder = $conf["storage"]["folder"] . "/{$title_id}";
if(!file_exists($folder)) {
	mkdir($folder, 0755);
}

file_put_contents("{$folder}/title.json", $raw_resp);

$response = json_decode($raw_resp);
$host = $response -> player -> host;
$episode = $response -> player -> list -> $episode_num;

// download episode preview
file_put_contents(
	"{$folder}/preview_{$title_id}_{$episode_num}.jpg", 
	file_get_contents("http://{$conf["domen"]}{$episode -> preview}")
);

$quality = $conf["quality"];
$m3u8 = file_get_contents("http://{$host}{$episode -> hls -> $quality}");
die($m3u8);
// download hls
file_put_contents(
	"{$folder}/hls_{$title_id}_{$episode_num}_{$quality}.m3u8",
	$m3u8
);

// die(json_encode($episode));
