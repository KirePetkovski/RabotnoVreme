<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include 'db.php';

$database = new DataBase();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $stmt = $conn->query("SELECT * FROM Izvestuvanje");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["CardID"]) || !isset($data["PratenoOd"])) {
        http_response_code(400);
        echo json_encode(["error" => "CardID and PratenoOd are required"]);
        exit();
    }

    $date = date('Y-m-d');
    $stmt = $conn->prepare("INSERT INTO Izvestuvanje (CardID, Sodrzina, Datum, PratenoOd) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $data["CardID"],
        $data["Sodrzina"] ?? null,
        $date,
        $data["PratenoOd"]
    ]);

    echo json_encode(["message" => "Notification added successfully"]);

    $Sodrzina = isset($data["Sodrzina"]) ? $data["Sodrzina"] : null;
    $PratenoOd = isset($data["PratenoOd"]) ? $data["PratenoOd"] : null;
    $Email = isset($data["Email"]) ? $data["Email"] : null;
    
    $subject = "Ново известување од системот";
    $headers = "From: " . $PratenoOd;
    $message = $Sodrzina;

    if (mail($Email, $subject, $message, $headers)) {
        echo json_encode(["success" => true, "message" => "Email испратен успешно."]);
    } else {
        echo json_encode(["success" => false, "message" => "Неуспешно испраќање на емаил."]);
    }
}

?>
