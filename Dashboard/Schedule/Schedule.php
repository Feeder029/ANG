<?php

header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../../ANG CLIENT 1.2/clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$startdate = isset($_GET['startDate']) ? $_GET['startDate'] : '';
$enddate = isset($_GET['endDate']) ? $_GET['endDate'] : '';


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if($action == 'appointments'){
        $GetSchedule = $conn->query(
            "SELECT
                DATE_FORMAT(a.App_ChosenDate, '%d/%m/%Y') AS ChosenDate,
                DATE_FORMAT(a.App_ChosenTime, '%H:%i') AS ChosenTime,
                SEC_TO_TIME(TIME_TO_SEC(a.Total_Duration)) AS Total_Duration,
                b.DisplayName,
                -- Calculate EndTime and round up to next hour if needed
                DATE_FORMAT(
                    ADDTIME(
                        SEC_TO_TIME(
                            CEIL(
                                TIME_TO_SEC(
                                    ADDTIME(a.App_ChosenTime, a.Total_Duration)
                                ) / 3600
                            ) * 3600
                        ),
                        '00:00:00'
                    ),
                    '%H:%i'
                ) AS EndTime
            FROM appointmentlist a
            JOIN patientlist b ON a.PatientID = b.PatientID
            WHERE a.App_ChosenDate BETWEEN '$startdate' AND '$enddate';"
        );
    
        GET($conn, $GetSchedule);
    }  else if($action == 'closed'){

        $GetSchedule = $conn->query(
            "SELECT `US_Reason`, DATE_FORMAT(US_Date, '%d/%m/%Y') 
             AS ChosenDate, DATE_FORMAT(US_StartTime, '%H:%i') AS ChosenTime,
             DATE_FORMAT(US_EndTime, '%H:%i') AS EndTime FROM `unavailableslots`
             WHERE US_Date BETWEEN '$startdate' AND '$enddate'
             ;"
        );
    
        GET($conn, $GetSchedule);
    }
    
} else if($_SERVER['REQUEST_METHOD']==='POST'){

    if($_SERVER['REQUEST_METHOD'] === 'POST'){

        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        if($data && isset($data['Date'], $data['StartTime'], $data['EndTime'], $data['Reason'])){
            $Date = $conn->real_escape_string($data['Date']);
            $Start = $conn->real_escape_string($data['StartTime']);
            $End = $conn->real_escape_string($data['EndTime']);
            $Reason = $conn->real_escape_string($data['Reason']);
    
            $insertData = [
                'US_Date' => $Date,
                'US_StartTime' => $Start,
                'US_EndTime' => $End,
                'US_Reason' => $Reason
            ];
           
            $response = POST($conn, 'unavailableslots', $insertData, 'id');
            echo json_encode($response);
            exit;
        } else {
            // Return error for missing data
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing required fields'
            ]);
            exit;
        }
    }
}

?>


