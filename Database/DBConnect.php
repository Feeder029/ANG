<?php
$servername = "localhost";
$username = "root"; // Default XAMPP user
$password = ""; // Default walang password
$dbname = "pos_db"; // Database name

// Connect sa database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check kung may error
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
}
?>
