<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../../ANG CLIENT 1.2/clientIndex/globalfunction.php';

if (!$conn) {
    die(json_encode(['error' => "Connection f  ailed: " . mysqli_connect_error()]));
}


$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if($action == 'getbilling'){
        $BillingQuery = $conn->query(
            " SELECT a.*, b.ACC_Email, b.ACC_Profile FROM `billinglist` a
              JOIN appointmentlist c ON a.AppointmentID = c.AppointmentID
              JOIN account b ON c.AccountID = b.AccountID;        
            "        
          );
          
          GET($conn,$BillingQuery,"ACC_Profile");
    } else if($action == 'count'){
        $Count = $conn->query(
            " SELECT `STAT_Name`, COUNT(`STAT_Name`) AS `count`
              FROM `billinglist`
              GROUP BY `STAT_Name`

              UNION ALL

              SELECT 'ALL', COUNT(`STAT_Name`)
              FROM `billinglist`

              ORDER BY `STAT_Name`;       
            "        
            );
        
            GET($conn, $Count);
    }

    }

?>