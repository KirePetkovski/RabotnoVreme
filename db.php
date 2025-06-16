<?php

class DataBase
{
    private $servername;
    private $username;
    private $password;
    private $dbname;
    private $conn;
    //     $dbname = "if0_38659657_rabotnovremephp",
    //     $servername = "sql112.infinityfree.com",
    //     $username = "if0_38659657",
    //     $password = "e5C0VM2iV2OU"

    public function __construct(
        $dbname = "rabotnovremephp",
        $servername = "localhost",
        $username = "root",
        $password = ""
    ) {
        $this->dbname = $dbname;
        $this->servername = $servername;
        $this->username = $username;
        $this->password = $password;

        try {
            $this->conn = new PDO("mysql:host=$servername", $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
            $this->conn->exec($sql);

            $this->conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $this->createTables();
        } catch (PDOException $e) {
            $this->logError($e->getMessage());
            die("Database connection failed: " . $e->getMessage());
        }
    }

    private function createTables()
    {
        $tables = [
            "sektori" => "
                CREATE TABLE IF NOT EXISTS sektori (
                    SektorID INT AUTO_INCREMENT PRIMARY KEY,
                    SektorIme VARCHAR(100) NOT NULL,
                    Opis TEXT
                )",
            "vraboteni" => "
                CREATE TABLE IF NOT EXISTS vraboteni (
                    VrabotenID INT AUTO_INCREMENT PRIMARY KEY,
                    CardID INT,
                    ImePrezime VARCHAR(100) NOT NULL,
                    Nacionalnost VARCHAR(100),
                    Religija VARCHAR(100),
                    Aktiven BOOLEAN DEFAULT TRUE,
                    Zapocnal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    RasporedID INT,
                    SektorID INT,
                    FOREIGN KEY (SektorID) REFERENCES sektori(SektorID) ON DELETE SET NULL,
                    FOREIGN KEY (RasporedID) REFERENCES raspored(RasporedID) ON DELETE SET NULL
                )",
            "praznici" => "
                CREATE TABLE IF NOT EXISTS praznici (
                    PraznikID INT AUTO_INCREMENT PRIMARY KEY,
                    PraznikIme VARCHAR(100) NOT NULL,
                    Datum DATE NOT NULL UNIQUE,
                    TipPraznik VARCHAR(50)
                )",
            "prisustvo" => "
                CREATE TABLE IF NOT EXISTS prisustvo (
                    PrisustvoID INT AUTO_INCREMENT PRIMARY KEY,
                    TipAkcija ENUM('Vlez', 'Privaten_Izlez', 'Privaten_Vlez', 'Sluzben_Izlez', 'Sluzben_Vlez', 'Pauza_Izlez', 'Pauza_Vlez', 'Izlez') NOT NULL,
                    Vreme TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    VrabotenID INT,
                    CardID INT,
                    FOREIGN KEY (VrabotenID) REFERENCES vraboteni(VrabotenID) ON DELETE CASCADE,
                    FOREIGN KEY (CardID) REFERENCES vraboteni(CardID) ON DELETE CASCADE
                )",
            "korisnici" => "
                CREATE TABLE IF NOT EXISTS korisnici (
                    KorisnikID INT AUTO_INCREMENT PRIMARY KEY,
                    Lozinka VARCHAR(255) NOT NULL,
                    Uloga ENUM('Admin', 'Vraboten') NOT NULL,
                    Email VARCHAR(100) NOT NULL UNIQUE,
                    Aktiven BOOLEAN DEFAULT TRUE,
                    VrabotenID INT,
                    CardID INT,
                    FOREIGN KEY (VrabotenID) REFERENCES vraboteni(VrabotenID) ON DELETE CASCADE,
                    FOREIGN KEY (CardID) REFERENCES vraboteni(CardID) ON DELETE CASCADE
                )",
            "kontroleri" => "
                CREATE TABLE IF NOT EXISTS kontroleri (
                    KontrolerID INT AUTO_INCREMENT PRIMARY KEY,
                    IPAdress VARCHAR(50) NOT NULL UNIQUE,
                    Activen BOOLEAN DEFAULT TRUE,
                    Azuriran TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )",
            "raspored" => "
                CREATE TABLE IF NOT EXISTS raspored (
                    RasporedID INT AUTO_INCREMENT PRIMARY KEY,
                    RasporedIme VARCHAR(100),
                    Ponedelnik VARCHAR(50),
                    Vtornik VARCHAR(50),
                    Sreda VARCHAR(50),
                    Cetvrtok VARCHAR(50),
                    Petok VARCHAR(50),
                    Sabota VARCHAR(50),
                    RabotaVreme VARCHAR(50),
                    PauzaPocetok VARCHAR(50),
                    PauzaKraj VARCHAR(50),
                    PauzaVreme VARCHAR(50)
                )",
            "osustvo" => "
                CREATE TABLE IF NOT EXISTS osustvo (
                    OsustvoID INT AUTO_INCREMENT PRIMARY KEY,
                    OdDen DATE NOT NULL,
                    DoDen DATE NOT NULL,
                    Pricina TEXT NOT NULL,
                    Status TEXT,
                    VrabotenID INT,
                    CardID INT,
                    FOREIGN KEY (VrabotenID) REFERENCES vraboteni(VrabotenID) ON DELETE CASCADE,
                    FOREIGN KEY (CardID) REFERENCES vraboteni(CardID) ON DELETE CASCADE
                )",
            "izvestuvanje" => "
               CREATE TABLE IF NOT EXISTS izvestuvanje (
                    IzvestuvanjeID  INT AUTO_INCREMENT PRIMARY KEY,
                    CardID TEXT NOT NULL,
                    Sodrzina TEXT,
                    Datum Date NOT NULL,
                    PratenoOd TEXT NOT NULL
                )"
        ];

        try {
            foreach ($tables as $name => $sql) {
                $this->conn->exec($sql);
            }
        } catch (PDOException $e) {
            $this->logError($e->getMessage());
        }
    }

    private function logError($message)
    {
        file_put_contents('error_log.txt', date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
    }

    public function getConnection()
    {
        return $this->conn;
    }
}
