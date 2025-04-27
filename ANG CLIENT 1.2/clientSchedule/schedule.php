<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'schedules') {

    $Sched_Query = $conn->query("SELECT  `ACC_Cookies`, `App_ChosenDate`, `App_ChosenTime`, `App_Submission`, `App_QR`, APP_QRPath, `AccountID`, `PatientID`, `AddressID`, `STAT_Name`, `Services`, `Descriptions`, `Total_Duration`  FROM `appointmentlist` ORDER BY App_ChosenDate, App_ChosenTime");

    GET($conn, $Sched_Query,"App_QR");
    
}  else if ($action == 'count') {

    $Count = $conn->query("SELECT 
    STAT_Name,
    COUNT(*) AS Stat_Count
    FROM 
     appointmentlist
    GROUP BY 
     STAT_Name

    UNION ALL

    SELECT 
     'All' AS STAT_Name,
      COUNT(*) AS Stat_Count
    FROM 
     appointmentlist;
");

    GET($conn, $Count);
}

?>