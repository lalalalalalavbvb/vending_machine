-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Sep 28, 2026 at 04:29 PM
-- Server version: 8.4.11
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','promptpay') NOT NULL,
  `amount_received` decimal(10,2) NOT NULL DEFAULT '0.00',
  `change_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(30) NOT NULL DEFAULT 'paid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `total_price`, `payment_method`, `amount_received`, `change_amount`, `status`, `created_at`) VALUES
(1, 25.00, 'cash', 1000.00, 975.00, 'paid', '2026-09-28 13:49:42'),
(2, 100.00, 'cash', 100.00, 0.00, 'paid', '2026-09-28 13:55:18'),
(3, 90.00, 'promptpay', 90.00, 0.00, 'paid', '2026-09-28 15:48:30');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`) VALUES
(1, 1, 3, 1, 25.00),
(2, 2, 3, 4, 25.00),
(3, 3, 1, 1, 10.00),
(4, 3, 2, 1, 40.00),
(5, 3, 3, 1, 25.00),
(6, 3, 4, 1, 15.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image_url`, `is_active`, `created_at`) VALUES
(1, NULL, 'รถพยาบาล สำลีแผ่นจากฝ้ายบริสุทธิ์ 50 ก.', 'รถพยาบาล สำลีแผ่นจากฝ้ายบริสุทธิ์ 50 ก.', 10.00, 19, 'http://localhost:8000/uploads/1790601209994-76975cs3si6.webp', 1, '2026-09-28 13:00:42'),
(2, NULL, 'ยาธาตุน้ําขาว ตรากระต่ายบิน 200 มล.', 'บรรเทาอาการปวดท้อง ท้องอืด ท้องเฟ้อ จุกเสียด และช่วยขับลม', 40.00, 12, 'http://localhost:8000/uploads/1790601134668-9u4b0071mk6.jpg', 1, '2026-09-28 13:00:42'),
(3, NULL, 'ยาดม ตราโป๊ยเซียน Mark II', 'ยาดม 2 หัว แก้คัดจมูก วิงเวียนศีรษะ', 25.00, 7, 'http://localhost:8000/uploads/1790601049734-adrb7e5d9m.jpg', 1, '2026-09-28 13:00:42'),
(4, NULL, 'ซาร่า พาราเซตามอล  500 mg', 'ยาบรรเทาปวด ลดไข้', 15.00, 14, 'http://localhost:8000/uploads/1790600868014-tjyi02r4fxj.jpg', 1, '2026-09-28 13:00:42'),
(5, NULL, 'ออรีด้า อาร์.โอ. เกลือแร่ผง ORS', 'ทดแทนการเสียน้ำในร่างกายที่มีอาการท้องร่วงหรือในรายที่มีการอาเจียนมากๆ', 5.00, 20, 'http://localhost:8000/uploads/1790601298974-val1oxbjaq.jpg', 1, '2026-09-28 13:14:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_items_order` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
