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



    if ($method === "GET"){
        if (isset($_GET['id'])) {
            $stmt = $conn->prepare("SELECT * FROM osustvo WHERE OsustvoID = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $stmt = $conn->query("SELECT * FROM osustvo");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    }

    if ($method === "POST"){
            $data = json_decode(file_get_contents("php://input"), true);
        
            if (!isset($data['action'])) {
                echo json_encode(['error' => 'Недостасува action параметар.']);
                http_response_code(400);
                
            }
        
            if ($data['action'] === "update") {
                if (!isset($data['Status'], $data['OsustvoID'])) {
                    echo json_encode(['error' => 'Недостасуваат полиња за ажурирање.']);
                    http_response_code(400);
                
                }
        
                $stmt = $conn->prepare("UPDATE osustvo SET Status = ? WHERE OsustvoID = ?");
                $stmt->execute([$data['Status'], $data['OsustvoID']]);
                echo json_encode(["message" => "Статусот е ажуриран."]);
            
            } 
            if ($data['action'] === 'delete') {
                // if (!isset($data['OsustvoID'])) {
                //     echo json_encode(['error' => 'Недостасува OsustvoID за бришење.']);
                //     http_response_code(400);
                //     break;
                // }
        
                $stmt = $conn->prepare("DELETE FROM osustvo WHERE OsustvoID = ?");
                $stmt->execute([$data['OsustvoID']]);
                echo json_encode(['message' => 'Осуството е успешно избришано.']);
        
            } 
            if ($data['action'] === 'create') {
                // if (!isset($data['OdDen'], $data['DoDen'], $data['Pricina'], $data['VrabotenID'], $data['CardID'])) {
                //     echo json_encode(['error' => 'Недостасуваат полиња за креирање.']);
                //     http_response_code(400);
                //     break;
                // }
        
                $stmt = $conn->prepare("INSERT INTO osustvo (OdDen, DoDen, Pricina, VrabotenID, CardID) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['OdDen'],
                    $data['DoDen'],
                    $data['Pricina'],
                    $data['VrabotenID'],
                    $data['CardID'],
                ]);
                http_response_code(201);
                echo json_encode(['message' => 'Осуството е додадено.']);
            } 
        }
    
        

?>