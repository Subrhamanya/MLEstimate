-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2022 at 06:10 AM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rems`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`email`, `password`) VALUES
('admin@admin.com', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile_number` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `name`, `mobile_number`, `email`, `address`, `password`) VALUES
(221, 'Subrhamanya', '8765434567', 'mahesh@gmail.com', 'frgthyujty', 'asdf'),
(383, 'Subrhamanya', '9482364667', 'subrhamanya.hn@gmail.com', 'Bhatkal', 'password');

-- --------------------------------------------------------

--
-- Table structure for table `datas`
--

CREATE TABLE `datas` (
  `id` int(11) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `bhk` int(11) DEFAULT NULL,
  `bath` int(11) DEFAULT NULL,
  `area_size` int(11) DEFAULT NULL,
  `price` decimal(19,9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `datas`
--

INSERT INTO `datas` (`id`, `location`, `bhk`, `bath`, `area_size`, `price`) VALUES
(1, 'yeshwanthpur', 2, 2, 1000, '70.000000000'),
(3, 'varthur', 2, 2, 1000, '67.000000000');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `message_type` varchar(20) NOT NULL,
  `confidence` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `email`, `subject`, `message`, `message_type`, `confidence`) VALUES
(1, 'Subrhamanya', 'subrhamanya.hn@gmail.com', 'Complaint', 'There is a small error in the development of project.', 'Negative', '0.566'),
(17, 'Subrhamanya', 'mahesh@gmail.com', 'Complaint', 'Nothing', 'Neutral', '0.999'),
(18, 'Subrhamanya', 'subrhamanya.hn@gmail.com', 'Message', 'Its a good website', 'Positive', '0.977'),
(19, 'Ramesh', 'ram@gmail.com', 'Nothing', 'Very bad website', 'Negative', '1.0');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `c_id` int(11) NOT NULL,
  `sqft` varchar(20) NOT NULL,
  `location` varchar(50) NOT NULL,
  `bhk` int(11) NOT NULL,
  `bath` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `c_id`, `sqft`, `location`, `bhk`, `bath`) VALUES
(43, 221, '1000.0', 'aecs layout', 2, 2),
(44, 221, '1000.0', 'aecs layout', 2, 2),
(45, 383, '1000.0', '8th phase jp nagar', 2, 2),
(46, 383, '1000.0', '9th phase jp nagar', 2, 2),
(51, 383, '1000.0', '1st block jayanagar', 2, 2),
(52, 383, '1000.0', '1st block jayanagar', 2, 2),
(53, 383, '1000.0', '1st block jayanagar', 2, 2),
(55, 383, '1005.0', 'jakkur', 2, 2),
(56, 383, '1000.0', '1st block jayanagar', 3, 2),
(57, 383, '1000.0', 'akshaya nagar', 2, 3),
(58, 383, '1200.0', 'begur road', 2, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile_number` (`mobile_number`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `datas`
--
ALTER TABLE `datas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_name` (`c_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=384;

--
-- AUTO_INCREMENT for table `datas`
--
ALTER TABLE `datas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `fk_name` FOREIGN KEY (`c_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `client` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
