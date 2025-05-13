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
    if (isset($_GET['CardID'])) {
        $cardID = $_GET['CardID'];

        $stmt = $conn->prepare("SELECT * FROM vraboteni WHERE CardID = ?");
        $stmt->execute([$cardID]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            $data['success'] = true;
        } else {
            $data['success'] = false;
        }
        echo json_encode($data);
    } else {
        echo json_encode(["success" => false, "message" => "No CardID provided"]);
    }
}

if ($method === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO korisnici (Lozinka, Uloga, Email, VrabotenID, CardID) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['Lozinka'],
            $input['Uloga'],
            $input['Email'],
            $input['VrabotenID'],
            $input['CardID']
        ]);

        echo json_encode(["success" => true, "message" => "User added successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
?>
