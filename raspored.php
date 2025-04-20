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

if ($method === "GET"){
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM raspored WHERE RasporedID = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($result);
        } else {
            $stmt = $conn->query("SELECT * FROM raspored");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result);
        }
}
    
        if ($method === "POST"){
            $data = json_decode(file_get_contents("php://input"), true);
        
            if (!$data || !isset($data['action'])) {
                echo json_encode(["error" => "No data or action provided"]);
                exit;
            }
        
            switch ($data['action']) {
               case "create":
    try {
        $stmt = $conn->prepare("INSERT INTO raspored (RasporedIme, Ponedelnik, Vtornik, Sreda, Cetvrtok, Petok, Sabota, RabotnoVreme, PauzaPocetok, PauzaKraj, PauzaVreme) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['RasporedIme'],
            $data['Ponedelnik'],
            $data['Vtornik'],
            $data['Sreda'],
            $data['Cetvrtok'],
            $data['Petok'],
            $data['Sabota'],
            $data['RabotnoVreme'],
            $data['PauzaPocetok'],
            $data['PauzaKraj'],
            $data['PauzaVreme']
        ]);
        echo json_encode(["message" => "Record created successfully"]);
    } catch (PDOException $e) {
        http_response_code(500); // let the browser know it's a server error
        echo json_encode(["error" => $e->getMessage()]);
    }
    break;

        
                case "update":
                    if (!isset($data['RasporedID'])) {
                        echo json_encode(["error" => "RasporedID is required for update"]);
                        exit;
                    }
                    $stmt = $conn->prepare("UPDATE raspored SET RasporedIme = ?, Ponedelnik = ?, Vtornik = ?, Sreda = ?, Cetvrtok = ?, Petok = ?, Sabota = ?, RabotnoVreme = ?, PauzaPocetok = ?, PauzaKraj = ?, PauzaVreme = ? WHERE RasporedID = ?");
                    $stmt->execute([
                        $data['RasporedIme'],
                        $data['Ponedelnik'],
                        $data['Vtornik'],
                        $data['Sreda'],
                        $data['Cetvrtok'],
                        $data['Petok'],
                        $data['Sabota'],
                        $data['RabotnoVreme'],
                        $data['PauzaPocetok'],
                        $data['PauzaKraj'],
                        $data['PauzaVreme'],
                        $data['RasporedID']
                    ]);
                    echo json_encode(["message" => "Record updated successfully"]);
                    break;
        
                case "delete":
                    if (!isset($data['id'])) {
                        echo json_encode(["error" => "ID is required for deletion"]);
                        exit;
                    }
                    $id = intval($data['id']);
                    $stmt = $conn->prepare("DELETE FROM raspored WHERE RasporedID = ?");
                    $stmt->execute([$id]);
                    echo json_encode(["message" => "Record deleted successfully"]);
                    break;
        
                default:
                    echo json_encode(["error" => "Invalid action"]);
                    break;
            }
        

        
        
    //     case "PUT":
    //         $data = json_decode(file_get_contents("php://input"), true);
        
    //         if (!isset($data['RasporedID'])) {
    //             echo json_encode(["error" => "ID is required"]);
    //             exit;
    //         }
    //         $stmt = $conn->prepare("UPDATE raspored SET RasporedIme = ?, Ponedelnik = ?, Vtornik = ?, Sreda = ?, Cetvrtok = ?, Petok = ?, Sabota = ?, RabotnoVreme = ?, PauzaPocetok = ?, PauzaKraj = ?, PauzaVreme = ? WHERE RasporedID = ?");
        
    //         $stmt->execute([
    //             isset($data['RasporedIme']) ? $data['RasporedIme'] : "",
    //             isset($data['Ponedelnik']) ? $data['Ponedelnik'] : "",
    //             isset($data['Vtornik']) ? $data['Vtornik'] : "",
    //             isset($data['Sreda']) ? $data['Sreda'] : "",
    //             isset($data['Cetvrtok']) ? $data['Cetvrtok'] : "",
    //             isset($data['Petok']) ? $data['Petok'] : "",
    //             isset($data['Sabota']) ? $data['Sabota'] : "",
    //             isset($data['RabotnoVreme']) ? $data['RabotnoVreme'] : "",
    //             isset($data['PauzaPocetok']) ? $data['PauzaPocetok'] : "",
    //             isset($data['PauzaKraj']) ? $data['PauzaKraj'] : "",
    //             isset($data['PauzaVreme']) ? $data['PauzaVreme'] : "",
    //             $data['RasporedID']
    //         ]);
        
    //         echo json_encode(["message" => "Record updated successfully"]);
    //         break;
        
    
    // case "DELETE":
    //     if (!isset($_GET['id'])) {
    //         echo json_encode(["error" => "ID is required"]);
    //         exit;
    //     }
    //     $id = intval($_GET['id']);
    //     $stmt = $conn->prepare("DELETE FROM raspored WHERE RasporedID = ?");
    //     $stmt->execute([$id]);
    //     echo json_encode(["message" => "Record deleted successfully"]);
    //     break;
    
    // default:
    //     echo json_encode(["error" => "Invalid request method"]);
    //     break;
}