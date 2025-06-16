<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'db.php';

$database = new DataBase();
$conn = $database->getConnection();
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["IPAddress"])) {
        $stmt = $conn->prepare("UPDATE kontroleri SET Aktiven = 1, Azuriran = NOW() WHERE IPAdress = ?");
        $stmt->execute([$data["IPAddress"]]);

        echo json_encode(["message" => "Kontrolerot e aktiven"]);
    } else {
        echo json_encode(["error" => "Missing IPAddress"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
?>
