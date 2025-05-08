<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../../ANG CLIENT 1.2/clientIndex/globalfunction.php';

if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
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

} else if ($_SERVER['REQUEST_METHOD'] === 'POST'){

  $json = file_get_contents('php://input');
  $data = json_decode($json, true);
  
  // Handle update action
  if(isset($data['action']) && $data['action'] === 'update' && isset($data['BillingID'])) {
    $BillingID = $conn->real_escape_string($data['BillingID']);
    $StatusID = $conn->real_escape_string($data['StatusID']);
    $PaymentMethodID = $conn->real_escape_string($data['PaymentMethodID']);
    $BillingDate = $conn->real_escape_string($data['BillingDate']);
    $Amount = $conn->real_escape_string($data['Amount']);
    $Payment = $conn->real_escape_string($data['Payment']);
    
    // Create update query
    $updateQuery = "UPDATE `blling` SET 
                    `PaymentMethodID` = '$PaymentMethodID', 
                    `StatusID` = '$StatusID',
                    `BILL_Date` = " . ($BillingDate ? "'$BillingDate'" : "NULL") . ",
                    `Amount` = '$Amount',
                    `Payment` = " . ($Payment ? "'$Payment'" : "NULL") . "
                    WHERE `BillingID` = '$BillingID'";
    
    if($conn->query($updateQuery)) {
      $response = ['status' => 'success', 'message' => 'Billing record updated successfully'];
    } else {
      $response = ['status' => 'error', 'message' => 'Failed to update billing record: ' . $conn->error];
    }
    
    echo json_encode($response);
    exit;
  }
  // Handle regular insert
  else if(isset($data['AppointmentID'], $data['StatusID'], $data['PaymentMethodID'])) {
    $AppID = $conn->real_escape_string($data['AppointmentID']);
    $StatusID = $conn->real_escape_string($data['StatusID']);
    $PaymentMethodID = $conn->real_escape_string($data['PaymentMethodID']);
    $BillingDate = $conn->real_escape_string($data['BillingDate']);
    $Amount = $conn->real_escape_string($data['Amount']);
    $Payment = $conn->real_escape_string($data['Payment']);

    $insertData = [
      'AppointmentID' => $AppID,
      'PaymentMethodID' => $PaymentMethodID,
      'StatusID' => $StatusID,
      'BILL_Date' => $BillingDate,
      'Amount' => $Amount, 
      'Payment' => $Payment
    ];
  
    $response = POST($conn, 'blling', $insertData, 'id');
    echo json_encode($response);
    exit;
  } else {
    $response = ['status' => 'error', 'message' => 'Missing required data'];
    echo json_encode($response);
    exit;
  }
}
?>