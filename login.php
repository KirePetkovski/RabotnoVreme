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


if ($method === "POST"){
    $input = json_decode(file_get_contents("php://input"), true);
    $Email = $input['Email'];
    $Lozinka = $input["Lozinka"];
    $hashedPassword = password_hash($input["Lozinka"], PASSWORD_DEFAULT);

    if ($Email && $Lozinka) {
        try {
            $stmt = $conn->prepare("SELECT * FROM korisnici WHERE Email = ? AND Lozinka = ?");
            $stmt->execute([$Email, $Lozinka]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($data) {
                $data['success'] = true;

                $CardID = $data['CardID'];
                $stmt = $conn->prepare("SELECT * FROM vraboteni WHERE CardID = ?");
                $stmt->execute([$CardID]);
                $najaven = $stmt->fetch(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'data' => $data,
                    'najaven' => $najaven
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Погрешен емаил или лозинка']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Грешка при поврзување со базата']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Недостаток на податоци']);
    }
}

?>