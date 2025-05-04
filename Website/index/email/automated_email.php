<?php
/**
 * Standalone Automated Email Sender
 * 
 * This script will:
 * 1. Run continuously in the background as a daemon process
 * 2. Check the current time against the target time
 * 3. Send an email exactly at 6:00 PM on May 3, 2025
 * 4. Terminate itself after successfully sending the email
 * 
 * Usage: 
 * 1. Upload this script to your server
 * 2. Make it executable: chmod +x standalone_email_sender.php
 * 3. Run it in the background: php standalone_email_sender.php &
 * 4. For extra reliability, set it to start automatically when your server boots
 */

// Prevent script timeout
set_time_limit(0);
ignore_user_abort(true);

// Required for PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Path to PHPMailer files - update according to your system
require('../../../Extensions/PHPMailer-master/src/Exception.php');
require('../../../Extensions/PHPMailer-master/src/PHPMailer.php');
require('../../../Extensions/PHPMailer-master/src/SMTP.php');

// Create log directory if it doesn't exist
$logDir = __DIR__ . '/logs';
if (!file_exists($logDir)) {
    mkdir($logDir, 0755, true);
}

// Initialize log file
$logFile = $logDir . '/email_daemon.log';
logMessage("Email daemon started");

// Target date and time
$targetDate = '2025-05-03';
$targetTime = '18:00:00'; // 6:00 PM
$targetTimestamp = strtotime("$targetDate $targetTime");

// Calculate the time until the target date for initial sleep
$now = time();
$initialTimeUntilTarget = $targetTimestamp - $now;

if ($initialTimeUntilTarget > 0) {
    // If target is in the future, log how long we'll wait
    $days = floor($initialTimeUntilTarget / (60 * 60 * 24));
    $hours = floor(($initialTimeUntilTarget % (60 * 60 * 24)) / (60 * 60));
    $minutes = floor(($initialTimeUntilTarget % (60 * 60)) / 60);
    
    logMessage("Target date is in the future. Waiting for $days days, $hours hours, and $minutes minutes");
    
    // If the target is more than 1 day away, we'll sleep for 1 day at a time
    // This allows the script to periodically check and log its status
    if ($initialTimeUntilTarget > 86400) { // 86400 seconds = 1 day
        while (time() < ($targetTimestamp - 86400)) {
            sleep(86400); // Sleep for 1 day
            $timeLeft = $targetTimestamp - time();
            $daysLeft = ceil($timeLeft / 86400);
            logMessage("Still running. Approximately $daysLeft days until target date.");
        }
    }
}

// Main loop - check every minute as we get closer to the target time
logMessage("Entering precision timing mode for email scheduling");

while (true) {
    $now = time();
    $currentDate = date('Y-m-d');
    $currentTime = date('H:i:s');
    
    // Calculate how many seconds until the target time
    $secondsUntilTarget = $targetTimestamp - $now;
    
    if ($currentDate == $targetDate) {
        if ($secondsUntilTarget <= 0 && $secondsUntilTarget > -300) { // Within 5 minutes after target
            // It's time to send the email!
            logMessage("Target time reached. Preparing to send email...");
            
            if (sendScheduledEmail()) {
                logMessage("Email sent successfully. Daemon will terminate.");
                exit(0); // Exit the script after successful sending
            } else {
                // If sending fails, keep trying for up to 5 minutes
                logMessage("Failed to send email. Will retry in 30 seconds.");
                sleep(30);
            }
        } elseif ($secondsUntilTarget > 0 && $secondsUntilTarget <= 3600) {
            // Less than 1 hour until target time - log status every 15 minutes
            $minutesLeft = ceil($secondsUntilTarget / 60);
            if ($minutesLeft % 15 == 0) {
                logMessage("$minutesLeft minutes until scheduled send time.");
            }
            sleep(60); // Check every minute
        } else {
            // More than 1 hour until target time on the target day
            logMessage("It's the target day. " . floor($secondsUntilTarget / 3600) . " hours until scheduled send time.");
            sleep(900); // Check every 15 minutes
        }
    } else {
        // Not the target date yet
        if ($currentDate > $targetDate) {
            // We've passed the target date without sending
            logMessage("Target date has passed. Checking if email was sent...");
            
            // Check if we already sent the email (using a flag file)
            $flagFile = $logDir . '/email_sent_flag.txt';
            if (file_exists($flagFile)) {
                logMessage("Email was already sent. Daemon will terminate.");
            } else {
                logMessage("Email was not sent on the target date. Attempting to send now...");
                sendScheduledEmail();
                logMessage("Daemon will terminate.");
            }
            exit(0);
        } else {
            // Still waiting for target date
            // Sleep for 6 hours and then check again
            logMessage("Waiting for target date. Sleeping for 6 hours.");
            sleep(21600); // 6 hours in seconds
        }
    }
}

/**
 * Send the scheduled email
 * 
 * @return bool True if email was sent successfully, false otherwise
 */
function sendScheduledEmail() {
    global $logDir;
    
    // Check if email was already sent
    $flagFile = $logDir . '/email_sent_flag.txt';
    if (file_exists($flagFile)) {
        logMessage("Email was already sent. Skipping send operation.");
        return true;
    }
    
    try {
        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'systemdev.3rdyear@gmail.com'; // Your email address
        $mail->Password = 'cznyuirgsdpfybzb'; // Your app password or password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        // Recipients
        $mail->setFrom('systemdev.3rdyear@gmail.com', 'Automated System');
        $mail->addAddress('alexisjakejarencio@gmail.com'); // Recipient's email address
        
        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'Scheduled Automated Email - May 3, 2025';
        $mail->Body = '
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { padding: 20px; }
                    .header { color: #4a4a4a; font-size: 24px; }
                    .content { margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #888; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Automated Scheduled Email</div>
                    <div class="content">
                        <p>This email was automatically generated and sent at 6:00 PM on May 3, 2025.</p>
                        <p>Your important scheduled message content goes here.</p>
                        <p>You can include any information that needs to be sent at this specific time.</p>
                    </div>
                    <div class="footer">
                        This is an automated message. Please do not reply to this email.
                    </div>
                </div>
            </body>
            </html>';

        // Plain text alternative
        $mail->AltBody = 'This email was automatically generated and sent at 6:00 PM on May 3, 2025. Your important scheduled message content goes here.';
        
        // Send the email
        $result = $mail->send();
        
        if ($result) {
            // Create a flag file to indicate successful sending
            file_put_contents($flagFile, date('Y-m-d H:i:s') . " - Email successfully sent\n");
            logMessage("Email sent successfully!");
            return true;
        } else {
            logMessage("Email could not be sent.");
            return false;
        }
    } catch (Exception $e) {
        logMessage("Email sending exception: " . $e->getMessage());
        return false;
    }
}

/**
 * Log a message to the log file
 * 
 * @param string $message Message to log
 */
function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "$timestamp - $message\n", FILE_APPEND);
    
    // Also output to console if running in CLI mode
    if (php_sapi_name() === 'cli') {
        echo "$timestamp - $message\n";
    }
}