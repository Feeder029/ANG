<?php
// Start output buffering
ob_start();

// Include database connection
require_once('../../Config/dbconnection.php'); // Make sure this path is correct

// Call and Use all of the important files
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require('../../Extensions/PHPMailer-master/src/Exception.php');
require('../../Extensions/PHPMailer-master/src/PHPMailer.php');
require('../../Extensions/PHPMailer-master/src/SMTP.php');

// Set content type header for JSON responses
header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Send Messages to Client's Account
if (isset($data["email"])) {
    
    // Check database connection
    if (!isset($conn) || $conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }
    
    $email = $conn->real_escape_string($data['email']);
    $name = isset($data['name']) ? $conn->real_escape_string($data['name']) : 'Patient';

    try {
        $mail = new PHPMailer(true);

        // Initialize all of the Account Details
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'systemdev.3rdyear@gmail.com';
        $mail->Password = 'cznyuirgsdpfybzb';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Recipients
        $mail->setFrom('systemdev.3rdyear@gmail.com', 'ANG CLINIC');
        $mail->addAddress($email, $name); 
        $mail->addReplyTo('systemdev.3rdyear@gmail.com', 'ANG CLINIC');  

        // Content
        $mail->isHTML(true);
        $mail->Subject = "REMINDER OF YOUR APPOINTMENT";
        
        // More detailed email body
        $mail->Body = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { padding: 20px; }
                .header { color: #4A90E2; font-size: 24px; }
                .content { margin: 20px 0; }
                .footer { font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>Appointment Reminder</div>
                <div class='content'>
                    <p>Dear {$name},</p>
                    <p>This is a friendly reminder that you have an appointment scheduled for tomorrow at ANG CLINIC.</p>
                    <p>If you need to reschedule, please contact us as soon as possible.</p>
                    <p>Thank you for choosing our services!</p>
                </div>
                <div class='footer'>
                    <p>ANG CLINIC</p>
                    <p>For inquiries, please call: [Your Clinic Phone Number]</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        // Plain text version for email clients that don't support HTML
        $mail->AltBody = "Dear {$name}, This is a friendly reminder that you have an appointment scheduled for tomorrow at ANG CLINIC. If you need to reschedule, please contact us as soon as possible. Thank you for choosing our services!";

        // Send the email
        if ($mail->send()) {
            echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send email']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $mail->ErrorInfo]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
}

// Flush the output
ob_end_flush();
?>