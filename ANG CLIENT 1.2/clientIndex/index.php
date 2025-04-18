<?php
header('Content-Type: application/json');
include '../../Database/DBConnect.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);
    $response = [];

    if (isset($data['PatientID'])) {
        $PID = $conn->real_escape_string($data['PatientID']);

        $stmt = $conn->prepare("SELECT `PatientID`, `DisplayName`, `N_LastName`, `N_MiddleName`, `N_Suffix`, `N_FirstName`, `ADD_Street`, `ADD_Barangay`, `ADD_City`, `ADD_Province`, `P_Gender`, `P_DOB`, `P_Age`, `P_FacebookAccount`, `P_ContactNo`, `ACC_Username`, `ACC_Password`, `ACC_Email`, `ACC_DateCreated`, `ACC_Profile` 
        FROM `patientlist`
        WHERE PatientID = ?");

        if($stmt){
            $stmt->bind_param("i", $PID);
            
            if($stmt->execute()){
                $result = $stmt->get_result();
                
                if ($result->num_rows === 1) {
                    $row = $result->fetch_assoc();

                    $profileData = $row["ACC_Profile"] ? base64_encode($row["ACC_Profile"]) : null;

                    $Patient = [
                        "Username" => $row["ACC_Username"],
                        "Name" => $row["DisplayName"],
                        "Profile" => $profileData
                    ];
                    
                    echo json_encode(['status' => 'success', 'message' => 'PHP is working!',"Patient"=>$Patient]);
                    exit;
                } else {
                    echo json_encode([
                        "status" => "error",
                        "message" => "No Patient found with ID: " . $PID
                    ]);
                    exit;
                }
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Query execution failed: " . $stmt->error
                ]);
                exit;
            }
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Query preparation failed: " . $conn->error
            ]);
            exit;
        }
        }
}
?>