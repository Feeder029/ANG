<?php
header('Content-Type: application/json');
include '../../Database/DBConnect.php'; // Adjust path as needed

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['email'], $data['username'], $data['password'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing fields']);
        exit;
    }

    $email = $conn->real_escape_string($data['email']);
    $username = $conn->real_escape_string($data['username']);
    $password = $conn->real_escape_string($data['password']);

    // Optional: check if user/email already exists
    $check = $conn->prepare("SELECT * FROM account WHERE ACC_Email = ? OR ACC_Username = ?");
    $check->bind_param("ss", $email, $username);
    $check->execute();
    $res = $check->get_result();
    if ($res->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email or Username already exists']);
        exit;
    }

    // Insert new account
    $stmt = $conn->prepare("INSERT INTO account (ACC_Email, ACC_Username, ACC_Password, StatusID, UserTypeID) VALUES (?, ?, ?, 1, 1)");
    $stmt->bind_param("sss", $email, $username, $password);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
