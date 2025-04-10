<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

// Initialize empty arrays
$response = [];
$services = [];

// Handle POST request for adding appointments
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode the JSON data from the request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['PatientID'], $data['ServicesID'], $data['APP_ChosenDate'], $data['APP_ChosenTime'])) {
        $PID = $conn->real_escape_string($data['PatientID']);
        $SID = $conn->real_escape_string($data['ServicesID']);
        $ACD = $conn->real_escape_string($data['APP_ChosenDate']);
        $ACT = $conn->real_escape_string($data['APP_ChosenTime']);
        $Status = 3;

        $stmt = $conn->prepare("INSERT INTO `appointment` (`PatientID`, `ServicesID`, `StatusID`, `APP_ChosenDate`, `APP_ChosenTime`) VALUES (?, ?, ?, ?, ?)");
        
        if ($stmt) {
            $stmt->bind_param("iiiss", $PID, $SID, $Status, $ACD, $ACT);

            if ($stmt->execute()) {
                $response['appointment'] = ['status' => 'success', 'message' => 'Appointment record inserted successfully'];
            } else {
                $response['appointment'] = ['status' => 'error', 'message' => 'Failed to insert appointment record: ' . $stmt->error];
            }

            $stmt->close();
        } else {
            $response['appointment'] = ['status' => 'error', 'message' => 'Failed to prepare the SQL query: ' . $conn->error];
        }
    } else {
        $response['appointment'] = ['status' => 'error', 'message' => 'Missing required data'];
    }
    
    // Return the appointment response for POST requests
    echo json_encode($response);
}
// Handle GET request for fetching services
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Services_Avi = $conn->query("SELECT `ServiceID`, `SER_Name`, `SER_Details`, `SER_Duration` FROM `services`");

    // Check if query was successful
    if (!$Services_Avi) {
        echo json_encode(['error' => "Error executing query: " . $conn->error]);
    } else {
        while ($row = $Services_Avi->fetch_assoc()) {
            $services[] = [
                "S_ID" => $row['ServiceID'],
                "S_NAME" => $row['SER_Name']
            ];
        }
        
        // Output the services array for GET requests
        echo json_encode($services);
    }
}

$conn->close();
?>