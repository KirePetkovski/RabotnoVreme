<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once "db.php";

$database = new DataBase();
$conn = $database->getConnection();
$method = $_SERVER["REQUEST_METHOD"];


$sql = "UPDATE kontroleri SET Aktiven = 0 WHERE Azuriran IS NOT NULL AND Azuriran < (NOW() - INTERVAL 20 SECOND)";
$conn->query($sql);

echo json_encode(["message" => "Inactive kontroleri updated"]);
?>
