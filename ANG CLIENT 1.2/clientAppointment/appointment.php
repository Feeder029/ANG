<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

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

    if($action == 'getservices'){
        $Services_Avi = $conn->query("SELECT `ServiceID`, `SER_Name`, `SER_Details`, `SER_Duration` FROM `services`");
        return GET($conn,$Services_Avi); //Call A Global Function for  Displays
    } else if($action  == 'getunavailabletimeslots'){

        $Unavailabletime = $conn->query("SELECT 
    DATE_FORMAT(DateInfo, '%Y-%c-%e') AS FormattedDate,
    GROUP_CONCAT(
        CONCAT('`', SlotTime, '`') 
        ORDER BY TIME(SlotTime)
        SEPARATOR ', '
    ) AS TimeSlots
FROM (
    -- Booked appointment slots
    SELECT 
        a.App_ChosenDate AS DateInfo,
        DATE_FORMAT(ADDTIME(a.App_ChosenTime, SEC_TO_TIME(n.n * 3600)), '%l:%i %p') AS SlotTime
    FROM appointmentlist a
    JOIN patientlist b ON a.PatientID = b.PatientID
    JOIN (
        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
        SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
        SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS n
    WHERE n.n < TIME_TO_SEC(a.Total_Duration) / 3600
    AND (
        a.App_ChosenDate > CURDATE() OR
        (a.App_ChosenDate = CURDATE() AND a.App_ChosenTime >= CURTIME())
    )  AND a.STAT_Name LIKE 'Booked'
    
    UNION ALL
    
    -- Unavailable slots
    SELECT 
        u.US_Date AS DateInfo,
        DATE_FORMAT(ADDTIME(u.US_StartTime, SEC_TO_TIME(n.n * 3600)), '%l:%i %p') AS SlotTime
    FROM unavailableslots u
    JOIN (
        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
        SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
        SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) AS n
    WHERE ADDTIME(u.US_StartTime, SEC_TO_TIME(n.n * 3600)) < u.US_EndTime
    AND (
        u.US_Date > CURDATE() OR
        (u.US_Date = CURDATE() AND u.US_EndTime >= CURTIME())
    )
) AS combined_data
GROUP BY FormattedDate
ORDER BY DateInfo; 
    ");
    }

    return GET($conn,$Unavailabletime); //Call A Global Function for  Displays

}


$conn->close();
?>