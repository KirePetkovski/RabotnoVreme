<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once "db.php";

$database = new DataBase();
$conn = $database->getConnection();
$method = $_SERVER["REQUEST_METHOD"];


if ($method === "GET") {
    if (isset($_GET["id"])) {
        $id = intval($_GET["id"]);
        $stmt = $conn->prepare("SELECT * FROM sektori WHERE SektorID = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $stmt = $conn->query("SELECT * FROM sektori");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    echo json_encode($result);
    exit;
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data["action"] ?? "";

    switch ($action) {
        case "create":
            if (!isset($data["SektorIme"])) {
                echo json_encode(["error" => "Missing SektorIme"]);
                exit;
            }
            $stmt = $conn->prepare("INSERT INTO sektori (SektorIme, Opis) VALUES (?, ?)");
            $stmt->execute([$data["SektorIme"], $data["Opis"] ?? null]);
            echo json_encode(["message" => "Department added successfully"]);
            break;

        case "update":
            if (!isset($data["SektorID"]) || !isset($data["SektorIme"])) {
                echo json_encode(["error" => "Missing SektorID or SektorIme"]);
                exit;
            }
            $stmt = $conn->prepare("UPDATE sektori SET SektorIme = ?, Opis = ? WHERE SektorID = ?");
            $stmt->execute([$data["SektorIme"], $data["Opis"] ?? null, $data["SektorID"]]);
            echo json_encode(["message" => "Department updated successfully"]);
            break;

        case "delete":
            if (!isset($data["SektorID"])) {
                echo json_encode(["error" => "Missing SektorID"]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM sektori WHERE SektorID = ?");
            $stmt->execute([$data["SektorID"]]);
            echo json_encode(["message" => "Department deleted successfully"]);
            break;

        default:
            echo json_encode(["error" => "Invalid or missing action"]);
            break;
    }

    exit;
}

?>

//switch ($method) {
//     case "GET":
//         if (isset($_GET["id"])) {
//             $id = intval($_GET["id"]);
//             $stmt = $conn->prepare("SELECT * FROM sektori WHERE SektorID = ?");
//             $stmt->execute([$id]);
//             $result = $stmt->fetch(PDO::FETCH_ASSOC);
//         } else {
//             $stmt = $conn->query("SELECT * FROM sektori");
//             $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
//         }
//         echo json_encode($result);
//         break;

//     case "POST":
//         $data = json_decode(file_get_contents("php://input"), true);
//         if (!isset($data["SektorIme"])) {
//             echo json_encode(["error" => "Missing SektorIme"]);
//             exit;
//         }
//         $stmt = $conn->prepare("INSERT INTO sektori (SektorIme, Opis) VALUES (?, ?)");
//         $stmt->execute([$data["SektorIme"], $data["Opis"] ?? null]);
//         echo json_encode(["message" => "Department added successfully"]);
//         break;

//     case "PUT":
//         $data = json_decode(file_get_contents("php://input"), true);
//         if (!isset($data["SektorID"]) || !isset($data["SektorIme"])) {
//             echo json_encode(["error" => "Missing SektorID or SektorIme"]);
//             exit;
//         }
//         $stmt = $conn->prepare("UPDATE sektori SET SektorIme = ?, Opis = ? WHERE SektorID = ?");
//         $stmt->execute([$data["SektorIme"], $data["Opis"] ?? null, $data["SektorID"]]);
//         echo json_encode(["message" => "Department updated successfully"]);
//         break;

//     case "DELETE":
//         if (!isset($_GET["id"])) {
//             echo json_encode(["error" => "Missing SektorID"]);
//             exit;
//         }
//         $id = intval($_GET["id"]);
//         $stmt = $conn->prepare("DELETE FROM sektori WHERE SektorID = ?");
//         $stmt->execute([$id]);
//         echo json_encode(["message" => "Department deleted successfully"]);
//         break;

//     default:
//         echo json_encode(["error" => "Invalid request method"]);
//         break;
// }

