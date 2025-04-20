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
    if(isset($_GET["CardID"])) {
        $stmt = $conn->prepare("SELECT * FROM korisnici WHERE CardID = ?");
$stmt->execute([$_GET["CardID"]]);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
 if ($data){
            $data['prodolzi'] = false;
        }else{
        $data['prodolzi'] = true;
        }

    }else{
        $stmt = $conn->query("SELECT * FROM korisnici");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($data);
    exit;
}
if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
  //  if($data["action"] == "update"){
        try{
            $stmt = $conn->prepare("UPDATE korisnici SET Lozinka = ? WHERE VrabotenID = ?");
            $hashedPassword = password_hash($data["Lozinka"], PASSWORD_DEFAULT);
            $stmt->execute([$hashedPassword, $data["VrabotenID"]]);
            
            echo json_encode(["message" => "Kontroler updated successfully"]);

        }catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
  //  }
}

?>