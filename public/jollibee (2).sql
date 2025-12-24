-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2025 at 05:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jollibee`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatmessage`
--

CREATE TABLE `chatmessage` (
  `MaTinNhan` int(11) NOT NULL,
  `MaUser` varchar(20) DEFAULT NULL,
  `ReceiverMaUser` varchar(50) DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL,
  `TinNhan` text NOT NULL,
  `LaTuUser` tinyint(1) DEFAULT 1,
  `ThoiGian` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chatmessage`
--

INSERT INTO `chatmessage` (`MaTinNhan`, `MaUser`, `ReceiverMaUser`, `HoTen`, `TinNhan`, `LaTuUser`, `ThoiGian`) VALUES
(3, 'US005', NULL, 'thien', 'chào bạn', 1, '2025-12-20 16:15:55'),
(10, 'US005', NULL, 'thien', 'thien', 1, '2025-12-22 15:43:11'),
(11, 'US005', NULL, 'thien', 'thien', 1, '2025-12-22 15:43:29'),
(12, NULL, 'US005', 'Jollibee Support', 'hi', 0, '2025-12-22 16:19:55');

-- --------------------------------------------------------

--
-- Table structure for table `combo`
--

CREATE TABLE `combo` (
  `MaCombo` char(10) NOT NULL,
  `TenCombo` varchar(150) NOT NULL,
  `GiaCombo` decimal(10,2) NOT NULL,
  `MoTa` text DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL,
  `TrangThai` enum('hienthi','an') DEFAULT 'hienthi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `combo`
--

INSERT INTO `combo` (`MaCombo`, `TenCombo`, `GiaCombo`, `MoTa`, `HinhAnh`, `TrangThai`) VALUES
('CB001', 'Combo 2 gà + 1 mì nhỏ', 90000.00, 'Combo tiết kiệm', 'cb1.jpg', 'hienthi'),
('CB002', 'Combo burger + nước', 70000.00, 'Burger + nước uống', 'cb2.jpg', 'hienthi'),
('CB003', '1 mỳ+ 1 berger', 99000.00, 'gio gio', 'miysotcay.jpg', 'hienthi'),
('CB004', '1 mỳ+ 1 berger', 99000.00, 'gio gio', 'miysotcay.jpg', 'an');

--
-- Triggers `combo`
--
DELIMITER $$
CREATE TRIGGER `trg_Combo_Before_Insert` BEFORE INSERT ON `combo` FOR EACH ROW BEGIN
    IF NEW.MaCombo IS NULL OR NEW.MaCombo = '' THEN
        SET NEW.MaCombo = (
            SELECT CONCAT('CB', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaCombo, 3) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM Combo
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `combochitiet`
--

CREATE TABLE `combochitiet` (
  `MaComboChiTiet` char(10) NOT NULL,
  `MaCombo` char(10) NOT NULL,
  `MaSanPham` char(10) NOT NULL,
  `SoLuong` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `combochitiet`
--

INSERT INTO `combochitiet` (`MaComboChiTiet`, `MaCombo`, `MaSanPham`, `SoLuong`) VALUES
('CTCB001', 'CB001', 'SP001', 2),
('CTCB002', 'CB001', 'SP003', 1),
('CTCB003', 'CB002', 'SP006', 1),
('CTCB004', 'CB002', 'SP005', 1);

--
-- Triggers `combochitiet`
--
DELIMITER $$
CREATE TRIGGER `trg_ComboChiTiet_Before_Insert` BEFORE INSERT ON `combochitiet` FOR EACH ROW BEGIN
    IF NEW.MaComboChiTiet IS NULL OR NEW.MaComboChiTiet = '' THEN
        SET NEW.MaComboChiTiet = (
            SELECT CONCAT('CTCB', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaComboChiTiet, 5) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM ComboChiTiet
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `danhgia`
--

CREATE TABLE `danhgia` (
  `MaDanhGia` int(11) NOT NULL,
  `MaDonHang` char(10) NOT NULL,
  `MaUser` char(10) NOT NULL,
  `SoSao` int(11) NOT NULL CHECK (`SoSao` between 1 and 5),
  `NoiDung` text DEFAULT NULL,
  `NgayDanhGia` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danhgia`
--

INSERT INTO `danhgia` (`MaDanhGia`, `MaDonHang`, `MaUser`, `SoSao`, `NoiDung`, `NgayDanhGia`) VALUES
(1, 'DH012', 'US005', 3, 'csvzbvzdb', '2025-12-23 23:06:47'),
(2, 'DH008', 'US005', 5, 'ngu', '2025-12-23 23:35:02'),
(3, 'DH014', 'US005', 5, 'ngu nhu bò', '2025-12-24 00:17:39'),
(4, 'DH034', 'US005', 5, 'nguy', '2025-12-24 11:36:59');

-- --------------------------------------------------------

--
-- Table structure for table `danhmuc`
--

CREATE TABLE `danhmuc` (
  `MaDanhMuc` char(10) NOT NULL,
  `TenDanhMuc` varchar(100) NOT NULL,
  `MoTa` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danhmuc`
--

INSERT INTO `danhmuc` (`MaDanhMuc`, `TenDanhMuc`, `MoTa`) VALUES
('DM001', 'Gà rán', 'Các món gà rán'),
('DM002', 'Mì Ý', 'Các món mì'),
('DM003', 'Nước uống', 'Các loại nước'),
('DM004', 'Burger', 'Các loại burger'),
('DM005', 'Tráng Miệng', 'các món tráng miệng');

--
-- Triggers `danhmuc`
--
DELIMITER $$
CREATE TRIGGER `trg_DanhMuc_Before_Insert` BEFORE INSERT ON `danhmuc` FOR EACH ROW BEGIN
    IF NEW.MaDanhMuc IS NULL OR NEW.MaDanhMuc = '' THEN
        SET NEW.MaDanhMuc = (
            SELECT CONCAT('DM', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaDanhMuc, 3) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM DanhMuc
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donhang`
--

CREATE TABLE `donhang` (
  `MaDonHang` char(10) NOT NULL,
  `MaUser` char(10) DEFAULT NULL,
  `MaNhanVien` char(10) DEFAULT NULL,
  `TongTien` decimal(12,2) NOT NULL,
  `TrangThai` enum('cho_duyet','da_nhan','dang_giao','hoan_thanh','huy') DEFAULT 'cho_duyet',
  `LyDoHuy` text DEFAULT NULL,
  `NgayDat` datetime DEFAULT current_timestamp(),
  `HinhThucThanhToan` varchar(50) NOT NULL DEFAULT 'shipcode',
  `MaGiamGia` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `donhang`
--

INSERT INTO `donhang` (`MaDonHang`, `MaUser`, `MaNhanVien`, `TongTien`, `TrangThai`, `LyDoHuy`, `NgayDat`, `HinhThucThanhToan`, `MaGiamGia`) VALUES
('DH001', 'US003', 'US002', 125000.00, 'da_nhan', NULL, '2025-11-28 19:37:23', 'shipcode', NULL),
('DH003', 'US005', NULL, 0.00, 'huy', NULL, '2025-12-05 21:27:27', 'shipcode', NULL),
('DH004', 'US005', NULL, 163000.00, 'hoan_thanh', NULL, '2025-12-05 21:38:56', 'shipcode', NULL),
('DH005', 'US005', 'US002', 70000.00, 'dang_giao', NULL, '2025-12-05 21:43:04', 'shipcode', NULL),
('DH006', NULL, NULL, 0.00, 'huy', NULL, '2025-12-05 21:45:51', 'shipcode', NULL),
('DH007', 'US005', NULL, 138000.00, 'huy', NULL, '2025-12-05 21:52:47', 'shipcode', NULL),
('DH008', 'US005', NULL, 200000.00, 'hoan_thanh', NULL, '2025-12-06 08:51:25', 'shipcode', NULL),
('DH009', 'US005', NULL, 200000.00, 'huy', 'nghu', '2025-12-06 08:57:48', 'shipcode', NULL),
('DH010', 'US005', NULL, 200000.00, 'cho_duyet', NULL, '2025-12-06 09:28:29', 'shipcode', NULL),
('DH011', 'US005', NULL, 200000.00, 'cho_duyet', NULL, '2025-12-06 09:28:38', 'shipcode', NULL),
('DH012', 'US005', NULL, 200000.00, 'hoan_thanh', NULL, '2025-12-06 09:46:35', 'shipcode', NULL),
('DH013', NULL, NULL, 0.00, 'huy', NULL, '2025-12-06 09:56:41', 'shipcode', NULL),
('DH014', 'US005', NULL, 268000.00, 'hoan_thanh', NULL, '2025-12-06 10:06:42', 'shipcode', NULL),
('DH015', 'US005', NULL, 0.00, 'huy', NULL, '2025-12-06 10:13:45', 'shipcode', NULL),
('DH016', 'US005', NULL, 0.00, 'huy', NULL, '2025-12-09 19:05:17', 'shipcode', NULL),
('DH017', NULL, NULL, 0.00, '', NULL, '2025-12-09 19:17:12', 'momo', NULL),
('DH018', 'US005', NULL, 0.00, 'huy', NULL, '2025-12-09 19:29:33', 'momo', NULL),
('DH019', 'US005', NULL, 0.00, 'huy', NULL, '2025-12-19 13:19:43', 'momo', NULL),
('DH020', 'US006', NULL, 38000.00, 'huy', NULL, '2025-12-19 13:31:20', 'nganhang', NULL),
('DH021', 'US006', NULL, 198000.00, 'cho_duyet', NULL, '2025-12-19 13:33:02', 'momo', NULL),
('DH022', 'US001', NULL, 160000.00, 'cho_duyet', NULL, '2025-12-19 20:32:15', 'momo', NULL),
('DH023', 'US001', NULL, 160000.00, 'cho_duyet', NULL, '2025-12-19 20:40:07', 'momo', NULL),
('DH024', 'US001', NULL, 160000.00, 'cho_duyet', NULL, '2025-12-19 21:22:17', 'momo', NULL),
('DH025', NULL, NULL, 0.00, '', NULL, '2025-12-19 21:31:43', 'momo', NULL),
('DH026', NULL, NULL, 0.00, '', NULL, '2025-12-19 21:40:39', 'momo', NULL),
('DH027', NULL, NULL, 0.00, 'da_nhan', NULL, '2025-12-22 17:45:29', 'momo', NULL),
('DH028', NULL, NULL, 0.00, 'hoan_thanh', NULL, '2025-12-22 19:35:48', 'momo', NULL),
('DH029', 'US001', 'US002', 70000.00, 'da_nhan', NULL, '2025-12-23 00:02:44', 'momo', NULL),
('DH030', 'US005', 'US002', 230000.00, 'da_nhan', NULL, '2025-12-23 00:19:34', 'momo', NULL),
('DH031', NULL, NULL, 0.00, '', NULL, '2025-12-23 19:44:10', 'momo', NULL),
('DH032', NULL, NULL, 0.00, '', NULL, '2025-12-23 21:26:43', 'momo', NULL),
('DH033', 'US005', NULL, 0.00, 'huy', NULL, '2025-12-23 23:12:52', 'momo', 'SALE30'),
('DH034', 'US005', NULL, 38000.00, 'hoan_thanh', NULL, '2025-12-23 23:34:11', 'momo', NULL),
('DH035', 'US005', NULL, 145000.00, 'huy', 'jfghsd', '2025-12-24 10:59:06', 'momo', NULL);

--
-- Triggers `donhang`
--
DELIMITER $$
CREATE TRIGGER `trg_DonHang_Before_Insert` BEFORE INSERT ON `donhang` FOR EACH ROW BEGIN
    IF NEW.MaDonHang IS NULL OR NEW.MaDonHang = '' THEN
        SET NEW.MaDonHang = (
            SELECT CONCAT('DH', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaDonHang, 3) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM DonHang
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donhangchitiet`
--

CREATE TABLE `donhangchitiet` (
  `MaChiTiet` char(10) NOT NULL,
  `MaDonHang` char(10) NOT NULL,
  `LoaiSanPham` enum('sanpham','combo') NOT NULL,
  `MaSanPham` char(10) DEFAULT NULL,
  `MaCombo` char(10) DEFAULT NULL,
  `SoLuong` int(11) NOT NULL,
  `DonGia` decimal(10,2) NOT NULL,
  `ThanhTien` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `donhangchitiet`
--

INSERT INTO `donhangchitiet` (`MaChiTiet`, `MaDonHang`, `LoaiSanPham`, `MaSanPham`, `MaCombo`, `SoLuong`, `DonGia`, `ThanhTien`) VALUES
('CTDH001', 'DH001', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH002', 'DH001', 'combo', NULL, 'CB001', 1, 90000.00, 90000.00),
('CTDH003', 'DH003', '', 'SP002', NULL, 5, 5000.00, 25000.00),
('CTDH004', 'DH016', 'sanpham', 'SP003', NULL, 3, 30000.00, 90000.00),
('CTDH005', 'DH016', 'sanpham', 'SP004', NULL, 1, 45000.00, 45000.00),
('CTDH006', 'DH016', 'sanpham', 'SP008', NULL, 1, 40000.00, 40000.00),
('CTDH007', 'DH016', 'sanpham', 'SP006', NULL, 1, 55000.00, 55000.00),
('CTDH008', 'DH016', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH009', 'DH017', 'sanpham', 'SP003', NULL, 3, 30000.00, 90000.00),
('CTDH010', 'DH017', 'sanpham', 'SP004', NULL, 1, 45000.00, 45000.00),
('CTDH011', 'DH017', 'sanpham', 'SP008', NULL, 1, 40000.00, 40000.00),
('CTDH012', 'DH017', 'sanpham', 'SP006', NULL, 1, 55000.00, 55000.00),
('CTDH013', 'DH018', 'sanpham', 'SP003', NULL, 3, 30000.00, 90000.00),
('CTDH014', 'DH018', 'sanpham', 'SP004', NULL, 1, 45000.00, 45000.00),
('CTDH015', 'DH018', 'sanpham', 'SP008', NULL, 1, 40000.00, 40000.00),
('CTDH016', 'DH018', 'sanpham', 'SP006', NULL, 1, 55000.00, 55000.00),
('CTDH017', 'DH019', 'sanpham', 'SP003', NULL, 3, 30000.00, 90000.00),
('CTDH018', 'DH019', 'sanpham', 'SP004', NULL, 1, 45000.00, 45000.00),
('CTDH019', 'DH019', 'sanpham', 'SP008', NULL, 1, 40000.00, 40000.00),
('CTDH020', 'DH019', 'sanpham', 'SP006', NULL, 1, 55000.00, 55000.00),
('CTDH021', 'DH020', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH022', 'DH021', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH023', 'DH021', 'combo', NULL, 'CB001', 1, 90000.00, 90000.00),
('CTDH024', 'DH021', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH025', 'DH022', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH026', 'DH022', 'combo', NULL, 'CB001', 1, 90000.00, 90000.00),
('CTDH027', 'DH023', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH028', 'DH023', 'combo', NULL, 'CB001', 1, 90000.00, 90000.00),
('CTDH029', 'DH024', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH030', 'DH024', 'combo', NULL, 'CB001', 1, 90000.00, 90000.00),
('CTDH031', 'DH025', 'combo', NULL, 'CB002', 3, 70000.00, 210000.00),
('CTDH032', 'DH026', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH033', 'DH027', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH034', 'DH027', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH035', 'DH028', 'combo', NULL, 'CB003', 1, 99000.00, 99000.00),
('CTDH036', 'DH028', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH037', 'DH028', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH038', 'DH029', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH039', 'DH030', 'sanpham', 'SP003', NULL, 3, 30000.00, 90000.00),
('CTDH040', 'DH030', 'sanpham', 'SP004', NULL, 1, 45000.00, 45000.00),
('CTDH041', 'DH030', 'sanpham', 'SP008', NULL, 1, 40000.00, 40000.00),
('CTDH042', 'DH030', 'sanpham', 'SP006', NULL, 1, 55000.00, 55000.00),
('CTDH043', 'DH031', 'sanpham', 'SP003', NULL, 1, 30000.00, 30000.00),
('CTDH044', 'DH031', 'sanpham', 'SP004', NULL, 1, 45000.00, 45000.00),
('CTDH045', 'DH032', 'combo', NULL, 'CB002', 2, 70000.00, 140000.00),
('CTDH046', 'DH033', 'combo', NULL, 'CB003', 1, 99000.00, 99000.00),
('CTDH047', 'DH033', 'combo', NULL, 'CB002', 1, 70000.00, 70000.00),
('CTDH048', 'DH034', 'sanpham', 'SP002', NULL, 1, 38000.00, 38000.00),
('CTDH049', 'DH035', 'sanpham', 'SP006', NULL, 1, 55000.00, 55000.00),
('CTDH050', 'DH035', 'sanpham', 'SP005', NULL, 1, 15000.00, 15000.00),
('CTDH051', 'DH035', 'sanpham', 'SP003', NULL, 1, 30000.00, 30000.00),
('CTDH052', 'DH035', 'sanpham', 'SP004', NULL, 1, 45000.00, 45000.00);

--
-- Triggers `donhangchitiet`
--
DELIMITER $$
CREATE TRIGGER `trg_DonHangChiTiet_Before_Insert` BEFORE INSERT ON `donhangchitiet` FOR EACH ROW BEGIN
    IF NEW.MaChiTiet IS NULL OR NEW.MaChiTiet = '' THEN
        SET NEW.MaChiTiet = (
            SELECT CONCAT('CTDH', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaChiTiet, 5) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM DonHangChiTiet
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donhangcombochitiet`
--

CREATE TABLE `donhangcombochitiet` (
  `MaCTCombo` char(10) NOT NULL,
  `MaChiTiet` char(10) NOT NULL,
  `MaSanPham` char(10) NOT NULL,
  `SoLuong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `donhangcombochitiet`
--

INSERT INTO `donhangcombochitiet` (`MaCTCombo`, `MaChiTiet`, `MaSanPham`, `SoLuong`) VALUES
('CTCBX001', 'CTDH002', 'SP004', 1);

--
-- Triggers `donhangcombochitiet`
--
DELIMITER $$
CREATE TRIGGER `trg_DonHangComboChiTiet_Before_Insert` BEFORE INSERT ON `donhangcombochitiet` FOR EACH ROW BEGIN
    IF NEW.MaCTCombo IS NULL OR NEW.MaCTCombo = '' THEN
        SET NEW.MaCTCombo = (
            SELECT CONCAT('CTCBX', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaCTCombo, 6) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM DonHangComboChiTiet
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `MaFeedback` int(11) NOT NULL,
  `MaUser` varchar(50) DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL,
  `DienThoai` varchar(20) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `LoaiGopY` enum('chat_luong_dich_vu','chat_luong_mon_an','giao_hang','nhan_vien','khac') NOT NULL,
  `NoiDung` text NOT NULL,
  `TrangThai` enum('moi','dang_xu_ly','da_giai_quyet') DEFAULT 'moi',
  `AdminReply` text DEFAULT NULL,
  `ThoiGian` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`MaFeedback`, `MaUser`, `HoTen`, `DienThoai`, `Email`, `LoaiGopY`, `NoiDung`, `TrangThai`, `AdminReply`, `ThoiGian`) VALUES
(1, NULL, 'thien', '0962320196', 'thien@gmail.com', 'nhan_vien', 'helo', 'moi', NULL, '2025-12-22 08:13:10'),
(2, 'US005', 'thien', '0962320196', 'thien@gmail.com', 'giao_hang', 'do', 'moi', NULL, '2025-12-22 08:43:50'),
(3, 'US005', 'thien', '0962320196', 'thien@gmail.com', 'nhan_vien', 'dơ', 'moi', NULL, '2025-12-22 08:52:50');

-- --------------------------------------------------------

--
-- Table structure for table `giamgia`
--

CREATE TABLE `giamgia` (
  `MaGiamGia` varchar(20) NOT NULL,
  `PhanTram` int(11) NOT NULL,
  `MoTa` varchar(255) DEFAULT NULL,
  `NgayBatDau` date DEFAULT NULL,
  `NgayHetHan` date DEFAULT NULL,
  `TrangThai` enum('hienthi','an') DEFAULT 'hienthi',
  `GiaToiThieu` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `giamgia`
--

INSERT INTO `giamgia` (`MaGiamGia`, `PhanTram`, `MoTa`, `NgayBatDau`, `NgayHetHan`, `TrangThai`, `GiaToiThieu`) VALUES
('GIAM20', 20, 'Giảm 20% cho đơn trên 100k', '2022-12-30', '2025-12-26', 'an', NULL),
('SALE23', 23, 'dfsa', '2025-12-23', '2025-12-26', 'hienthi', NULL),
('SALE30', 30, 'fghđghhjdfgdf', '2025-12-21', '2025-12-24', 'hienthi', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `giohang`
--

CREATE TABLE `giohang` (
  `MaGioHang` char(10) NOT NULL,
  `MaUser` char(10) NOT NULL,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `TrangThai` enum('dang_su_dung','da_dat_hang') DEFAULT 'dang_su_dung'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `giohang`
--

INSERT INTO `giohang` (`MaGioHang`, `MaUser`, `NgayTao`, `TrangThai`) VALUES
('GH001', 'US004', '0000-00-00 00:00:00', 'dang_su_dung'),
('GH002', 'US003', '2025-12-05 20:13:07', 'dang_su_dung'),
('GH003', 'US005', '2025-12-05 21:08:03', 'da_dat_hang'),
('GH004', 'US005', '2025-12-05 21:27:21', 'da_dat_hang'),
('GH005', 'US005', '2025-12-05 21:32:22', 'da_dat_hang'),
('GH006', 'US005', '2025-12-05 21:42:56', 'da_dat_hang'),
('GH007', 'US005', '2025-12-05 21:45:45', 'da_dat_hang'),
('GH008', 'US005', '2025-12-05 21:52:39', 'da_dat_hang'),
('GH009', 'US006', '2025-12-19 13:30:59', 'dang_su_dung'),
('GH010', 'US001', '2025-12-19 20:31:59', 'da_dat_hang'),
('GH011', 'US001', '2025-12-19 21:31:34', 'da_dat_hang'),
('GH012', 'US001', '2025-12-19 21:40:26', 'da_dat_hang'),
('GH013', 'US001', '2025-12-22 16:34:50', 'da_dat_hang'),
('GH014', 'US008', '2025-12-22 17:45:07', 'da_dat_hang'),
('GH015', 'US008', '2025-12-22 17:45:38', 'da_dat_hang'),
('GH016', 'US005', '2025-12-23 19:43:44', 'da_dat_hang'),
('GH017', 'US005', '2025-12-23 20:42:39', 'da_dat_hang'),
('GH018', 'US005', '2025-12-23 23:12:29', 'da_dat_hang'),
('GH019', 'US005', '2025-12-23 23:34:00', 'da_dat_hang'),
('GH020', 'US005', '2025-12-24 08:37:04', 'da_dat_hang'),
('GH021', 'US010', '2025-12-24 11:13:17', 'dang_su_dung'),
('GH022', 'US001', '2025-12-24 11:40:00', 'dang_su_dung');

--
-- Triggers `giohang`
--
DELIMITER $$
CREATE TRIGGER `trg_GioHang_Before_Insert` BEFORE INSERT ON `giohang` FOR EACH ROW BEGIN
    IF NEW.MaGioHang IS NULL OR NEW.MaGioHang = '' THEN
        SET NEW.MaGioHang = (
            SELECT CONCAT('GH', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaGioHang, 3) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM giohang
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `giohangchitiet`
--

CREATE TABLE `giohangchitiet` (
  `MaChiTiet` char(10) NOT NULL,
  `MaGioHang` char(10) NOT NULL,
  `LoaiSanPham` enum('sanpham','combo') NOT NULL,
  `MaSanPham` char(10) DEFAULT NULL,
  `MaCombo` char(10) DEFAULT NULL,
  `SoLuong` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `giohangchitiet`
--

INSERT INTO `giohangchitiet` (`MaChiTiet`, `MaGioHang`, `LoaiSanPham`, `MaSanPham`, `MaCombo`, `SoLuong`) VALUES
('CTGH001', 'GH003', 'combo', NULL, 'CB001', 1),
('CTGH002', 'GH003', 'combo', NULL, 'CB002', 2),
('CTGH003', 'GH003', 'sanpham', 'SP001', NULL, 1),
('CTGH004', 'GH003', 'sanpham', 'SP002', NULL, 1),
('CTGH005', 'GH003', 'sanpham', 'SP003', NULL, 1),
('CTGH006', 'GH004', 'sanpham', 'SP001', NULL, 1),
('CTGH007', 'GH005', 'sanpham', 'SP001', NULL, 1),
('CTGH008', 'GH005', 'sanpham', 'SP002', NULL, 1),
('CTGH009', 'GH005', 'combo', NULL, 'CB001', 1),
('CTGH010', 'GH006', 'combo', NULL, 'CB002', 1),
('CTGH011', 'GH007', 'sanpham', 'SP002', NULL, 1),
('CTGH014', 'GH008', 'sanpham', 'SP003', NULL, 3),
('CTGH015', 'GH008', 'sanpham', 'SP004', NULL, 1),
('CTGH016', 'GH008', 'sanpham', 'SP008', NULL, 1),
('CTGH017', 'GH008', 'sanpham', 'SP006', NULL, 1),
('CTGH018', 'GH009', 'sanpham', 'SP002', NULL, 1),
('CTGH019', 'GH009', 'combo', NULL, 'CB001', 1),
('CTGH020', 'GH009', 'combo', NULL, 'CB002', 1),
('CTGH021', 'GH010', 'combo', NULL, 'CB002', 1),
('CTGH022', 'GH010', 'combo', NULL, 'CB001', 1),
('CTGH023', 'GH011', 'combo', NULL, 'CB002', 3),
('CTGH024', 'GH012', 'sanpham', 'SP002', NULL, 1),
('CTGH025', 'GH013', 'combo', NULL, 'CB002', 1),
('CTGH026', 'GH014', 'sanpham', 'SP002', NULL, 1),
('CTGH027', 'GH014', 'combo', NULL, 'CB002', 1),
('CTGH028', 'GH015', 'combo', NULL, 'CB003', 1),
('CTGH029', 'GH015', 'combo', NULL, 'CB002', 1),
('CTGH030', 'GH015', 'sanpham', 'SP002', NULL, 1),
('CTGH031', 'GH016', 'sanpham', 'SP003', NULL, 1),
('CTGH032', 'GH016', 'sanpham', 'SP004', NULL, 1),
('CTGH033', 'GH017', 'combo', NULL, 'CB002', 2),
('CTGH034', 'GH018', 'combo', NULL, 'CB003', 1),
('CTGH035', 'GH018', 'combo', NULL, 'CB002', 1),
('CTGH036', 'GH019', 'sanpham', 'SP002', NULL, 1),
('CTGH039', 'GH020', 'sanpham', 'SP006', NULL, 1),
('CTGH040', 'GH020', 'sanpham', 'SP005', NULL, 1),
('CTGH041', 'GH020', 'sanpham', 'SP003', NULL, 1),
('CTGH042', 'GH020', 'sanpham', 'SP004', NULL, 1),
('CTGH043', 'GH021', 'sanpham', 'SP002', NULL, 1),
('CTGH044', 'GH021', 'combo', NULL, 'CB003', 1),
('CTGH045', 'GH022', 'combo', NULL, 'CB002', 1);

--
-- Triggers `giohangchitiet`
--
DELIMITER $$
CREATE TRIGGER `trg_GioHangChiTiet_Before_Insert` BEFORE INSERT ON `giohangchitiet` FOR EACH ROW BEGIN
    IF NEW.MaChiTiet IS NULL OR NEW.MaChiTiet = '' THEN
        SET NEW.MaChiTiet = (
            SELECT CONCAT('CTGH', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaChiTiet, 5) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM giohangchitiet
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sanpham`
--

CREATE TABLE `sanpham` (
  `MaSanPham` char(10) NOT NULL,
  `MaDanhMuc` char(10) DEFAULT NULL,
  `TenSanPham` varchar(150) NOT NULL,
  `MoTa` text DEFAULT NULL,
  `Gia` decimal(10,2) NOT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL,
  `TrangThai` enum('hienthi','an') DEFAULT 'hienthi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sanpham`
--

INSERT INTO `sanpham` (`MaSanPham`, `MaDanhMuc`, `TenSanPham`, `MoTa`, `Gia`, `HinhAnh`, `TrangThai`) VALUES
('SP001', 'DM001', 'G� r�n thu?ng', 'Test s?a', 35000.00, 'miysotcay.jpg', 'hienthi'),
('SP002', 'DM001', 'Gà cay', 'Gà rán vị cay', 38000.00, 'ga_cay.jpg', 'hienthi'),
('SP003', 'DM002', 'Mì Ý nhỏ', 'Mì Ý size nhỏ', 30000.00, 'mi_nho.jpg', 'hienthi'),
('SP004', 'DM002', 'Mì Ý lớn', 'Mì Ý size lớn', 45000.00, 'mi_lon.jpg', 'hienthi'),
('SP005', 'DM003', 'Coca nhỏ', 'Chai nhỏ', 15000.00, 'coca.jpg', 'hienthi'),
('SP006', 'DM004', 'Burger bò', 'Burger bò nướng', 55000.00, 'burger_bo.jpg', 'hienthi'),
('SP007', 'DM002', 'mỳ ý sốt cay', 'mỳ ý cay bùng vị', 40000.00, 'miysotcay.jpg', 'an'),
('SP008', 'DM002', 'mỳ ý sốt cay', 'my y cay bung vi\n', 40000.00, 'miysotcay.jpg', 'hienthi'),
('SP009', 'DM003', 'cục cức', 'thấy ghê', 0.00, 'miysotcay.jpg', 'hienthi'),
('SP010', 'DM002', 'cục', 'thấy ghê', 0.00, 'miysotcay.jpg', 'an');

--
-- Triggers `sanpham`
--
DELIMITER $$
CREATE TRIGGER `trg_SanPham_Before_Insert` BEFORE INSERT ON `sanpham` FOR EACH ROW BEGIN
    IF NEW.MaSanPham IS NULL OR NEW.MaSanPham = '' THEN
        SET NEW.MaSanPham = (
            SELECT CONCAT('SP', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaSanPham, 3) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM SanPham
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `MaUser` char(10) NOT NULL,
  `TaiKhoan` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `HoTen` varchar(150) NOT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `DienThoai` varchar(20) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `VaiTro` enum('admin','nhanvien','khachhang') DEFAULT 'khachhang',
  `NgayTao` datetime DEFAULT current_timestamp(),
  `MaXa` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`MaUser`, `TaiKhoan`, `MatKhau`, `HoTen`, `Email`, `DienThoai`, `DiaChi`, `VaiTro`, `NgayTao`, `MaXa`) VALUES
('US001', 'admin', '123456', 'Quản trị viên', 'admin@jb.com', '0900000001', 'TP.HCM', 'admin', '2025-11-28 19:32:28', NULL),
('US002', 'nhanvien01', '123456', 'Nhân viên A', 'nv01@jb.com', '0900000002', 'TP.HCM', 'nhanvien', '2025-11-28 19:32:28', NULL),
('US003', 'khach001', '123456', 'Nguyễn Văn A', 'a@gmail.com', '0900000003', 'Hà Nội', 'khachhang', '2025-11-28 19:32:28', NULL),
('US004', 'nghi', '123', 'nghi', 'nghi@gmail.com', '0962320196', 'tien giang', 'khachhang', '2025-12-01 20:46:56', NULL),
('US005', 'thien', '123', 'thien', 'thien@gmail.com', '0962320196', 'tien giang', 'khachhang', '2025-12-04 21:59:27', NULL),
('US006', 'phi', '123', 'phi', 'phi@tgu.edu.vn', '0962320196', 'asfa', 'khachhang', '2025-12-19 13:30:15', NULL),
('US007', 'bao', '123', 'bao', 'bao@gmail.com', '09875453', 'Địa chỉ 65 Huỳnh Thúc Kháng, phường Bến nghé, quận 1, thành phố Hồ Chí Minh.', 'khachhang', '2025-12-19 20:39:06', NULL),
('US008', 'sang', '123456', 'sang', 'sang@gmail.com', '0962320187', NULL, 'khachhang', '2025-12-22 17:38:19', 'PHUOC_THANH'),
('US009', 'bao12', '123456', 'bao', '034', '09875453', 'Địa chỉ 65 Huỳnh Thúc Kháng, phường Bến nghé, quận 1, thành phố Hồ Chí Minh.', 'khachhang', '2025-12-22 20:34:47', NULL),
('US010', 'nu', '123', 'nu', 'nu@gmail.com', '1872418264', NULL, 'khachhang', '2025-12-24 11:12:58', 'THANH_MY');

--
-- Triggers `user`
--
DELIMITER $$
CREATE TRIGGER `trg_User_Before_Insert` BEFORE INSERT ON `user` FOR EACH ROW BEGIN
    IF NEW.MaUser IS NULL OR NEW.MaUser = '' THEN
        SET NEW.MaUser = (
            SELECT CONCAT('US', LPAD(
                IFNULL(MAX(CAST(SUBSTRING(MaUser, 3) AS UNSIGNED)), 0) + 1,
            3, '0'))
            FROM User
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `xa_toado`
--

CREATE TABLE `xa_toado` (
  `MaXa` varchar(50) NOT NULL,
  `TenXa` varchar(100) NOT NULL,
  `Lat` decimal(10,8) NOT NULL,
  `Lng` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `xa_toado`
--

INSERT INTO `xa_toado` (`MaXa`, `TenXa`, `Lat`, `Lng`) VALUES
('MY_PHONG', 'Mỹ Phong', 10.36670000, 106.38330000),
('MY_THANH', 'Mỹ Thành', 10.36600000, 106.39000000),
('PHUOC_THANH', 'Phước Thạnh', 10.35000000, 106.36000000),
('TAN_LONG', 'Tân Long', 10.36000000, 106.37000000),
('TAN_MY', 'Tân Mỹ', 10.37000000, 106.38000000),
('THANH_MY', 'Thạnh Mỹ', 10.38000000, 106.40000000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatmessage`
--
ALTER TABLE `chatmessage`
  ADD PRIMARY KEY (`MaTinNhan`);

--
-- Indexes for table `combo`
--
ALTER TABLE `combo`
  ADD PRIMARY KEY (`MaCombo`);

--
-- Indexes for table `combochitiet`
--
ALTER TABLE `combochitiet`
  ADD PRIMARY KEY (`MaComboChiTiet`),
  ADD KEY `MaCombo` (`MaCombo`),
  ADD KEY `MaSanPham` (`MaSanPham`);

--
-- Indexes for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`MaDanhGia`),
  ADD KEY `MaDonHang` (`MaDonHang`),
  ADD KEY `MaUser` (`MaUser`);

--
-- Indexes for table `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD PRIMARY KEY (`MaDanhMuc`);

--
-- Indexes for table `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`MaDonHang`),
  ADD KEY `MaUser` (`MaUser`);

--
-- Indexes for table `donhangchitiet`
--
ALTER TABLE `donhangchitiet`
  ADD PRIMARY KEY (`MaChiTiet`),
  ADD KEY `MaDonHang` (`MaDonHang`),
  ADD KEY `MaSanPham` (`MaSanPham`),
  ADD KEY `MaCombo` (`MaCombo`);

--
-- Indexes for table `donhangcombochitiet`
--
ALTER TABLE `donhangcombochitiet`
  ADD PRIMARY KEY (`MaCTCombo`),
  ADD KEY `MaChiTiet` (`MaChiTiet`),
  ADD KEY `MaSanPham` (`MaSanPham`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`MaFeedback`);

--
-- Indexes for table `giamgia`
--
ALTER TABLE `giamgia`
  ADD PRIMARY KEY (`MaGiamGia`);

--
-- Indexes for table `giohang`
--
ALTER TABLE `giohang`
  ADD PRIMARY KEY (`MaGioHang`),
  ADD KEY `MaUser` (`MaUser`);

--
-- Indexes for table `giohangchitiet`
--
ALTER TABLE `giohangchitiet`
  ADD PRIMARY KEY (`MaChiTiet`),
  ADD KEY `MaGioHang` (`MaGioHang`),
  ADD KEY `MaSanPham` (`MaSanPham`),
  ADD KEY `MaCombo` (`MaCombo`);

--
-- Indexes for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`MaSanPham`),
  ADD KEY `MaDanhMuc` (`MaDanhMuc`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`MaUser`),
  ADD UNIQUE KEY `TaiKhoan` (`TaiKhoan`);

--
-- Indexes for table `xa_toado`
--
ALTER TABLE `xa_toado`
  ADD PRIMARY KEY (`MaXa`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatmessage`
--
ALTER TABLE `chatmessage`
  MODIFY `MaTinNhan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `MaFeedback` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `combochitiet`
--
ALTER TABLE `combochitiet`
  ADD CONSTRAINT `combochitiet_ibfk_1` FOREIGN KEY (`MaCombo`) REFERENCES `combo` (`MaCombo`),
  ADD CONSTRAINT `combochitiet_ibfk_2` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`);

--
-- Constraints for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `danhgia_ibfk_1` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`),
  ADD CONSTRAINT `danhgia_ibfk_2` FOREIGN KEY (`MaUser`) REFERENCES `user` (`MaUser`);

--
-- Constraints for table `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`MaUser`) REFERENCES `user` (`MaUser`);

--
-- Constraints for table `donhangchitiet`
--
ALTER TABLE `donhangchitiet`
  ADD CONSTRAINT `donhangchitiet_ibfk_1` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`),
  ADD CONSTRAINT `donhangchitiet_ibfk_2` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`),
  ADD CONSTRAINT `donhangchitiet_ibfk_3` FOREIGN KEY (`MaCombo`) REFERENCES `combo` (`MaCombo`);

--
-- Constraints for table `donhangcombochitiet`
--
ALTER TABLE `donhangcombochitiet`
  ADD CONSTRAINT `donhangcombochitiet_ibfk_1` FOREIGN KEY (`MaChiTiet`) REFERENCES `donhangchitiet` (`MaChiTiet`),
  ADD CONSTRAINT `donhangcombochitiet_ibfk_2` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`);

--
-- Constraints for table `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `giohang_ibfk_1` FOREIGN KEY (`MaUser`) REFERENCES `user` (`MaUser`);

--
-- Constraints for table `giohangchitiet`
--
ALTER TABLE `giohangchitiet`
  ADD CONSTRAINT `giohangchitiet_ibfk_1` FOREIGN KEY (`MaGioHang`) REFERENCES `giohang` (`MaGioHang`),
  ADD CONSTRAINT `giohangchitiet_ibfk_2` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`),
  ADD CONSTRAINT `giohangchitiet_ibfk_3` FOREIGN KEY (`MaCombo`) REFERENCES `combo` (`MaCombo`);

--
-- Constraints for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`MaDanhMuc`) REFERENCES `danhmuc` (`MaDanhMuc`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
