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

                    // Convert binary profile data to base64 if it exists
                    $profileData = $row["ACC_Profile"] ? base64_encode($row["ACC_Profile"]) : null;

                    // Store all retrieved data in the Patient array
                    $Patient = [
                        "PatientID" => $row["PatientID"],
                        "DisplayName" => $row["DisplayName"],
                        "LastName" => $row["N_LastName"],
                        "MiddleName" => $row["N_MiddleName"],
                        "Suffix" => $row["N_Suffix"],
                        "FirstName" => $row["N_FirstName"],
                        "Street" => $row["ADD_Street"],
                        "Barangay" => $row["ADD_Barangay"],
                        "City" => $row["ADD_City"],
                        "Province" => $row["ADD_Province"],
                        "Gender" => $row["P_Gender"],
                        "DOB" => $row["P_DOB"],
                        "Age" => $row["P_Age"],
                        "FacebookAccount" => $row["P_FacebookAccount"],
                        "ContactNo" => $row["P_ContactNo"],
                        "Username" => $row["ACC_Username"],
                        "Password" => $row["ACC_Password"], // Note: Consider if you really want to expose the password in the response
                        "Email" => $row["ACC_Email"],
                        "DateCreated" => $row["ACC_DateCreated"],
                        "Profile" => $profileData
                    ];
                    
                    echo json_encode(['status' => 'success', 'message' => 'Patient data retrieved successfully', "Patient" => $Patient]);
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
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "PatientID is required"
        ]);
        exit;
    }
}
?>