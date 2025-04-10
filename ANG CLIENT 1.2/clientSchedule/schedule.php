<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$schedule = [];

$Sched_Query = $conn->query("SELECT `App_ChosenDate`, `App_ChosenTime`, `App_Submission`, `App_QR`, `AccountID`, `Ser_Name`, `Stat_Name`, `DisplayName` FROM `appointment_list` ORDER BY App_ChosenDate, App_ChosenTime");

// Check if query was successful
if (!$Sched_Query) {
    echo json_encode(['error' => "Error executing query: " . $conn->error]);
} else {
    while ($row = $Sched_Query->fetch_assoc()) { // Use $Sched_Query, not $Services_Avi
        $schedule[] = [
            "ACD" => $row['App_ChosenDate'],
            "ACT" => $row['App_ChosenTime'],
            "AS" => $row['App_Submission'],
            "ACC" => $row['AccountID'],
            "SN" => $row['Ser_Name'],
            "ST" => $row['Stat_Name'],
            "DN" => $row['DisplayName']
        ];
    }
    
    // Output the schedule array for GET requests
    echo json_encode($schedule);
}
?>
