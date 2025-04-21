<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$schedule = [];

$Sched_Query = $conn->query("SELECT `App_ChosenDate`, `App_ChosenTime`, `App_Submission`, `App_QR`, `AccountID`, `PatientID`, `AddressID`, `STAT_Name`, `Services`, `Descriptions`, `Total_Duration` FROM `appointmentlist`  ORDER BY App_ChosenDate, App_ChosenTime");

// Check if query was successful
if (!$Sched_Query) {
    echo json_encode(['error' => "Error executing query: " . $conn->error]);
} else {
    while ($row = $Sched_Query->fetch_assoc()) { // Use $Sched_Query, not $Services_Avi

        $QRImage = $row["App_QR"] ? base64_encode($row["App_QR"]) : null;

        $schedule[] = [
            "ACD" => $row['App_ChosenDate'],
            "ACT" => $row['App_ChosenTime'],
            "AS" => $row['App_Submission'],
            "ACC" => $row['AccountID'],
            "SN" => $row['Services'],
            "ST" => $row['STAT_Name'],
            "QR" => $QRImage
        ];
    }
    
    // Output the schedule array for GET requests
    echo json_encode($schedule);
}
?>
