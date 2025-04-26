<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';

if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $BillingQuery = $conn->query(
            "SELECT `Services`,`BILL_Date`, `Amount`, `Payment`, `APP_ChosenDate`, `APP_ChosenTime`, `AppointmentID`, `STAT_Name`, `PM_Name`, `DisplayName` FROM `billinglist`"
        );
        
        GET($conn,$BillingQuery);

    }

?>