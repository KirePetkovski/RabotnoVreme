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

    $stmt = $conn->query("SELECT * FROM kontroleri");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($result);
    exit;
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    switch($data["action"])  {
        case "create":

            try {
                $stmt = $conn->prepare("INSERT INTO kontroleri (IPAdress, Aktiven) VALUES (?, ?)");
                $stmt->execute([$data["IPAdress"], $data["Aktiven"]]);
                echo json_encode(["message" => "Контролероте додаден"]);
            } catch (PDOException $e) {
                echo json_encode(["error" => $e->getMessage()]);
            }
            

            break;
        // case "update":
            
        //     $stmt = $conn->prepare("UPDATE kontroleri SET Ovozmozi = ? WHERE KontrolerID = ?");
        //     $stmt->execute([$data["Ovozmozi"], $data["KontrolerID"]]);
            
        //     echo json_encode(["message" => "Kontroler updated successfully"]);
        //     break;


        default:
            echo json_encode(["error" => "Invalid or missing action"]);
            break;
    }

}

?>