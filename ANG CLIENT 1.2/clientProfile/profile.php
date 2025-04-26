<?php
header('Content-Type: application/json');
include '../../Database/DBConnect.php';
require '../clientIndex/globalfunction.php';


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
    }
    
    else if (isset($data['Datas'], $data['ID'])) {
        $firstName = $conn->real_escape_string($data['Datas']['firstName']);
        $middleName = $conn->real_escape_string($data['Datas']['middleName']);
        $lastName = $conn->real_escape_string($data['Datas']['lastName']);
        $suffix = $conn->real_escape_string($data['Datas']['suffix']);
        $id = $conn->real_escape_string($data['ID']);  // fixed: consistent lowercase

        $email = $conn->real_escape_string($data['Datas']['email']);
        $facebookAccount = $conn->real_escape_string($data['Datas']['facebookAccount']);
        $contactNumber = $conn->real_escape_string($data['Datas']['contactNumber']);
        
        $gender = $conn->real_escape_string($data['Datas']['gender']);
        $age = $conn->real_escape_string($data['Datas']['age']);
        $dateOfBirth = $conn->real_escape_string($data['Datas']['dateOfBirth']);
        
        $street = $conn->real_escape_string($data['Datas']['street']);
        $barangay = $conn->real_escape_string($data['Datas']['barangay']);
        $city = $conn->real_escape_string($data['Datas']['city']);
        $province = $conn->real_escape_string($data['Datas']['province']);
        
    
    
        $namequery = "UPDATE `patientlist` 
            SET `N_FirstName` = ?, 
                `N_LastName` = ?, 
                `N_MiddleName` = ?, 
                `N_Suffix` = ?
            WHERE `PatientID` = ?";
    
        $nameparamTypes = "ssssi";
        $nameparams = [$firstName, $lastName, $middleName, $suffix, $id];

        $addressquery = "UPDATE `patientlist` 
            SET  `ADD_Street`= ?,
            `ADD_Barangay`= ?,
            `ADD_City`= ?,
            `ADD_Province`= ?            
            WHERE `PatientID` = ?";
    
        $addressTypes = "ssssi";
        $addressparams = [$street, $barangay, $city, $province,$id];
   
         $patientquery = "UPDATE `patientlist` 
            SET  `P_Gender`= ?,
            `P_DOB`= ?,
            `P_Age`= ?,
            `P_FacebookAccount`= ?,
            `P_ContactNo`= ?
            WHERE `PatientID` = ?";
    
        $patientparamTypes = "sssisi";
        $patientparams = [$gender, $dateOfBirth, $age, $facebookAccount, $contactNumber,$id];

        $emailquery = "UPDATE `patientlist` 
        SET  `ACC_Email` = ?
        WHERE `PatientID` = ?";

       $emailparamTypes = "si";
       $emailparams = [$email,$id];
   
        if (Statement($conn, $namequery, $nameparamTypes, $nameparams)&&Statement($conn, $addressquery, $addressTypes, $addressparams)&&Statement($conn, $patientquery, $patientparamTypes, $patientparams)&&Statement($conn,$emailquery,$emailparamTypes,$emailparams)) {
            echo json_encode([
                "status" => "Success",
                "message" => "It went through successfully."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Query failed. Check server logs for more details."
            ]);
        }
    }
    
    else{
        echo json_encode([
                "status" => "error",
                "message" => "Query preparation failed: " . $conn->error
        ]);

    }
    exit;
}

function Statement($conn, $query, $paramTypes, $params) {
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        echo "Prepare failed: " . $conn->error;
        return false;
    }

    // Dynamically bind parameters
    $stmt->bind_param($paramTypes, ...$params);

    if (!$stmt->execute()) {
        echo "Execute failed: " . $stmt->error;
        $stmt->close();
        return false;
    }

    $stmt->close();
    return true;
}

?>