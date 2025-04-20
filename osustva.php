<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


require_once "db.php";

$database = new DataBase();
$conn = $database->getConnection();
$method = $_SERVER["REQUEST_METHOD"];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


switch ($method) {

    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $conn->prepare("SELECT * FROM osustvo WHERE OsustvoID = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $stmt = $conn->query("SELECT * FROM osustvo");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['action']) && $data['action'] === 'update') {
            // update (replaces PUT)
            $stmt = $conn->prepare("UPDATE osustvo SET Status = ? WHERE OsustvoID = ?");
            $stmt->execute([$data['Status'], $data['OsustvoID']]);
            echo json_encode(["message" => "Статусот е ажуриран."]);
        } elseif (isset($data['action']) && $data['action'] === 'delete') {
            // delete (replaces DELETE)
            $stmt = $conn->prepare("DELETE FROM osustvo WHERE OsustvoID = ?");
            $stmt->execute([$data['OsustvoID']]);
            echo json_encode(['message' => 'Deleted successfully']);
        } else {
            //Normalen Put 
            $stmt = $conn->prepare("INSERT INTO osustvo (OdDen, DoDen, Pricina, VrabotenID) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['OdDen'],
                $data['DoDen'],
                $data['Pricina'],
                $data['VrabotenID'],
            ]);
            echo json_encode(['message' => 'Created successfully']);
        }
        break;

    // case 'PUT':
    //     $data = json_decode(file_get_contents("php://input"), true);
    
    //     $stmt = $conn->prepare("UPDATE osustvo SET Status = ? WHERE OsustvoID=?");
    //     $stmt->execute([$data["Status"], $data["OsustvoID"]]);
    
    //     if ($stmt->execute()) {
    //         echo json_encode(["message" => "Статусот е ажуриран."]);
    //     } else {
    //         http_response_code(500);
    //         echo json_encode(["message" => "Грешка при ажурирање."]);
    //     }
    //     break;

    // case 'DELETE':
    //     if (!isset($_GET["id"])) {
    //         echo json_encode(["error" => "Missing SektorID"]);
    //         exit;
    //     }
    //     $id = intval($_GET["id"]);
    //     $stmt = $conn->prepare("DELETE FROM osustvo WHERE OsustvoID = ?");
    //     $stmt->execute([$data['id']]);
    //     echo json_encode(['message' => 'Deleted successfully']);
    //     break;

    default:
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

?>