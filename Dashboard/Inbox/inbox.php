<?php
// Start output buffering
ob_start();

// Call and Use all of the important files
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require('../../Extensions/PHPMailer-master/src/Exception.php');
require('../../Extensions/PHPMailer-master/src/PHPMailer.php');
require('../../Extensions/PHPMailer-master/src/SMTP.php');

// Get POST data for emails
$data = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Send Messages to Client's Account
if ($action == 'sendemail') {
    // Set header to JSON
    header('Content-Type: application/json');
    
    try {
        $mail = new PHPMailer(true);

        // Initialize all of the Account Details
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'systemdev.3rdyear@gmail.com';
        $mail->Password = 'cznyuirgsdpfybzb'; // Consider using environment variables for credentials
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Recipients
        $mail->setFrom('systemdev.3rdyear@gmail.com', "ANG CLINIC");
        
        // Use the email from POST data if available
        $mail->addAddress($data['email']);
        
        $mail->addReplyTo('systemdev.3rdyear@gmail.com', "ANG CLINIC");

        // Content
        $mail->isHTML(true);
        $mail->Subject = "Appointment Reminder";
        
        // Correctly extract values from the data array
        $name = isset($data['name']) ? $data['name'] : 'Patient';
        $date = isset($data['date']) ? $data['date'] : 'your scheduled date';
        $time = isset($data['time']) ? $data['time'] : 'your scheduled time';
        $service = isset($data['service']) ? $data['service'] : 'your scheduled service';

        // Create a more professional email body
        $mail->Body = "
        <html>
        <head>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <title>Appointment Reminder</title>
        </head>
        <body style=\"margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6;\">
            <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"background-color: #f5f5f5; padding: 20px;\">
                <tr>
                    <td align=\"center\">
                        <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"600\" style=\"background-color: #ffffff; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;\">
                            <!-- Header -->
                            <tr>
                                <td style=\"background-color: #0056b3; padding: 25px 30px; text-align: center;\">
                                    <h1 style=\"color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;\">ANG CLINIC</h1>
                                </td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style=\"padding: 30px 40px;\">
                                    <h2 style=\"color: #0056b3; margin-top: 0; margin-bottom: 20px; font-size: 24px;\">Appointment Reminder</h2>
                                    
                                    <p style=\"margin-bottom: 20px; font-size: 16px;\">Dear <strong>{$name}</strong>,</p>
                                    
                                    <p style=\"margin-bottom: 20px; font-size: 16px;\">This is a friendly reminder about your upcoming appointment on <strong>{$date}</strong>.</p>
                                    
                                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"background-color: #f9f9f9; border-left: 4px solid #0056b3; margin: 25px 0; border-radius: 4px;\">
                                        <tr>
                                            <td style=\"padding: 20px;\">
                                                <p style=\"margin: 0 0 10px 0; font-size: 16px;\"><strong style=\"color: #0056b3;\">Time:</strong> {$time}</p>
                                                <p style=\"margin: 0; font-size: 16px;\"><strong style=\"color: #0056b3;\">Service:</strong> {$service}</p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style=\"margin-bottom: 5px; font-size: 16px;\">If you need to reschedule or have any questions, please:</p>
                                    <ul style=\"margin-top: 5px; margin-bottom: 25px; padding-left: 20px;\">
                                        <li style=\"margin-bottom: 5px;\">Call us at <strong>0915-755-6527</strong></li>
                                        <li style=\"margin-bottom: 5px;\">Visit our website at <a href=\"#\" style=\"color: #0056b3; text-decoration: none;\">http://localhost/ANG/Website/index/index.html</a></li>
                                    </ul>
                                    
                                    <p style=\"margin-bottom: 20px; font-size: 16px;\">Thank you for choosing ANG DENTAL CLINIC for your dental needs.</p>
                                    
                                    <p style=\"margin-bottom: 10px; font-size: 16px;\">Regards,</p>
                                    <p style=\"margin-top: 0; font-size: 16px;\"><strong>The ANG CLINIC Team</strong></p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style=\"background-color: #f5f5f5; padding: 20px 40px; border-top: 1px solid #dddddd;\">
                                    <p style=\"margin: 0; color: #777777; font-size: 14px; text-align: center;\">This is an automated reminder. Please do not reply to this email.</p>
                                </td>
                            </tr>
                            
                            <!-- Address Footer -->
                            <tr>
                                <td style=\"background-color: #eeeeee; padding: 15px 40px; text-align: center; font-size: 12px; color: #666666;\">
                                    <p style=\"margin: 0 0 5px 0;\">ANG DENTAL CLINIC | 2nd Floor, 07 M. Villarica Rd Prenza 2 Marilao Bulacan</p>
                                    <p style=\"margin: 0;\">© 2025 ANG DENTAL CLINIC. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        ";
        
        // Plain text alternative for email clients that don't support HTML
        $mail->AltBody = "Hello {$name}, this is a reminder about your upcoming appointment on {$date} at {$time} for {$service}. Thank you for choosing ANG CLINIC.";

        // Send the email
        $mail->send();
        
        // Return JSON response
        echo json_encode([
            'success' => true,
            'message' => 'Email sent successfully'
        ]);
        
    } catch (Exception $e) {
        // Return JSON error response
        echo json_encode([
            'success' => false,
            'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"
        ]);
    }
    
    // End script execution to prevent additional output
    exit;
} 

// Flush the output
ob_end_flush();
?>