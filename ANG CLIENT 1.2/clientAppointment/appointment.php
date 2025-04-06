<?php
include '../../Database/DBConnect.php';

data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
        echo json_encode(['error' => 'Invalid or missing JSON data.']);
        exit();
}

$response = [];  // Initialize response


// For Submission of the Appointments
if(isset($data[P_ID],$data[S_ID],$data[CDate],$data[CTime],$data[Sub],$data[QR])){
    $Patient = $conn->real_escape_string($data[P_ID]);
    $Services = $conn->real_escape_string($data[S_ID]);
    $Status = 1;
    $Date = $conn->real_escape_string($data[CDate]);
    $Time = $conn->real_escape_string($data[CTime]);
    $Sub = $conn->real_escape_string($data[Sub]);
    $QR = $conn->real_escape_string($data[QR]);

    $AppointmentQuery = "INSERT INTO 
    `appointment`(`PatientID`, `ServicesID`, `StatusID`, `APP_ChosenDate`, `APP_ChosenTime`, `APP_Submission`, `APP_QR`) 
    VALUES ()";

    if($conn->query($AppointmentQuery)){
        $AppID = $conn->insert_id; // Get the last inserted ID
    } else {
        //Input Error Handling Later
    }
} 

// For Getting all of the Services
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $Services_Avi = $conn->query("SELECT `ServiceID`, `SER_Name`, `SER_Details`, `SER_Duration` FROM `services`");
    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }

    echo json_encode($services);
}
?>