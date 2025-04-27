<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['AppointmentID']) && isset($data['StatusID'])) {
        $appID = intval($data['AppointmentID']);
        $statusID = intval($data['StatusID']);
        
        $stmt = $conn->prepare("UPDATE `appointment` SET `StatusID` = ? WHERE `AppointmentID` = ?");
        $stmt->bind_param("ii", $statusID, $appID);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Appointment status updated successfully']);
        } else {
            echo json_encode(['error' => 'Failed to update appointment status: ' . $conn->error]);
        }
        
        $stmt->close();
        exit;
    } else {
        echo json_encode(['error' => 'Missing required parameters']);
        exit;
    }
}

if ($action == 'schedules') {

    $Sched_Query = $conn->query("SELECT `AppointmentID`, `ACC_Cookies`, `App_ChosenDate`, `App_ChosenTime`, `App_Submission`, `App_QR`, APP_QRPath, `AccountID`, `PatientID`, `AddressID`, `STAT_Name`, `Services`, `Descriptions`, `Total_Duration`  FROM `appointmentlist` ORDER BY App_ChosenDate DESC, App_ChosenTime DESC");

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