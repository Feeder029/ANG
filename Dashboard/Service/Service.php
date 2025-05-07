<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../../ANG CLIENT 1.2/clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}


$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $Services = $conn->query("SELECT `SER_ImagePath`,`ServiceID`, `SER_Name`, `SER_Details`,
    CASE
    -- When duration is less than 1 hour, just show minutes
    WHEN TIME_TO_SEC(SER_Duration) < 3600 THEN
        CONCAT(
            FLOOR(TIME_TO_SEC(SER_Duration) / 60), ' Minute',
            IF(FLOOR(TIME_TO_SEC(SER_Duration) / 60) <> 1, 's', '')
        )
    -- When duration has hours and potentially minutes
    ELSE
        CONCAT(
            FLOOR(TIME_TO_SEC(SER_Duration) / 3600), ' Hour',
            IF(FLOOR(TIME_TO_SEC(SER_Duration) / 3600) <> 1, 's', ''),
            IF(MOD(TIME_TO_SEC(SER_Duration) / 60, 60) > 0,
               CONCAT(' & ', FLOOR(MOD(TIME_TO_SEC(SER_Duration) / 60, 60)), ' Minute',
                      IF(FLOOR(MOD(TIME_TO_SEC(SER_Duration) / 60, 60)) <> 1, 's', '')),
               '')
        )
    END
    AS SER_Duration
    FROM `services`;");
    GET($conn,$Services);

}




?>