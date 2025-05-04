<?php
header('Content-Type: application/json'); // Set response format
include '../../Database/DBConnect.php';
require '../../ANG CLIENT 1.2/clientIndex/globalfunction.php';

// Check if connection is successful
if (!$conn) {
    die(json_encode(['error' => "Connection failed: " . mysqli_connect_error()]));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';


if ($_SERVER['REQUEST_METHOD'] === 'GET') {


    if($action == 'getnumbers'){

    $GetAmounts = $conn->query("SELECT 

    -- Show How Many Appointments Today -- 
    (SELECT COUNT(*) FROM `appointmentlist` a WHERE a.App_ChosenDate = CURDATE() AND a.STAT_Name LIKE 'BOOKED') AS TodayAppointment,
    
    -- Show How Many Account on Last Month --
    (SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS LastMonth,
    
    -- Show How Many Account on This Month --
    (SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE') AS ThisMonth,
    
    -- Calculate the patient growth percentage with NULL handling and + sign for positive values
    CONCAT(
        CASE 
            WHEN ROUND(
                (((SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE') - 
                (SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01'))) / 
                NULLIF((SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01')), 0)) * 100,
                2
            ) > 0 THEN '+'
            ELSE ''
        END,
        COALESCE(
            ROUND(
                (((SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE') - 
                (SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01'))) / 
                NULLIF((SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01')), 0)) * 100,
                2
            ), 
            0
        )
    ) AS PatientGrowthPercentage,
    
    -- Show How Many Appointment Last Month --
    (SELECT COUNT(*) 
     FROM `appointmentlist` a 
     WHERE (a.STAT_Name LIKE 'Booked' OR a.STAT_Name LIKE 'Complete')
     AND a.App_ChosenDate >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
     AND a.App_ChosenDate < DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS AppointmentLastMonth,
    
    -- Show How Many Appointment This Month --
    (SELECT COUNT(*) 
     FROM `appointmentlist` a
     WHERE (a.STAT_Name = 'Booked' OR a.STAT_Name = 'Complete')
     AND a.App_ChosenDate >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
     AND a.App_ChosenDate < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')) AS AppointmentThisMonth,
     
    -- Calculate the appointment growth percentage with NULL handling and + sign for positive values
    CONCAT(
        CASE 
            WHEN ROUND(
                ((
                    (SELECT COUNT(*) 
                     FROM `appointmentlist` 
                     WHERE (STAT_Name = 'Booked' OR STAT_Name = 'Complete')
                     AND App_ChosenDate >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     AND App_ChosenDate < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')) - 
                    (SELECT COUNT(*) 
                     FROM `appointmentlist` 
                     WHERE (STAT_Name LIKE 'Booked' OR STAT_Name LIKE 'Complete')
                     AND App_ChosenDate >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                     AND App_ChosenDate < DATE_FORMAT(CURDATE(), '%Y-%m-01'))
                ) / 
                NULLIF((SELECT COUNT(*) 
                        FROM `appointmentlist` 
                        WHERE (STAT_Name LIKE 'Booked' OR STAT_Name LIKE 'Complete')
                        AND App_ChosenDate >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                        AND App_ChosenDate < DATE_FORMAT(CURDATE(), '%Y-%m-01')), 0)) * 100,
                2
            ) > 0 THEN '+'
            ELSE ''
        END,
        COALESCE(
            ROUND(
                ((
                    (SELECT COUNT(*) 
                     FROM `appointmentlist` 
                     WHERE (STAT_Name = 'Booked' OR STAT_Name = 'Complete')
                     AND App_ChosenDate >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     AND App_ChosenDate < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')) - 
                    (SELECT COUNT(*) 
                     FROM `appointmentlist` 
                     WHERE (STAT_Name LIKE 'Booked' OR STAT_Name LIKE 'Complete')
                     AND App_ChosenDate >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                     AND App_ChosenDate < DATE_FORMAT(CURDATE(), '%Y-%m-01'))
                ) / 
                NULLIF((SELECT COUNT(*) 
                        FROM `appointmentlist` 
                        WHERE (STAT_Name LIKE 'Booked' OR STAT_Name LIKE 'Complete')
                        AND App_ChosenDate >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                        AND App_ChosenDate < DATE_FORMAT(CURDATE(), '%Y-%m-01')), 0)) * 100,
                2
            ),
            0
        )
    ) AS AppointmentGrowthPercentage,

    -- Show How Many Services Currently --
    (SELECT COUNT(*) FROM `services`) AS Services,

    -- Calculate Revenue for This Month with NULL handling
    COALESCE(
        (SELECT SUM(Amount) 
         FROM `blling` 
         WHERE BILL_Date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
         AND BILL_Date < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
         AND StatusID = 8),
        0
    ) AS RevenueThisMonth,
    
    -- Calculate Revenue for Last Month with NULL handling
    COALESCE(
        (SELECT SUM(Amount) 
         FROM `blling` 
         WHERE BILL_Date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
         AND BILL_Date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
         AND StatusID = 8),
        0
    ) AS RevenueLastMonth,
     
    -- Calculate Revenue Growth Percentage with NULL handling and + sign for positive values
    CONCAT(
        CASE 
            WHEN ROUND(
                ((
                    COALESCE((SELECT SUM(Amount) 
                     FROM `blling` 
                     WHERE BILL_Date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     AND BILL_Date < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
                     AND StatusID = 8), 0) - 
                    COALESCE((SELECT SUM(Amount) 
                     FROM `blling` 
                     WHERE BILL_Date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                     AND BILL_Date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     AND StatusID = 8), 0)
                ) / 
                NULLIF(COALESCE((SELECT SUM(Amount) 
                        FROM `blling` 
                        WHERE BILL_Date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                        AND BILL_Date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
                        AND StatusID = 8), 0), 0)) * 100,
                2
            ) > 0 THEN '+'
            ELSE ''
        END,
        COALESCE(
            ROUND(
                ((
                    COALESCE((SELECT SUM(Amount) 
                     FROM `blling` 
                     WHERE BILL_Date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     AND BILL_Date < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
                     AND StatusID = 8), 0) - 
                    COALESCE((SELECT SUM(Amount) 
                     FROM `blling` 
                     WHERE BILL_Date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                     AND BILL_Date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
                     AND StatusID = 8), 0)
                ) / 
                NULLIF(COALESCE((SELECT SUM(Amount) 
                        FROM `blling` 
                        WHERE BILL_Date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                        AND BILL_Date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
                        AND StatusID = 8), 0), 0)) * 100,
                2
            ),
            0
        )
    ) AS RevenueGrowthPercentage;");
    }

    GET($conn,$GetAmounts);
}


?>