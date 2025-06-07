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
    if (isset($_GET['stats']) && $_GET['stats'] == "true") {
        $stats = [];

        // Vkupno braboteni - zemeno od vraboteni
        $stmt = $conn->prepare("SELECT COUNT(DISTINCT VrabotenID) AS totalEmployees FROM vraboteni");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats["totalEmployees"] = $row["totalEmployees"];

        // Momentalno prisutni vraboteni
        $stmt = $conn->prepare("SELECT COUNT(DISTINCT VrabotenID) AS presentEmployees FROM prisustvo WHERE TipAkcija = 'Vlez' AND DATE(Vreme) = CURDATE()");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats["presentEmployees"] = $row["presentEmployees"];

        // Momentalno osutni Vraboteni
        $stats["absentEmployees"] = $stats["totalEmployees"] - $stats["presentEmployees"];

        // Momentalno privatno iskoceni
        $stmt = $conn->prepare("SELECT COUNT(*) AS totalPrivateExits FROM prisustvo WHERE TipAkcija = 'Privaten_Izlez' AND DATE(Vreme) = CURDATE()");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats["totalPrivateExits"] = $row["totalPrivateExits"];

        echo json_encode($stats);
        exit();
    } else {
        $stmt = $conn->prepare("SELECT * FROM prisustvo ORDER BY Vreme DESC");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        exit();
    }
}
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $cardID = $data["CardID"];
    $tipAkcija = $data["TipAkcija"];

    if ($tipAkcija === "Vlez") {
        // Determine the last exit action from the database
        $stmt = $conn->prepare("SELECT TipAkcija FROM prisustvo WHERE CardID = ? ORDER BY Vreme DESC LIMIT 1");
        $stmt->execute([$cardID]);
        $lastAction = $stmt->fetchColumn();

        if ($lastAction && str_ends_with($lastAction, "_Izlez")) {
            // Convert the exit action to the corresponding Vlez
            $tipAkcija = str_replace("_Izlez", "_Vlez", $lastAction);
        } else {
            // Default to generic Vlez if no previous exit found
            $tipAkcija = "Vlez";
        }
    }

    if ($tipAkcija === "Auto") {
        // Get the last action from TODAY (using CURDATE())
        $stmt = $conn->prepare("
            SELECT TipAkcija 
            FROM prisustvo 
            WHERE CardID = ? AND DATE(Vreme) = CURDATE() 
            ORDER BY Vreme DESC 
            LIMIT 1
        ");
        $stmt->execute([$cardID]);
        $lastAction = $stmt->fetchColumn();
    
        if (!$lastAction || str_ends_with($lastAction, "Izlez")) {
            // No action yet today or last action was Izlez
            $tipAkcija = "Vlez";
        } else {
            // Last action was Vlez
            $tipAkcija = "Izlez";
        }
    }
    
    // Now get the current timestamp
    $vreme = date("Y-m-d H:i:s");

    // Insert the record
    $stmt = $conn->prepare("INSERT INTO prisustvo (CardID, Vreme, TipAkcija) VALUES (?, ?, ?)");
    $stmt->execute([$cardID, $vreme, $tipAkcija]);

    echo json_encode(["message" => "Записот е успешно додаден!", "TipAkcija" => $tipAkcija]);
}

?>