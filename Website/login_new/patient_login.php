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
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Missing required fields: USEREMAIL and PASS"
        ]);
        exit;
    }
}

$conn->close();
?>
