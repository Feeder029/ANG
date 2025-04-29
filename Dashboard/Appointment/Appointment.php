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

}



?>