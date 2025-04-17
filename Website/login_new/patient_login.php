<?php
header('Content-Type: application/json');
include '../../Database/DBConnect.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$Account = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $response = [];

    // ✅ LOGIN HANDLER
    if (isset($data['USEREMAIL'], $data['PASS'])) {
        $UserOrEmail = $conn->real_escape_string($data['USEREMAIL']);
        $Password = $conn->real_escape_string($data['PASS']);

        $stmt = $conn->prepare("SELECT * FROM account 
            WHERE StatusID = 1 AND UserTypeID = 1  
            AND ACC_Password = ?
            AND (ACC_Username = ? OR ACC_Email = ?)
        ");

        if ($stmt) {
            $stmt->bind_param("sss", $Password, $UserOrEmail, $UserOrEmail);
            if ($stmt->execute()) {
                $result = $stmt->get_result();

                if ($result->num_rows === 1) {
                    $row = $result->fetch_assoc();

                    $Account = [
                        "Username" => $row["ACC_Username"],
                        "Password" => $row["ACC_Password"],
                        "Status" => $row["StatusID"],
                        "UserTypeID" => $row["UserTypeID"],
                        "Email" => $row["ACC_Email"],
                        "AccID" => $row["AccountID"]
                    ];

                    echo json_encode([
                        "status" => "success",
                        "Acc" => $Account
                    ]);
                    exit; // Stop further execution
                } else {
                    echo json_encode([
                        "status" => "error",
                        "message" => "Invalid credentials or inactive account."
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

    // ✅ NAME INSERT HANDLER
    if (isset($data['FN'], $data['LN'], $data['MN'], $data['SFX'])) {
        $First = $conn->real_escape_string($data['FN']);
        $Last = $conn->real_escape_string($data['LN']);
        $Middle = $conn->real_escape_string($data['MN']);
        $SFX = $conn->real_escape_string($data['SFX']);

        $stmt = $conn->prepare("INSERT INTO `name`(`N_FirstName`, `N_LastName`, `N_MiddleName`, `N_Suffix`) VALUES (?,?,?,?)");

        if ($stmt) {
            $stmt->bind_param("ssss", $First, $Last, $Middle, $SFX);   

            if ($stmt->execute()) {
                // Get the auto-increment ID (primary key)
                $nameID = $conn->insert_id;
                $response['name'] = [
                    'status' => 'success', 
                    'message' => 'Name record inserted successfully',
                    'nameID' => $nameID
                ];
            } else {
                $response['name'] = ['status' => 'error', 'message' => 'Failed to insert name record: ' . $stmt->error];
            }

            $stmt->close();   
        } else {
            $response['name'] = ['status' => 'error', 'message' => 'Failed to prepare the SQL query: ' . $conn->error];
        }
    }

    // ✅ ADDRESS INSERT HANDLER
    if (isset($data['HNo'], $data['LNo'], $data['Str'], $data['Brgy'], $data['Cit'], $data['Prov'])) {
        $House = $conn->real_escape_string($data['HNo']);
        $Lot = $conn->real_escape_string($data['LNo']);
        $Street = $conn->real_escape_string($data['Str']);
        $Barangay = $conn->real_escape_string($data['Brgy']);
        $City = $conn->real_escape_string($data['Cit']);
        $Province = $conn->real_escape_string($data['Prov']);

        $stmt = $conn->prepare("INSERT INTO `address`(`ADD_HouseNo`, `ADD_LotNo`, `ADD_Street`, `ADD_Barangay`, `ADD_City`, `ADD_Province`)  VALUES (?,?,?,?,?,?)");

        if ($stmt) {
            $stmt->bind_param("ssssss", $House, $Lot, $Street, $Barangay, $City, $Province);   

            if ($stmt->execute()) {
                $AddressID = $conn->insert_id;
                $response['Address'] = [
                    'status' => 'success', 
                    'message' => 'Address record inserted successfully',
                    'AddressID' => $AddressID
                ];    
            } else {
                $response['Address'] = ['status' => 'error', 'message' => 'Failed to insert name record: ' . $stmt->error];
            }

            $stmt->close();   
        } else {
            $response['Address'] = ['status' => 'error', 'message' => 'Failed to prepare the SQL query: ' . $conn->error];
        }
    }

    // ✅ ACCOUNT INSERT HANDLER
    if (isset($data['SID'], $data['UID'], $data['User'], $data['Pass'], $data['Email'])) {
        $sid = $conn->real_escape_string($data['SID']);
        $uid = $conn->real_escape_string($data['UID']);
        $username = $conn->real_escape_string($data['User']);
        $password = $conn->real_escape_string($data['Pass']);
        $email = $conn->real_escape_string($data['Email']);
        
        // Handle profile image (can be null)
        $profile = null;
        if (isset($data['Profile']) && !empty($data['Profile'])) {
            // Convert Base64 back to binary for LONGBLOB storage
            $profile = base64_decode($data['Profile']);
        }
        
        // Use prepared statement to insert account with profile image
        $stmt = $conn->prepare("INSERT INTO account (`StatusID`, `UserTypeID`, `ACC_Username`, `ACC_Password`, `ACC_Email`, `ACC_Profile`) VALUES (?, ?, ?, ?, ?, ?)");
        
        if ($stmt) {
            // Using "b" parameter type for BLOB data
            $stmt->bind_param("iissss", $sid, $uid, $username, $password, $email, $profile);
            
            if ($stmt->execute()) {
                $accountID = $stmt->insert_id;
                echo json_encode([
                    "account" => [
                        "status" => "success",
                        "accountID" => $accountID
                    ]
                ]);
            } else {
                echo json_encode([
                    "account" => [
                        "status" => "error",
                        "message" => "Failed to insert account: " . $stmt->error
                    ]
                ]);
            }
            $stmt->close();
        } else {
            echo json_encode([
                "account" => [
                    "status" => "error",
                    "message" => "Query preparation failed: " . $conn->error
                ]
            ]);
        }
        exit;
    }

    // ✅ PATIENT INSERT HANDLER
    if (isset($data['NID'],$data['AddID'],$data['ACCID'],$data['Gen'],$data['DOB'],$data['Age'],$data['FB'],$data['CN'])){

        $Name = $conn->real_escape_string($data['NID']);
        $Address = $conn->real_escape_string($data['AddID']);
        $Account = $conn->real_escape_string($data['ACCID']);
        $Gender = $conn->real_escape_string($data['Gen']);
        $Birth = $conn->real_escape_string($data['DOB']);
        $Age = $conn->real_escape_string($data['Age']);
        $Facebook = $conn->real_escape_string($data['FB']);
        $Contact = $conn->real_escape_string($data['CN']);

        $stmt = $conn->prepare("INSERT INTO `patient`(`NameID`, `AddressID`, `AccountID`, `P_Gender`, `P_DOB`, `P_Age`, `P_FacebookAccount`, `P_ContactNo`) 
        VALUES (?,?,?,?,?,?,?,?)");

        if ($stmt) {
            // Using "b" parameter type for BLOB data
            $stmt->bind_param("iiississ", $Name, $Address, $Account, $Gender, $Birth, $Age, $Facebook, $Contact);
            
            if ($stmt->execute()) {
                $response['patient'] = ['status' => 'success', 'message' => 'Patient record inserted successfully: '];
            } else {
                $response['patient'] = ['status' => 'error', 'message' => 'Failed to insert name record: ' . $stmt->error];
            }
        } else {
            $response = ['status' => 'error', 'message' => 'No recognizable action. Missing login or name fields.'];
        }

    }

    // If no recognized action was processed
    if (empty($response)) {
        $response = ['status' => 'error', 'message' => 'No recognizable action. Missing login or name fields.'];
    }

    echo json_encode($response);
}

$conn->close();
?>