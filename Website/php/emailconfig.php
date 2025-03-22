<?php
// Start output buffering
ob_start();

// Call and Use all of the important files
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require('../../Extensions/PHPMailer-master/src/Exception.php');
require('../../Extensions/PHPMailer-master/src/PHPMailer.php');
require('../../Extensions/PHPMailer-master/src/SMTP.php');

// Send Messages to Client's Account
if (isset($_POST["send"])) {
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
        $mail->setFrom($_POST["email"], $_POST["name"]);
        $mail->addAddress('systemdev.3rdyear@gmail.com');
        $mail->addReplyTo($_POST["email"], $_POST["name"]);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $_POST["subject"];
        $mail->Body = "From: " . $_POST["email"] . "<br><br>" . nl2br($_POST["message"]);

        // Send the email
        if ($mail->send()) {
            echo "
            <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your message has been sent successfully to our email.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = 'index.html'; 
                    });
                });
            </script>";
        }
    } catch (Exception $e) {
        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    title: 'Error!',
                    text: 'Message could not be sent. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = 'index.html';
                });
            });
        </script>";
    }
}

// Flush the output
ob_end_flush();
?>
