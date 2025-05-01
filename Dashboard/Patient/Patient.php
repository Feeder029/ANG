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


    if($action == 'getpatient'){

        $Patient = $conn->query(
        "SELECT 
         `PatientID`, 
         `AccountID`,
         `DisplayName`, 
         CONCAT_WS(' ', `ADD_Street`, `ADD_Barangay`, `ADD_City`, `ADD_Province`) AS FullAddress,
         `P_Gender`,  
         `P_ContactNo`,
         `ACC_Username`, 
         `ACC_Email`, 
          DATE_FORMAT(ACC_DateCreated, '%M %d %Y') AS ACC_DateCreated,
         `ACC_Profile`, 
         UPPER(STAT_Name) AS STAT_Name
         FROM 
         `patientlist`
         ORDER BY 
         CASE UPPER(`STAT_Name`)
          WHEN 'PENDING' THEN 1
          WHEN 'ACTIVE' THEN 2
          WHEN 'INACTIVE' THEN 3
          ELSE 4
          END,
         `ACC_DateCreated` DESC;
        ")
        
        ;

        GET($conn, $Patient, "ACC_Profile");
    } else if($action == 'count'){
        $Count = $conn->query(
            " SELECT `STAT_Name`, COUNT(`STAT_Name`) AS `count`
              FROM `patientlist`
              GROUP BY `STAT_Name`

              UNION ALL

              SELECT 'ALL', COUNT(`STAT_Name`)
              FROM `patientlist`

              ORDER BY `STAT_Name`;       
            "        
            );
        
            GET($conn, $Count);
    }

} else if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (isset($data['AccountID']) && isset($data['StatusID'])) {
        $AccID = intval($data['AccountID']);
        $statusID = intval($data['StatusID']);
        
        $stmt = $conn->prepare("UPDATE `account` SET `StatusID` = ? WHERE `AccountID` = ?");
        $stmt->bind_param("ii", $statusID, $AccID);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Appointment status updated successfully']);
        } else {
            echo json_encode(['error' => 'Failed to update appointment status: ' . $conn->error]);
        }
        
        $stmt->close();
        exit;
    } else  {
        echo json_encode(['error' => 'Failed to update appointment status: ' . $conn->error]);
    }

}



?>