<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';

// Check if connection is successful
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$services = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

$Services_Avi = $conn->query("SELECT `ServiceID`, `SER_Name`, `SER_Details`, `SER_Duration` FROM `services`");

// Check if query was successful
if (!$Services_Avi) {
    die("Error executing query: " . $conn->error);
}

while ($row = $Services_Avi->fetch_assoc()) {
    $services[] = [
        "S_ID" => $row['ServiceID'],
        "S_NAME" => $row['SER_Name']
    ];
}
}
echo json_encode($services); // Output as JSON
?>
