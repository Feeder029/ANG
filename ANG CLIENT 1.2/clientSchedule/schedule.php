<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$Sched_Query = $conn->query("SELECT  `ACC_Cookies`, `App_ChosenDate`, `App_ChosenTime`, `App_Submission`, `App_QR`, APP_QRPath, `AccountID`, `PatientID`, `AddressID`, `STAT_Name`, `Services`, `Descriptions`, `Total_Duration`  FROM `appointmentlist`  ORDER BY App_ChosenDate, App_ChosenTime");

GET($conn, $Sched_Query,"App_QR");

?>