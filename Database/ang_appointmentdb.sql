-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 01, 2025 at 10:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ang_appointmentdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `AccountID` int(10) NOT NULL,
  `StatusID` int(10) NOT NULL,
  `UserTypeID` int(10) NOT NULL,
  `ACC_Username` varchar(30) NOT NULL,
  `ACC_Password` varchar(128) NOT NULL,
  `ACC_Email` varchar(320) NOT NULL,
  `ACC_DateCreated` date NOT NULL DEFAULT current_timestamp(),
  `ACC_Profile` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `AddressID` int(10) NOT NULL,
  `ADD_HouseNo` varchar(100) NOT NULL,
  `ADD_LotNo` varchar(100) NOT NULL,
  `ADD_Street` varchar(255) DEFAULT NULL,
  `ADD_Barangay` varchar(100) DEFAULT NULL,
  `ADD_City` varchar(100) DEFAULT NULL,
  `ADD_Province` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `AppointmentID` int(10) NOT NULL,
  `PatientID` int(10) DEFAULT NULL,
  `ServicesID` int(10) DEFAULT NULL,
  `StatusID` int(10) DEFAULT NULL,
  `APP_ChosenDate` date DEFAULT NULL,
  `APP_ChosenTime` time DEFAULT NULL,
  `APP_Submission` datetime DEFAULT NULL,
  `APP_QR` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `appointmentlist`
-- (See below for the actual view)
--
CREATE TABLE `appointmentlist` (
`App_ChosenDate` date
,`App_ChosenTime` time
,`App_Submission` datetime
,`App_QR` longblob
,`Ser_Name` varchar(30)
,`Stat_Name` varchar(30)
,`DisplayName` varchar(305)
);

-- --------------------------------------------------------

--
-- Table structure for table `blling`
--

CREATE TABLE `blling` (
  `BillingID` int(10) NOT NULL,
  `AppointmentID` int(10) DEFAULT NULL,
  `PaymentMethodID` int(10) DEFAULT NULL,
  `StatusID` int(10) DEFAULT NULL,
  `BILL_Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dentist`
--

CREATE TABLE `dentist` (
  `DentistID` int(10) NOT NULL,
  `NameID` int(10) DEFAULT NULL,
  `AddressID` int(10) DEFAULT NULL,
  `AccountID` int(10) DEFAULT NULL,
  `D_Gender` varchar(30) DEFAULT NULL,
  `D_YearsofExperience` int(10) DEFAULT NULL,
  `D_Specialty` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `dentistlist`
-- (See below for the actual view)
--
CREATE TABLE `dentistlist` (
`DisplayName` varchar(305)
,`N_LastName` varchar(100)
,`N_MiddleName` varchar(100)
,`N_Suffix` varchar(10)
,`N_FirstName` varchar(100)
,`Add_Street` varchar(255)
,`Add_Barangay` varchar(100)
,`Add_City` varchar(100)
,`Add_Province` varchar(100)
,`D_Gender` varchar(30)
,`D_YearsofExperience` int(10)
,`D_Specialty` varchar(255)
,`DentistID` int(10)
);

-- --------------------------------------------------------

--
-- Table structure for table `name`
--

CREATE TABLE `name` (
  `NameID` int(10) NOT NULL,
  `N_FirstName` varchar(100) DEFAULT NULL,
  `N_LastName` varchar(100) DEFAULT NULL,
  `N_MiddleName` varchar(100) DEFAULT NULL,
  `N_Suffix` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `PatientID` int(10) NOT NULL,
  `NameID` int(10) DEFAULT NULL,
  `AddressID` int(10) DEFAULT NULL,
  `AccountID` int(10) DEFAULT NULL,
  `P_Gender` varchar(30) DEFAULT NULL,
  `P_DOB` date DEFAULT NULL,
  `P_Age` int(10) DEFAULT NULL,
  `P_FacebookAccount` varchar(320) DEFAULT NULL,
  `P_ContactNo` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `patientlist`
-- (See below for the actual view)
--
CREATE TABLE `patientlist` (
`DisplayName` varchar(305)
,`N_LastName` varchar(100)
,`N_MiddleName` varchar(100)
,`N_Suffix` varchar(10)
,`N_FirstName` varchar(100)
,`ADD_Street` varchar(255)
,`ADD_Barangay` varchar(100)
,`ADD_City` varchar(100)
,`ADD_Province` varchar(100)
,`P_Gender` varchar(30)
,`P_DOB` date
,`P_Age` int(10)
,`P_FacebookAccount` varchar(320)
,`P_ContactNo` varchar(20)
);

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethod`
--

CREATE TABLE `paymentmethod` (
  `PaymentMethodID` int(10) NOT NULL,
  `PM_Name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `ServiceID` int(10) NOT NULL,
  `SER_Name` varchar(30) DEFAULT NULL,
  `SER_Details` varchar(320) DEFAULT NULL,
  `SER_Duration` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `StatusID` int(10) NOT NULL,
  `STAT_Name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unavailableslots`
--

CREATE TABLE `unavailableslots` (
  `UnavailableSlotsID` int(10) NOT NULL,
  `US_Date` date NOT NULL,
  `US_StartTime` time NOT NULL,
  `US_EndTime` time NOT NULL,
  `US_Reason` varchar(320) NOT NULL,
  `US_Createdat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

CREATE TABLE `usertype` (
  `UserTypeID` int(10) NOT NULL,
  `UT_Name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `appointmentlist`
--
DROP TABLE IF EXISTS `appointmentlist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `appointmentlist`  AS SELECT `a`.`APP_ChosenDate` AS `App_ChosenDate`, `a`.`APP_ChosenTime` AS `App_ChosenTime`, `a`.`APP_Submission` AS `App_Submission`, `a`.`APP_QR` AS `App_QR`, `d`.`SER_Name` AS `Ser_Name`, `e`.`STAT_Name` AS `Stat_Name`, concat(`c`.`N_FirstName`,' ',concat(left(`c`.`N_MiddleName`,1),'.'),' ',`c`.`N_LastName`,' ',`c`.`N_LastName`) AS `DisplayName` FROM ((((`appointment` `a` join `patient` `b` on(`a`.`PatientID` = `b`.`PatientID`)) join `name` `c` on(`b`.`NameID` = `c`.`NameID`)) join `services` `d` on(`a`.`ServicesID` = `d`.`ServiceID`)) join `status` `e` on(`a`.`StatusID` - `e`.`StatusID`)) ;

-- --------------------------------------------------------

--
-- Structure for view `dentistlist`
--
DROP TABLE IF EXISTS `dentistlist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `dentistlist`  AS SELECT concat(`b`.`N_FirstName`,' ',concat(left(`b`.`N_MiddleName`,1),'.'),' ',`b`.`N_LastName`,' ',`b`.`N_LastName`) AS `DisplayName`, `b`.`N_LastName` AS `N_LastName`, `b`.`N_MiddleName` AS `N_MiddleName`, `b`.`N_Suffix` AS `N_Suffix`, `b`.`N_FirstName` AS `N_FirstName`, `c`.`ADD_Street` AS `Add_Street`, `c`.`ADD_Barangay` AS `Add_Barangay`, `c`.`ADD_City` AS `Add_City`, `c`.`ADD_Province` AS `Add_Province`, `a`.`D_Gender` AS `D_Gender`, `a`.`D_YearsofExperience` AS `D_YearsofExperience`, `a`.`D_Specialty` AS `D_Specialty`, `a`.`DentistID` AS `DentistID` FROM ((`dentist` `a` join `name` `b` on(`a`.`NameID` = `b`.`NameID`)) join `address` `c` on(`a`.`AddressID` = `c`.`AddressID`)) ;

-- --------------------------------------------------------

--
-- Structure for view `patientlist`
--
DROP TABLE IF EXISTS `patientlist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `patientlist`  AS SELECT concat(`b`.`N_FirstName`,' ',concat(left(`b`.`N_MiddleName`,1),'.'),' ',`b`.`N_LastName`,' ',`b`.`N_LastName`) AS `DisplayName`, `b`.`N_LastName` AS `N_LastName`, `b`.`N_MiddleName` AS `N_MiddleName`, `b`.`N_Suffix` AS `N_Suffix`, `b`.`N_FirstName` AS `N_FirstName`, `c`.`ADD_Street` AS `ADD_Street`, `c`.`ADD_Barangay` AS `ADD_Barangay`, `c`.`ADD_City` AS `ADD_City`, `c`.`ADD_Province` AS `ADD_Province`, `a`.`P_Gender` AS `P_Gender`, `a`.`P_DOB` AS `P_DOB`, `a`.`P_Age` AS `P_Age`, `a`.`P_FacebookAccount` AS `P_FacebookAccount`, `a`.`P_ContactNo` AS `P_ContactNo` FROM ((`patient` `a` join `name` `b` on(`a`.`NameID` = `b`.`NameID`)) join `address` `c` on(`a`.`AddressID` = `c`.`AddressID`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`AccountID`),
  ADD KEY `StatusID` (`StatusID`),
  ADD KEY `UserTypeID` (`UserTypeID`);

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`AddressID`);

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`AppointmentID`),
  ADD KEY `Patient` (`PatientID`),
  ADD KEY `Services2` (`ServicesID`),
  ADD KEY `Status2` (`StatusID`);

--
-- Indexes for table `blling`
--
ALTER TABLE `blling`
  ADD PRIMARY KEY (`BillingID`),
  ADD KEY `PaymentMethod` (`PaymentMethodID`),
  ADD KEY `Status` (`StatusID`),
  ADD KEY `Appointment` (`AppointmentID`);

--
-- Indexes for table `dentist`
--
ALTER TABLE `dentist`
  ADD PRIMARY KEY (`DentistID`),
  ADD KEY `Name_Dentist` (`NameID`),
  ADD KEY `Account_Dentist` (`AccountID`),
  ADD KEY `Address_Dentist` (`AddressID`);

--
-- Indexes for table `name`
--
ALTER TABLE `name`
  ADD PRIMARY KEY (`NameID`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`PatientID`),
  ADD KEY `Name` (`NameID`),
  ADD KEY `Address` (`AddressID`),
  ADD KEY `Account` (`AccountID`);

--
-- Indexes for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  ADD PRIMARY KEY (`PaymentMethodID`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`ServiceID`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`StatusID`);

--
-- Indexes for table `unavailableslots`
--
ALTER TABLE `unavailableslots`
  ADD PRIMARY KEY (`UnavailableSlotsID`);

--
-- Indexes for table `usertype`
--
ALTER TABLE `usertype`
  ADD PRIMARY KEY (`UserTypeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `AccountID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `AddressID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `AppointmentID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blling`
--
ALTER TABLE `blling`
  MODIFY `BillingID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dentist`
--
ALTER TABLE `dentist`
  MODIFY `DentistID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `name`
--
ALTER TABLE `name`
  MODIFY `NameID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `PatientID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `PaymentMethodID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `ServiceID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `StatusID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unavailableslots`
--
ALTER TABLE `unavailableslots`
  MODIFY `UnavailableSlotsID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `UserTypeID` int(10) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`StatusID`) REFERENCES `status` (`StatusID`),
  ADD CONSTRAINT `account_ibfk_2` FOREIGN KEY (`UserTypeID`) REFERENCES `usertype` (`UserTypeID`);

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `Patient` FOREIGN KEY (`PatientID`) REFERENCES `patient` (`PatientID`),
  ADD CONSTRAINT `Services2` FOREIGN KEY (`ServicesID`) REFERENCES `services` (`ServiceID`),
  ADD CONSTRAINT `Status2` FOREIGN KEY (`StatusID`) REFERENCES `status` (`StatusID`);

--
-- Constraints for table `blling`
--
ALTER TABLE `blling`
  ADD CONSTRAINT `Appointment` FOREIGN KEY (`AppointmentID`) REFERENCES `appointment` (`AppointmentID`),
  ADD CONSTRAINT `PaymentMethod` FOREIGN KEY (`PaymentMethodID`) REFERENCES `paymentmethod` (`PaymentMethodID`),
  ADD CONSTRAINT `Status` FOREIGN KEY (`StatusID`) REFERENCES `status` (`StatusID`);

--
-- Constraints for table `dentist`
--
ALTER TABLE `dentist`
  ADD CONSTRAINT `Account_Dentist` FOREIGN KEY (`AccountID`) REFERENCES `account` (`AccountID`),
  ADD CONSTRAINT `Address_Dentist` FOREIGN KEY (`AddressID`) REFERENCES `address` (`AddressID`),
  ADD CONSTRAINT `Name_Dentist` FOREIGN KEY (`NameID`) REFERENCES `dentist` (`DentistID`);

--
-- Constraints for table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `Account` FOREIGN KEY (`AccountID`) REFERENCES `account` (`AccountID`),
  ADD CONSTRAINT `Address` FOREIGN KEY (`AddressID`) REFERENCES `address` (`AddressID`),
  ADD CONSTRAINT `Name` FOREIGN KEY (`NameID`) REFERENCES `name` (`NameID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
