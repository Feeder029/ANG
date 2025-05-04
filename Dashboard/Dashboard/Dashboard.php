<?php

$SQL = $conn->$query("SELECT 

-- Show How Many Appointments Today -- 
(SELECT COUNT(*) FROM `appointmentlist` a WHERE a.App_ChosenDate = CURDATE() AND a.STAT_Name LIKE 'BOOKED') AS TodayAppointment

-- Show How Many Account on Last Month --
(SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS LastMonth,

-- Show How Many Account on This Month --
(SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE') AS ThisMonth,

-- Calculate the growth percentage --
ROUND(
    (((SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE') - 
    (SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01'))) / 
    NULLIF((SELECT COUNT(*) FROM `patientlist` WHERE `STAT_Name` = 'ACTIVE' AND ACC_DateCreated < DATE_FORMAT(CURDATE(), '%Y-%m-01')), 0)) * 100,
    2
) AS GrowthPercentage;");


?>