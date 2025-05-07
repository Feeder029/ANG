<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../../ANG CLIENT 1.2/clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}


$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {


    if($action == 'getappointment'){
        $Sched_Query = $conn->query(
            "SELECT 
              a.AppointmentID,
              c.BillingID,
              b.DisplayName,
              b.ACC_Profile,
              b.ACC_Email,
              DATE_FORMAT(a.App_ChosenDate, '%M %d %Y') AS App_ChosenDate,
              DATE_FORMAT(a.App_ChosenTime, '%l:%i %p') AS App_ChosenTime,
              a.Services,
              UPPER(a.STAT_Name) AS STAT_Name,
              DATE_FORMAT(a.App_Submission, '%M %d %Y') AS SubmissionDate,
              DATE_FORMAT(a.App_Submission, '%l:%i %p') AS SubmissionTime
              FROM 
              `appointmentlist` a
              JOIN 
              `patientlist` b ON a.PatientID = b.PatientID
              LEFT JOIN 
              `billinglist` c ON a.AppointmentID = c.AppointmentID
              ORDER BY 
              CASE 
              WHEN DATE(a.App_ChosenDate) = CURDATE() THEN 0 
              WHEN DATE(a.App_ChosenDate) > CURDATE() THEN 1  
              ELSE 2                                           
              END,
              a.App_ChosenDate ASC,
              a.App_ChosenTime ASC; "        
            );
        
            GET($conn, $Sched_Query, "ACC_Profile");
    } else if($action == 'count'){
        $Count = $conn->query(
            " SELECT `STAT_Name`, COUNT(`STAT_Name`) AS `count`
              FROM `appointmentlist`
              GROUP BY `STAT_Name`

              UNION ALL

              SELECT 'ALL', COUNT(`STAT_Name`)
              FROM `appointmentlist`

              ORDER BY `STAT_Name`;       
            "        
            );
        
            GET($conn, $Count);
    }

} if($_SERVER['REQUEST_METHOD'] === 'POST'){

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);
  
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
?>