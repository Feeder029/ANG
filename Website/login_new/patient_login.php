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

                    $response['login'] = ["status" => "success", "Acc" => $Account];
                } else {
                    $response['login'] = ["status" => "error", "message" => "Invalid credentials or inactive account."];
                }
            } else {
                $response['login'] = ["status" => "error", "message" => "Query execution failed: " . $stmt->error];
            }
        } else {
            $response['login'] = ["status" => "error", "message" => "Query preparation failed: " . $conn->error];
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
                $response['name'] = ['status' => 'success', 'message' => 'Name record inserted successfully'];
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
                    $response['name'] = ['status' => 'success', 'message' => 'Name record inserted successfully'];
                } else {
                    $response['name'] = ['status' => 'error', 'message' => 'Failed to insert name record: ' . $stmt->error];
                }
    
                $stmt->close();   
            } else {
                $response['name'] = ['status' => 'error', 'message' => 'Failed to prepare the SQL query: ' . $conn->error];
            }
    }
    

    // If neither login nor name data was provided
    if (empty($response)) {
        $response = ['status' => 'error', 'message' => 'No recognizable action. Missing login or name fields.'];
    }

    echo json_encode($response);
}

$conn->close();
?>
