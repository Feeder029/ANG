-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2025 at 07:25 PM
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
  `ACC_Password` varchar(255) NOT NULL,
  `ACC_Email` varchar(320) NOT NULL,
  `ACC_DateCreated` date NOT NULL DEFAULT current_timestamp(),
  `ACC_Profile` longblob DEFAULT NULL,
  `ACC_Cookies` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`AccountID`, `StatusID`, `UserTypeID`, `ACC_Username`, `ACC_Password`, `ACC_Email`, `ACC_DateCreated`, `ACC_Profile`, `ACC_Cookies`) VALUES
(1, 1, 1, 'Patient', 'Patient123', 'thegaminghandsome@gmail.com', '2025-04-27', 0xffd8ffe000104a46494600010100000100010000ffdb0084000906071313121513131316151516171917161517171a181717181d18161a181d18181a1d28201a1a251b151a21312225292b2e2e2f1d203338332d37282d2e2b010a0a0a0e0d0e1b10101a2d2520222d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2b2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2dffc000110800e100e103012200021101031101ffc4001c0001000105010100000000000000000000000302040506070801ffc400441000010302030505050406090501000000010002030411122131050641516107132271813291a1b1f0234262c114527282d1f108333543537392a2e115a3b3c2c324ffc400190101000301010000000000000000000000000102040305ffc4002411010100020104010501010000000000000001021103122131410422325161711342ffda000c03010002110311003f00ee28888088880888808888088880888808be38db33a2d7e4df8d9cd739a6b69f133da1deb72f5bdba6baa0d85172adbfdb345192da5a7efec6c5c65681e61b1e32e1c2f974bad64f6db587311d3b5b7b59d1ca49f2b499fbb828da7a6bbda2e2541db155924ba281fca36b648de4742e71bf9069fc96621edca8f2ef29e704eb830b80b6b9b8b093d2c9b3a6baaa2c16c0defa2ac3869e76bdd6be020b1f6b037c2e0091623459d5281111011110111101111011110111101111011110111101111016a7da1efa47b3a024163a777f5511273cec5c43730d1ccd81d2f7597de7db91d152cb532fb31b72035738e4c68ea5c405e52db5b666ac95f3d41bbde6ee37b068d1ad03835a32035f541b06f0f68bb42ada1b2cfddb093f6708eef1703737c4470b12474b85a74b26239bc7bdd7279925b99f55307b6fa8d391fe23e4a4635a7ef0f97c4dd557d22869ef9db10e60dcfa67f982ab752b4e4e7dc707106edbfeb039dbeb95ef22a4c27c070bad7d351d472e37b1f452125d76c8cead7378f91e76bf9fc449a5bd2d2b99769367373737516e0e68e2343719fcd5c54c577b490311201e009fbaebf5c9bea14b062f64ff0058cce27f369cac7a126c47e2e8adaa1c0c66df76c40e3808376e5faa4387a379a83c33db2237413c5244eb3e30d733cd878f9839f319715e98d9d58d9a264ac376bda1c3d751e60e5e8bc9a76890411f7b3f536b8f2b83e81758ec4f7b5a5eea291fed0c70df4c43db68ea458dba3b9a4ed539778ec6888ace6222202222022220222202222022220222202222022220e37fd21b6a10da6a6b8b3b1ca6cecee00632ed1c087bfe3c971592324000df8927f8eb97f15ba76bd33e6daf3dcf8630c8c0bfb2d0c6e5eae738dbf12c1eedd207cad0fd2ff01f5655caaf8cdb29bb5b852d4d9d88b1bc5c45bdc389fac96fd47d9752340c6f91e79e20df905b56cf686b0068b0b64b210b163cb972be1e863c38c8d166ecc22feee57000dc076763d08d0f5b24dd9eb9b62d7075ec5c0e57e60f5d735d1a26a9c315a5c94ca633d39bd4f67630785de2e17e1ebf5c160b68766928bb98f6039dc7adff0020baf491ac7d6c66cab972658af8f1e393cd7bc1b2a5a67607b4b73f09d45b419f97ccab2d9d5af8ded7b1d85ec702d70d4386608f50bbb6dfd94c9a3735ed0e07eae170adb3b35d4f3be2d6c6cd3cc7ddf55df8797ae7ed9be470ff009ddcf0f606c2da22a29a0a802c2589925b9626875bd2eaf962b74e8fb9a2a6888b16411b48e44305fe2b2abbb28888808888088880888808888088880888808888088883ccfdaacad3b56a46762f617752218c7bb258dddfb891a7ddcfd3ebf257dda1424ed6acbf1947c58cb7c3a7bf5596dc8d86e91d88e51b46bc49e2172e4cb51df8b1dd749d92ebb1bc72f4fe4b2b0cab086ad910bb8d8701cfd14b49bc74dc64683c05c5cac78cb5e8e5648d8e20ae5816369768c327b32077915926ad18c64cea399a163eaed6592908e6b1d536e242a72474e2ac2553571fded831d6330b719ef1adc17b62f10cae3300e97e19aec75646641bf4e8b93ef8d3e0aa6386a5cc232d4e216cb8f2b2a7c7ed92ff002bbe0f49b34195b2d070552045bde588888088880888808888088880888808888088880be1365f562f79e273a9656b096b8b72235198fc945ba9b5b0c7ab293f2e29daad2346d473da416cb1b1e08208c4d1808bf3cae7cfaadbb76a0c34d18b6adbfa958bda2d74b4c5950c6e31fd54a001778390b7eb100e991cf45b86ce8406b470000f72c99e7d51e84e2ff2cb4c1546cf859f6952e2ef7868e800cddfc3d56b9b4ea365c976b62918ec18c3a205ad239b3563f5d05c95d2ea28192b4870d559546ecc4f2d2e607168006640b5ef6f0917f5ebcd3132f0e7fb0c3e07e5de398ec2435ed0db820169cada8195ed7e175d4b63d497c60bb5e23973d5415149c5e01205864000390e9a65a643904a375ae145cb553d3d58b07bddb65d1becce033d4017e67803f92d1298d4554c48aca665b2c1de8240fd95d0e7a56492b8100e635e3cfdf617e971c4ac36d8dc78e694bc8b31cf0f746d680310d0838b2d48d3207a29c72d99e3aed18ba9a4ab83ed3bc6ca45ee1a2d95b33878fa2b0da74a2aea367068244d3007504303985f98cc10dc5e5d167b676ecc90bdf671ee89f0b09be11d3eb3e3c2d96d9749143550c92349ee84c58036fe376017e43c25f99e6a70b3abbabcb8de8d4748450d254b64635ec376b85c1532d6f3acd08888088880888808888088880888808888088880a1ab66263873054c89532eaedceb6bd1b0c2c26d7690e07910e57f472856fb7a8bba6c8097780e367ecdf21d743e5ee56543578802b0d9647ad72995dcadae9df70aed8cc9636965160936d7634e12eb2be39493bb8e58db7b3eed39b87aab7a061b12563b6ed517b71452e0700730d0eb8e59f96be6b17b3f6fbe06da77630478240db621d5a32b8b0d35e438d35bbb769f4e3a66a66e1941e7f97f359d0db85ce7666d79ea6a6e708881f67ef01e995edeebae83054021463daa393bc9629999966b55de0a7ef70b0388bbac6c6d71622c7a1242d93684d60b13bbac135536f9e105e479580f8956d6eea225e99d55bbecea56c51471b4068635ad00682c2cae1116d8f2edddd888888111101111011110111101111011110111101111061778763ba707016dcb0b0875c0e3637009e2b99d0c98715aff009020e7d3d3c97665c4eaa60c95f1bb99b5fa9e3fcb82cfcb8c6be0ceded7d368d8db47bc6f103404e5f0e0ad36a50be4270665a6e5a0d9c46b95f207f92c2d0cf85e75009bdbe58ba0cf4c9673666d2bb8dce67eaf970e3ef59ecd34cab28e9da40062a86db5f609f83cf250cf40d173fa461bfdc7b5ed22d6d058dcea725b74cff01780db81a3b2f8f05888f6fb89c2626def63678d33cefc55e69d378d600490466eca9634df421cd04f2bbadeee8b25b17691bd83b178af89b98232f7d8b965aa216db13da2dad9c6ff00f0b1326d06891e72200bdac2d7fe1637f4eaa996adec8b64f0bbde2da8d68b6217e5c566bb38a2fb27543b3748e2d6f46b4dbe247c173aa3864aca9636f9bdcd17032033c648e82feef25dc69a9db1b1ac600d6b45801c02d1c38fb63f91c9db4951116864111101111011110111101111011110111101111011512cad682e710d68cc926c07992b45df6ed229e9e077e8b34534ee258dc0e0f6c66d9b9d6c8db9712470ba998dbe116e936f16f6bffea14fb3a99c039ce0fa99322591b417f76d072c6e6b6c4fdd0e16ccdc6abda16c47e2796121d72e69e6d71248f7923e2b996ee6de753ed08eaa4739f6931c84dcb9c1d7121eaec2e71ea6cbd2f57471d4c40120b48c4c78cf2232239823de9cfc7da697e0e492ddf8af3c6cfdaae692d7dc381b58ea3875e0b6dd95b49ae18811c2e7d7991a822d6e8a4df0dcb2c37b7ecbdba11f5c0ad25904d03eed68703c073e1e1be6b2d932feb5cb71fdc754d9f541dabae438b73e3a9272f223f9ac8baa18ed0e839e87437e5a8e375c7e2de90c75c8703c5b6b69d0740a73be20939b803911ae5cbd7a72559c757ff68de368ed4c3e1be401cf336d4036e598e7afa9d43696d717e1d6c6d91245bf803c160ebf78718b371137d34b0fa2b3fd996ef0a9ad88d4d9d18c4eeece8f2012d0ebeadb91971b67c95b1e3d795393977e1d2bb26ddf7c711aa9459f28fb369162d8c9b824702ecbd00e79741445a24d31dbbbb11114a04444044440444404444044440444404458ddb5b769e9198ea256c638027c4efd968cdde81064969fbf1bff004f400b05a5a8232881c9bd643f7474d4f0e6342df0ed7259018e8da6169c8caeb1948fc2330cbf3ccf915caea252e25c49249b924dc92732493a92bb63c5eeb9dcff000c9ef46f554d73ef3ce5c350d1946cb7ea33407ae67992b1f840b0e42cb1d20f9159326ffc977c5ced5b5546723c976fec5b7a3bd87f4290f8e217889fbd15f36f9b09b7ec96f22b8c96a9f65d5be0919344ec3246e0e63b5b1ea38822e08e209519e1b86396abd553c2d7b4b5c039a75045c15a0ef36e611792005e352cd5e3f67f5874d7cd6d5ba7bc0cada664ecb027c3232f7c0f00626f966083c4105660b562cb097b56bc392e3e1c265d90d764e683e63deb1b36eac77f605b92edfb6377a39aee1e093f5c0c9dfb438f9ebf25a7d7ecd9233ddbc58db23a83d41b67f359f29960d785c793fae7d4fb0d8cb7847a0e3c56f1b8fb38fe900e818c2e7119589bb5beff00111fb2be526c925c0018dc7468fac82def666c91047835738e291dccf003a0190f53c4a9e3de596d5e6d618ebdd70fd95dae6d3a5798e6732a5ad7169ef1b85fe1241b3d96cee357072ea7ba7daad0d6598f77e8d31b782523013c992fb273c803849e4b80edb6015352d232fd2261e4448e560d8ede4bd19c72c79dd763d920a2f34ee96fed650d9ac7f7b08fee2437681f81dab3d3c3d0aed1ba9da1d1d6d9a1ddccc7fba908049fc0ed1ff3e8172cb8ae2bcca56dc888b9ac222202222022220222c5ef2ede868a9dd5131f0b720d1ed3dc7d96b47127e199360094936326e7002e72038ad6b6aefed04170ea86bddfab17da1f2bb7c20f990b836f5efb55d7bc991e5b1678606122368b8b5ffc477e23d6c00365848df7d568c787f2e773fc3aa6f1f6b92bc16d2b0423fc4759f27a0f61a7cf12e61b47683e5797bdee7bddab9c4b9c7cc9cd42f6f5512eb3198f856dda8baa5ca4b2a5ca51a5ab95e31e1dec9197a7bc150019a48cbf9f31911eaa115797e62ca58da3ebeb55153136f11b91c7ebe7f257015e2adbfb32de4fd0ea831eeb413d98fbe8d77dc7f4b1363d0df805df9abca786e2cbbd7657bc9fa55288e475e682cc7df5732df66fea480413cda4f159f9b0ff00a75e3be9bad96a1bfbbd30d28644f8fbe7bc63c18b096b45c071758daeec8793b92db669435a5c7402e7eb9ae0bda7d348cae6d43c9c352db6139e07461a006f2696b865cc38f159f5b69e292e736c950769eea7941752c62171b3f0b9ce9b5d43dc40361f7708bf30bad4356c96364b1b8398f687b1c342d22e0fb979876db7ecc95ddfb3e988a7640e160d8d8f8bac658db8f30e38bf7ba29d49da3afc8c64bb71ced2a8bbbdab54d02c1e5b28eb8d8d2e3eafc4b5c69b2ebbdb26c0c6d15ac1e28835b27ec1cafe84dfdeb923dba8f50b5f1dde2f3f29aa8d925cdb97cfebe6a50a3680aa6b97455bb6ebf68f5b48030bc4d18fb92dcd8726bfda6fc4745d3762f6ad4728fb60f81dc4106469f22c04fbda179faeab64842e7971e3579958f57ecadab0d4b3bc8246c8cbdaed3a1e21c3569e873578bcb7bbfbcb350ceda980e79096326cc959c9dd47076a3e07d2fb176a47550475111bb246870e63983c9c08208e04159f3c3a5d31cb6bd4445cd611110179dbb5dde6755d6ba169fb1a673a368e0e9065238f5c40b4741f88aef7b72bbb8a69a6ff000a27c9fe9693f92f25c8f2492e24b89bb89d4926e49ea4e6bb70cefb73e4be8f555b5ca3685285a9ca27b62196a3eaca8b71e6ab8f82af0d9c470398fcff008fbd4a56ee628ded576f0a27b54589dad404ef0b4df81f687e7e9f5c14c5aa8735574948dc8ebae9fcd5c34ab3a736f09d3874e9f5e5c95c34d94c469701667747780d0d5c73e659eccad17ce275b165c48b070ead038ac202bea9b373488f504b2094b4348732c1f71a3ae2edb1e22d9fb968ddb5d035f47092435cca86603c4ddaf0e039e59fa7a28fb1bde0ef607523cfda53f8a3e6e85c721fb8e387a02c58eedd6acfff008d80f8439f2bbd3001f02ef7ac571d5d35f14eaca3985751bdcdb079f87f0f995deb73981f41472b01c4d86302e6e4963703c1200d7091a715c49cbaef637b44494261bf8a9e57823f0bdc6469f2bb9c3f754569f938f6db68afa46cb1c91bc5d923709bf2703f915e63da14ce8647c4ef6a27ba3775c248bfadafeabd5cd60b1e4579ff00b5cd9060af2eb786760783f89b66bbe18575e1cbbe9e7e73b6da23dd6e6be87711f0472fa1778e6957c2552d72fa5590a71aec9fd1fb6c12ca8a471c9844b1faf8640390b861f3795c59c735bd762755dded48dbfe2b268cff00a1b27ce25cf926f1ab637bbd1c888b1bb88888354ed4eabbbd975246ae6b63f47bdac77fb5c4af34bf55debb73aac3451b2f6c730bf50d63cfcecb829372b570cfa5c73f2fac6a9f05c2a230a42eb2eea23c04792971dc03cb3b7cfe0ab63815f0c3c41415954bc2fb16847236faf42aa214a50615416ab80d5496a8d256ae65d4919b8ea35faf45516aa1c08371afcc7d7e4a34258cfc5560a88db5e07ebd14cd4192ddddb2ea2aa8aa5b7380f8da357c67291be76cc7e20392df3b69607b69678dc1d1bd928046843844f691d0b6e57332b6da1aefd2364494eece4a19192c7ccc0e2587cc30c8ef26e05c7971f6d1f1f2d671ad52cd89ad278817f3d0fc6eb33b9fbc3ff4fad6cc49ee64fb39c0b9f01393ac352d39f9621c56b9467db6feabae3c9d9fcc395723b10b725c1e9d9d58eabd4cd70c8820839823307910792e7bdb6eccc746c9c0f141234fee3fc0ef4b969f454f637bc5dec0ea290fda538bc77d5d05ec3cf01387c8b16e7bc7b3c5452cf01fef237b41e44b4807d0e6a31babb7999e3adcaf2dccc51b029483845c58e847223fe550b6b2292aa5f1cbe34a91049aacaeea6d434d5904e0dbbb9a32e3f80ddb27fb0b82c5cc146e176bff0077ff00654ab47b351586c0aaef6960941be38637dff698d3f9abf589a044441c1bb70db7ded6369da6eda7658ff98fb39dee6867c57386a9b68d5ba595f23cddf23dcf71fc4e25c7e6a262dd84d4d33dbba963d14a05d451aac15d10771c97d603c54ac5f0f5c901a6cef317f51ff042ac956b524b6c791d7a1c94c1f708246854909897d414615416a9aca83f5f5eaa1285991b1d0e9e7ff2a46725f256aa58eb8ea3e3cbde826055eec6af6c13b5effeade1d0cdd61906090feedc3fcd8163b12ab51a28b37349974fb5113a1a9c0fc8ddd13f96269b0f4c42de454d3479aab6ec5de53c338f6b0f74f3a9ef600d6824f37446177525cbeb64c6d0e1c4023d73f9ac766bb3d9e3cbaa6ff2bdddadac692b20a9bf858f024eb13bc325f9d9a6e3a80bd28f17cf87e457971ccb8b2ef5d986d5fd23674588ddf15e07e7737658349ea58587d556b87c9c3c64e21be7b3fb9aeab8ad9094bc7948049974f1d960085d1fb68a2c15f1c9fe3416fde8dc6ff07b7dcb9cb96cc2ee4af2f39ab51b82a6f9aaaa74f55f380b6a74eaac892dba88a55403e07752d1f3572fa6372310b8d467619136bf3e8ad2d9740572ea96f675cf8f2c35d534f4bf635b44cdb2a107588be2f469bb7dcc7347a2ddd725fe8f1b483a96a29fef472893cdb2340f9c47de175a59b3fbaba63e0444554bc7a7552b5437cd4d1e6bd08cca97d257d92f6568f9548c8b485f0b8f02b1acaa232272e6a72f36ba6d08eb6636b1c955432dc2b5aba8b8d01f350d0cd654eafa93aedb66b12adae5651cb75331eae2ed8be15446f555d052f511cb3f7f9295ea3289524d8f35231cadb16a3dca481ca0667628ef23aaa739dd82a23e367c570f0073744f77fa072561b24f80b7f55ce6fa64efcd4db22b4435304cef65b20127f94ef04bff006dee5052b3049332f7c12165f812dc89bf5b2cfcb3593d0f8796e69761aba47627585b2d4c04e4e6b2568ead385e7d43d9ee5ce58e056cfd9ad5777b4e0e5207c67c8b1c47fb9ad5cab5f34de15b2f6e74e30524bc44ae8fd1cc2eff00e6b8d4a335ddfb6b803a81aee2c9e270f325d1fca42b84cfed7aff0015a38bed78bc9e56b5a7c2ae4da9d988e733865f805b5fcd432ea3a67eeb2824cc9273275253930b93afc7e7c78a5baefebf4a5d2d9b607dae27e26fcd4799cb8027e68355535c7828c31d1cdcd79356ba8ff47baac35d3c5faf4f8bd59237f290fb977e5e69ec46a4336b4409feb23959eb871fff0035e965c797ee30f02222e6b3c7dc7eb9aba8f5f5445be33a66ac7ed0d7eb92229cbc0b293457945ec144549e4be1673715153a22a5f2b7a6429f4574dd511758a251aa906888ac3e7d7cd50ed7d51112825d47d735f63d7eb9222a896a7d83eaa2d9bf7ff6ff0020be22e5cde9b3e1fdd57ecfe2b67dcafed0a4ff00347fec88b8d7a19fdb7f8e8fdb0ff673bfcd87ff002b5705975faea88bb70fdaf1793ca07fb5fba7e6d56ee445d5c9433daf44768111522f7d364ecbff00b5a8ff00cd3ff8e45ea6445c397cbae1e04445c977ffd9, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `AddressID` int(10) NOT NULL,
  `ADD_Street` varchar(255) DEFAULT NULL,
  `ADD_Barangay` varchar(100) DEFAULT NULL,
  `ADD_City` varchar(100) DEFAULT NULL,
  `ADD_Province` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`AddressID`, `ADD_Street`, `ADD_Barangay`, `ADD_City`, `ADD_Province`) VALUES
(1, 'MArikina', 'San Rafael (Pob.)', 'San Narciso', 'Zambales');

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `AppointmentID` int(10) NOT NULL,
  `PatientID` int(10) DEFAULT NULL,
  `StatusID` int(10) DEFAULT NULL,
  `APP_ChosenDate` date DEFAULT NULL,
  `APP_ChosenTime` time DEFAULT NULL,
  `APP_Submission` datetime DEFAULT current_timestamp(),
  `APP_QR` longblob DEFAULT NULL,
  `APP_QRPath` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `appointmentlist`
-- (See below for the actual view)
--
CREATE TABLE `appointmentlist` (
`AppointmentID` int(10)
,`App_ChosenDate` date
,`App_ChosenTime` time
,`App_Submission` datetime
,`App_QR` longblob
,`AccountID` int(10)
,`PatientID` int(10)
,`AddressID` int(10)
,`STAT_Name` varchar(30)
,`Services` mediumtext
,`Descriptions` mediumtext
,`Total_Duration` time
,`APP_QRPath` varchar(255)
,`ACC_Cookies` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `appointmentservices`
--

CREATE TABLE `appointmentservices` (
  `AppointmentServicesID` int(10) NOT NULL,
  `AppointmentID` int(10) NOT NULL,
  `ServicesID` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointmentservices`
--

INSERT INTO `appointmentservices` (`AppointmentServicesID`, `AppointmentID`, `ServicesID`) VALUES
(1, 1, 16),
(2, 1, 20),
(3, 2, 15);

-- --------------------------------------------------------

--
-- Stand-in structure for view `billinglist`
-- (See below for the actual view)
--
CREATE TABLE `billinglist` (
`BILL_Date` date
,`Amount` decimal(15,2)
,`Services` mediumtext
,`Payment` decimal(15,2)
,`APP_ChosenDate` date
,`APP_ChosenTime` time
,`AppointmentID` int(10)
,`STAT_Name` varchar(30)
,`PM_Name` varchar(30)
,`DisplayName` varchar(215)
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
  `BILL_Date` date NOT NULL,
  `Amount` decimal(15,2) NOT NULL,
  `Payment` decimal(15,2) NOT NULL
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

--
-- Dumping data for table `name`
--

INSERT INTO `name` (`NameID`, `N_FirstName`, `N_LastName`, `N_MiddleName`, `N_Suffix`) VALUES
(1, 'Mark Anthony', 'Sia', 'Marko', '');

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

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`PatientID`, `NameID`, `AddressID`, `AccountID`, `P_Gender`, `P_DOB`, `P_Age`, `P_FacebookAccount`, `P_ContactNo`) VALUES
(1, 1, 1, 1, 'male', '2003-07-09', 22, '0', '+639916141697');

-- --------------------------------------------------------

--
-- Stand-in structure for view `patientlist`
-- (See below for the actual view)
--
CREATE TABLE `patientlist` (
`PatientID` int(10)
,`DisplayName` varchar(215)
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
,`ACC_Username` varchar(30)
,`ACC_Password` varchar(255)
,`ACC_Email` varchar(320)
,`ACC_DateCreated` date
,`ACC_Cookies` varchar(255)
,`ACC_Profile` longblob
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

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`ServiceID`, `SER_Name`, `SER_Details`, `SER_Duration`) VALUES
(13, 'Oral Prophylaxis', 'Routine dental cleaning to remove plaque and tartar.', '00:30:00'),
(14, 'Tooth Extraction', 'Removal of a decayed or damaged tooth.', '00:45:00'),
(15, 'Tooth Restoration', 'Filling cavities with dental material.', '00:45:00'),
(16, 'Partial Denture / Complete Den', 'Custom-fit removable replacement for missing teeth.', '00:30:00'),
(17, 'Jacket Crown', 'Crown that covers and protects a damaged tooth.', '00:40:00'),
(18, 'Orthodontic Treatment', 'Appliances to correct teeth alignment.', '01:00:00'),
(19, 'Dental Retainers', 'Used post-braces to maintain teeth position.', '00:20:00'),
(20, 'Dental Appliances', 'Includes night guards, space maintainers, etc.', '00:30:00'),
(21, 'Wisdom Tooth Removal', 'Extraction of impacted or problematic wisdom teeth.', '01:30:00'),
(22, 'Teeth Whitening', 'Cosmetic procedure to lighten teeth color.', '01:00:00'),
(23, 'Veneers', 'Thin shells placed over teeth for cosmetic improvement.', '00:50:00'),
(24, 'Root Canal Treatment', 'Removal of infected pulp inside a tooth.', '01:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `StatusID` int(10) NOT NULL,
  `STAT_Name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`StatusID`, `STAT_Name`) VALUES
(1, 'Active'),
(2, 'Inactive'),
(3, 'Pending'),
(4, 'Active'),
(5, 'Inactive'),
(6, 'Booked'),
(7, 'Complete'),
(8, 'Cancelled'),
(9, 'Reschedule'),
(10, 'Paid'),
(11, 'Unpaid'),
(12, 'Pending');

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

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`UserTypeID`, `UT_Name`) VALUES
(1, 'Patient'),
(2, 'Admin'),
(3, 'Dentist');

-- --------------------------------------------------------

--
-- Structure for view `appointmentlist`
--
DROP TABLE IF EXISTS `appointmentlist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `appointmentlist`  AS SELECT `a`.`AppointmentID` AS `AppointmentID`, `a`.`APP_ChosenDate` AS `App_ChosenDate`, `a`.`APP_ChosenTime` AS `App_ChosenTime`, `a`.`APP_Submission` AS `App_Submission`, `a`.`APP_QR` AS `App_QR`, `d`.`AccountID` AS `AccountID`, `d`.`PatientID` AS `PatientID`, `d`.`AddressID` AS `AddressID`, `e`.`STAT_Name` AS `STAT_Name`, group_concat(`c`.`SER_Name` separator '\n') AS `Services`, group_concat(`c`.`SER_Details` separator '\n') AS `Descriptions`, sec_to_time(sum(time_to_sec(`c`.`SER_Duration`))) AS `Total_Duration`, `a`.`APP_QRPath` AS `APP_QRPath`, `f`.`ACC_Cookies` AS `ACC_Cookies` FROM (((((`appointment` `a` join `appointmentservices` `b` on(`a`.`AppointmentID` = `b`.`AppointmentID`)) join `services` `c` on(`b`.`ServicesID` = `c`.`ServiceID`)) join `patient` `d` on(`a`.`PatientID` = `d`.`PatientID`)) join `status` `e` on(`a`.`StatusID` = `e`.`StatusID`)) join `account` `f` on(`d`.`AccountID` = `f`.`AccountID`)) GROUP BY `a`.`AppointmentID` ;

-- --------------------------------------------------------

--
-- Structure for view `billinglist`
--
DROP TABLE IF EXISTS `billinglist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `billinglist`  AS SELECT `a`.`BILL_Date` AS `BILL_Date`, `a`.`Amount` AS `Amount`, `f`.`Services` AS `Services`, `a`.`Payment` AS `Payment`, `b`.`APP_ChosenDate` AS `APP_ChosenDate`, `b`.`APP_ChosenTime` AS `APP_ChosenTime`, `b`.`AppointmentID` AS `AppointmentID`, `c`.`STAT_Name` AS `STAT_Name`, `d`.`PM_Name` AS `PM_Name`, `e`.`DisplayName` AS `DisplayName` FROM (((((`blling` `a` join `appointment` `b` on(`a`.`AppointmentID` = `b`.`AppointmentID`)) join `status` `c` on(`a`.`StatusID` = `c`.`StatusID`)) join `paymentmethod` `d` on(`a`.`PaymentMethodID` = `d`.`PaymentMethodID`)) join `patientlist` `e` on(`b`.`PatientID` = `e`.`PatientID`)) join `appointmentlist` `f` on(`f`.`AppointmentID` = `a`.`AppointmentID`)) ;

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

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `patientlist`  AS SELECT `a`.`PatientID` AS `PatientID`, concat(`b`.`N_FirstName`,' ',left(`b`.`N_MiddleName`,1),'. ',`b`.`N_LastName`,' ',`b`.`N_Suffix`) AS `DisplayName`, `b`.`N_LastName` AS `N_LastName`, `b`.`N_MiddleName` AS `N_MiddleName`, `b`.`N_Suffix` AS `N_Suffix`, `b`.`N_FirstName` AS `N_FirstName`, `c`.`ADD_Street` AS `ADD_Street`, `c`.`ADD_Barangay` AS `ADD_Barangay`, `c`.`ADD_City` AS `ADD_City`, `c`.`ADD_Province` AS `ADD_Province`, `a`.`P_Gender` AS `P_Gender`, `a`.`P_DOB` AS `P_DOB`, `a`.`P_Age` AS `P_Age`, `a`.`P_FacebookAccount` AS `P_FacebookAccount`, `a`.`P_ContactNo` AS `P_ContactNo`, `d`.`ACC_Username` AS `ACC_Username`, `d`.`ACC_Password` AS `ACC_Password`, `d`.`ACC_Email` AS `ACC_Email`, `d`.`ACC_DateCreated` AS `ACC_DateCreated`, `d`.`ACC_Cookies` AS `ACC_Cookies`, `d`.`ACC_Profile` AS `ACC_Profile` FROM (((`patient` `a` join `name` `b` on(`a`.`NameID` = `b`.`NameID`)) join `address` `c` on(`a`.`AddressID` = `c`.`AddressID`)) join `account` `d` on(`a`.`AccountID` = `d`.`AccountID`)) ;

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
  ADD KEY `Status2` (`StatusID`);

--
-- Indexes for table `appointmentservices`
--
ALTER TABLE `appointmentservices`
  ADD PRIMARY KEY (`AppointmentServicesID`),
  ADD KEY `AppointmentID` (`AppointmentID`),
  ADD KEY `ServicesID` (`ServicesID`);

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
  MODIFY `AccountID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `AddressID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `AppointmentID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `appointmentservices`
--
ALTER TABLE `appointmentservices`
  MODIFY `AppointmentServicesID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `NameID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `ServiceID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `StatusID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `unavailableslots`
--
ALTER TABLE `unavailableslots`
  MODIFY `UnavailableSlotsID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `UserTypeID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `Status2` FOREIGN KEY (`StatusID`) REFERENCES `status` (`StatusID`);

--
-- Constraints for table `appointmentservices`
--
ALTER TABLE `appointmentservices`
  ADD CONSTRAINT `appointmentservices_ibfk_1` FOREIGN KEY (`AppointmentID`) REFERENCES `appointment` (`AppointmentID`),
  ADD CONSTRAINT `appointmentservices_ibfk_2` FOREIGN KEY (`ServicesID`) REFERENCES `services` (`ServiceID`);

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
