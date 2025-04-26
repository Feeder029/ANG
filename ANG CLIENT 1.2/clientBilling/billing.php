<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';

if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $BillingQuery = $conn->query(
          " SELECT `BILL_Date`, b.PatientID, `Amount`, `Services`, `Payment`, a.`APP_ChosenDate`, a.`APP_ChosenTime`, a.`AppointmentID`, `STAT_Name`, `PM_Name`, `DisplayName` FROM `billinglist` a JOIN appointment b ON a.AppointmentID = b.AppointmentID; "        
        );
        
        GET($conn,$BillingQuery);

    }

?>