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


if ($method === "GET") {

    $stmt = $conn->query("SELECT * FROM praznici");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($result);
    exit;
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    try {
        $stmt = $conn->prepare("INSERT INTO praznici (PraznikIme, Datum, TipPraznik) VALUES (?, ?, ?)");
        $stmt->execute([$data["PraznikIme"], $data["Datum"], $data["TipPraznik"]]);
        echo json_encode(["message" => "Praznik added successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
    
}

?>