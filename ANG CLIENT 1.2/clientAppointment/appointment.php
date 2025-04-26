<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

// Initialize empty arrays
$response = [];
$services = [];

// Handle POST request for adding appointments
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['PatientID'], $data['APP_ChosenDate'], $data['APP_ChosenTime'])) {
        $patientId = $conn->real_escape_string($data['PatientID']);
        $chosenDate = $conn->real_escape_string($data['APP_ChosenDate']);
        $chosenTime = $conn->real_escape_string($data['APP_ChosenTime']);
        $status = 4;

        $insertData = [
            'PatientID' => $patientId,
            'StatusID' => $status,
            'APP_ChosenDate' => $chosenDate,
            'APP_ChosenTime' => $chosenTime
        ];
        
        $response = POST($conn, 'appointment', $insertData, 'id');
        echo json_encode($response);
        exit;
    } 
    else if(isset($data['AppointmentID'], $data['ServicesID'])) {
        $AID = $conn->real_escape_string($data['AppointmentID']);
        $SID = $conn->real_escape_string($data['ServicesID']);

        $insertData = [
            'AppointmentID' => $AID,
            'ServicesID' => $SID,
        ];
        
        $response = POST($conn, 'appointmentservices', $insertData, 'id');

        $response = ['AS' => $response]; 
        echo json_encode($response);
        exit; 
    } else {
        $response = ['AS' => ['status' => 'error', 'message' => 'Missing required data']];
        echo json_encode($response);
        exit;
    }
}
// Handle GET request for fetching services
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Services_Avi = $conn->query("SELECT `ServiceID`, `SER_Name`, `SER_Details`, `SER_Duration` FROM `services`");

    return GET($conn,$Services_Avi); //Call A Global Function for  Displays
}


$conn->close();
?>