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
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM vraboteni WHERE VrabotenID = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $stmt = $conn->query("SELECT * FROM vraboteni");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    echo json_encode($data);
    exit;
}

if ($method === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    $action = $input["action"] ?? "";

    switch ($action) {
        case "create":
        try{
            $stmt = $conn->prepare("INSERT INTO vraboteni (CardID, ImePrezime, Nacionalnost, Religija, Aktiven, RasporedID, SektorID) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['CardID'],
                $input['ImePrezime'],
                $input['Nacionalnost'],
                $input['Religija'],
                $input['Aktiven'],
                $input['RasporedID'],
                $input['SektorID']
            ]);
        }
        catch (PDOException $e) {
        http_response_code(500); // let the browser know it's a server error
        echo json_encode(["error" => $e->getMessage()]);
    }
            echo json_encode(["message" => "Employee added successfully"]);
            break;

        case "update":
            if (isset($input["Aktiven"]) && count($input) == 3) {
                $sql = "UPDATE vraboteni SET Aktiven = ? WHERE VrabotenID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$input["Aktiven"], $input["VrabotenID"]]);
                echo json_encode(["message" => "Employee status updated successfully"]);
                break;
            }

            $sql3 = "UPDATE vraboteni SET CardID = ?, ImePrezime = ?, Nacionalnost = ?, Religija = ?, RasporedID = ?, SektorID = ? WHERE VrabotenID = ?";
            $stmt3 = $conn->prepare($sql3);
            $stmt3->execute([
                $input['CardID'],
                $input['ImePrezime'],
                $input['Nacionalnost'],
                $input['Religija'],
                $input['RasporedID'],
                $input['SektorID'],
                $input["VrabotenID"]
            ]);
            echo json_encode(["message" => "Employee updated successfully"]);
            break;

        case "delete":
            if (!isset($input["VrabotenID"])) {
                echo json_encode(["error" => "Missing VrabotenID"]);
                exit;
            }
            $id = intval($input["VrabotenID"]);
            $stmt = $conn->prepare("DELETE FROM vraboteni WHERE VrabotenID = ?");
            $stmt->execute([$id]);
            echo json_encode(["message" => "Employee deleted successfully"]);
            break;

        default:
            echo json_encode(["error" => "Invalid or missing action"]);
            break;
    }

    exit;
}
?>

// switch ($method) {
//     case "GET":
//         if (isset($_GET['id'])) {
//             $id = $_GET['id'];
//             $stmt = $conn->prepare("SELECT * FROM vraboteni WHERE VrabotenID = ?");
//             $stmt->execute([$id]);
//             $data = $stmt->fetch(PDO::FETCH_ASSOC);
//         } else {
//             $stmt = $conn->query("SELECT * FROM vraboteni");
//             $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
//         }
//         echo json_encode($data);
//         break;
    
//     case "POST":
//         $input = json_decode(file_get_contents("php://input"), true);
//         $stmt = $conn->prepare("INSERT INTO vraboteni (CardID, ImePrezime, Nacionalnost, Religija, Aktiven, RasporedID, SektorID) VALUES (?, ?, ?, ?, ?, ?, ?)");
//         $stmt->execute([$input['CardID'], $input['ImePrezime'], $input['Nacionalnost'], $input['Religija'], $input['Aktiven'], $input['RasporedID'], $input['SektorID']]);
//        echo json_encode(["message" => "Employee added successfully"]);
//         break;
    
//     case "PUT":
//         $input = json_decode(file_get_contents("php://input"), true);

//         if (isset($input["Aktiven"]) && count($input) == 2) {
//             $sql = "UPDATE vraboteni SET Aktiven = ? WHERE VrabotenID = ?";
//             $stmt = $conn->prepare($sql);
//             $stmt->execute([$input["Aktiven"], $input["id"]]);
//             echo json_encode(["message" => "Employee status updated successfully"]);
//             break;
//         }
//         $sql3 = "UPDATE vraboteni SET CardID = ?, ImePrezime = ?, Nacionalnost = ?, Religija = ?, RasporedID = ?, SektorID = ? WHERE VrabotenID = ?";
//         $stmt3 = $conn->prepare($sql3);
//         $stmt3->execute([$input['CardID'], $input['ImePrezime'], $input['Nacionalnost'], $input['Religija'], $input['RasporedID'], $input['SektorID'], $input["VrabotenID"]]);
//         echo json_encode(["message" => "Employee updated successfully"]);
//         break;
    
//     case "DELETE":
//         if (!isset($_GET["id"])) {
//             echo json_encode(["error" => "Missing SektorID"]);
//             exit;
//         }
//         $id = intval($_GET["id"]);
//         $stmt = $conn->prepare("DELETE FROM vraboteni WHERE VrabotenID = ?");
//         $stmt->execute([$id]);
//         echo json_encode(["message" => "Employee deleted successfully"]);
//         break;
    
//     default:
//         echo json_encode(["message" => "Invalid request method"]);
//         break;
//}
