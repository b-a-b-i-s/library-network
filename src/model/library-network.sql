--
-- Table structure for table `Έντυπο`
--
/*!50503 SET NAMES utf8mb4 */;

CREATE TABLE `Έντυπο` (
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Τίτλος` varchar(1300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Εκδοτικός_οίκος` varchar(400) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `Έκδοση` varchar(5) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Ημερομηνία_Έκδοσης` varchar(10) DEFAULT NULL,
  `DDC` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Σελίδες` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Έντυπο`
--

INSERT INTO `Έντυπο` (`ISBN`, `Τίτλος`, `Εκδοτικός_οίκος`, `Έκδοση`, `Ημερομηνία_Έκδοσης`, `DDC`, `Σελίδες`) VALUES
(9780070057791, 'Data mining with neural networks: solving business problems--from application development to decision support', 'McGraw-Hill', NULL, '1996', '658.4/038/028563 ', NULL),
(9780071347778, 'Cisco Packetized Voice and Data Integration', 'Addison-Wesley Professional', NULL, '1999', '004.6 ', NULL),
(9780131776913, 'Electrical machines, drives, and power systems', 'Pearson', '6', '2005', NULL, 934),
(9780139460531, 'Waves and Fields in Optoelectronics', 'Prentice Hall', 'PH', '1983', '621.36/6 ', NULL),
(9780201513769, 'Neural networks, algorithms, applications, and programming techniques', 'Addison-Wesley Pub (Sd)', NULL, '1991', '006.3 ', NULL),
(9780470484135, 'Fundamentals of Wavelets', 'Wiley', '1', '2010', NULL, NULL),
(9780470850978, 'Web Server Programming', 'Wiley', NULL, '2003', NULL, NULL),
(9780792350378, 'Fluctuations, information, gravity and the quantum potential', 'Springer', NULL, '2006', '512/.57 ', NULL),
(9780898711875, 'Data structures and network algorithms', 'Industrial and Applied Mathematics', NULL, '1987', '001.64/2 ', NULL),
(9781107024137, 'Acquisition and Analysis of Terrestrial Gravity Data', 'Cambridge University Press', NULL, '2013', NULL, NULL),
(9783540575214, 'Quantum gravity, quantum cosmology and Lorentzian geometries', 'Springer-Verlag', '2nd ', '1994', '531/.14 ', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Ανήκει`
--

CREATE TABLE `Ανήκει` (
  `Βιβλιοθήκη` smallint(5) UNSIGNED NOT NULL,
  `Κωδ_Μέλους` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Ανήκει`
--

INSERT INTO `Ανήκει` (`Βιβλιοθήκη`, `Κωδ_Μέλους`) VALUES
(4, 26393),
(2, 32638),
(2, 94534),
(5, 144634),
(1, 532932),
(2, 782347),
(3, 837648),
(4, 923443),
(2, 927236),
(1, 934632),
(2, 934632),
(3, 1119483),
(1, 1953453),
(4, 2283573),
(5, 3329283),
(2, 3926663),
(5, 5553883),
(1, 20646643),
(2, 22499383),
(4, 22938463),
(3, 27346663),
(4, 27346663),
(3, 32299923),
(3, 33044883),
(1, 33398844);

-- --------------------------------------------------------

--
-- Table structure for table `Αντίτυπο`
--

CREATE TABLE `Αντίτυπο` (
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Αριθμός_αντιτύπου` int(10) UNSIGNED NOT NULL,
  `Κωδικός_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL,
  `Βιβλιοθήκη_καταχωρητής` smallint(5) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Αντίτυπο`
--

INSERT INTO `Αντίτυπο` (`ISBN`, `Αριθμός_αντιτύπου`, `Κωδικός_Βιβλιοθήκης`, `Βιβλιοθήκη_καταχωρητής`) VALUES
(9780071347778, 9567777, 2, 2),
(9780131776913, 835676767, 1, NULL),
(9780139460531, 555587, 5, 1),
(9780139460531, 7362546, 4, 5),
(9780139460531, 76536799, 2, 3),
(9780139460531, 835676766, 4, 2),
(9780201513769, 234234, 3, 5),
(9780201513769, 79465726, 5, 5),
(9780792350378, 564562, 4, 3),
(9780792350378, 4234324, 3, 3),
(9780898711875, 98356, 5, 1),
(9780898711875, 423647, 5, 4),
(9780898711875, 5682835, 2, 5),
(9780898711875, 56765622, 5, 1),
(9780898711875, 73322244, 5, 1),
(9781107024137, 967487, 2, 1),
(9781107024137, 7245756, 4, 4),
(9783540575214, 83567, 2, 1),
(9783540575214, 253454, 1, 2),
(9783540575214, 345345, 1, 4),
(9783540575214, 735654, 2, 2),
(9783540575214, 985676, 3, 3),
(9783540575214, 2453454, 1, 1),
(9783540575214, 4578245, 3, 2),
(9783540575214, 7456745, 1, 3),
(9783540575214, 9873456, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `Αρ_Τηλ_Βιβλιοθήκης`
--

CREATE TABLE `Αρ_Τηλ_Βιβλιοθήκης` (
  `Κωδικός_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL,
  `Τηλέφωνο_Βιβλ` varchar(18) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Αρ_Τηλ_Βιβλιοθήκης`
--

INSERT INTO `Αρ_Τηλ_Βιβλιοθήκης` (`Κωδικός_Βιβλιοθήκης`, `Τηλέφωνο_Βιβλ`) VALUES
(1, '27493830'),
(1, '27895004'),
(2, '27895003'),
(3, '25839217'),
(4, '26773009'),
(5, '27584037');

-- --------------------------------------------------------

--
-- Table structure for table `Βιβλιοθήκη`
--

CREATE TABLE `Βιβλιοθήκη` (
  `Κωδικός_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL,
  `Όνομα` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `Οδός` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ΤΚ` int(11) NOT NULL,
  `Πόλη` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Κωδικός_πρόσβασης` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Βιβλιοθήκη`
--

INSERT INTO `Βιβλιοθήκη` (`Κωδικός_Βιβλιοθήκης`, `Όνομα`, `Οδός`, `ΤΚ`, `Πόλη`, `Κωδικός_πρόσβασης`) VALUES
(1, 'ΔΑΝΕΙΣΤΙΚΗ ΒΙΒΛΙΟΘΗΚΗ ΑΘΗΝΩΝ', 'ΧΕΙΡΩΝΟΣ 238', 37299, 'ΑΘΗΝΑ', '$2b$10$BylfE3/Nz0uXvHczfpBDfOXfsGgVMK72pBDytsJSHG2qAybH8PIa2'),
(2, 'ΑΠΟΚΕΝΤΡΗ ΒΙΒΛΙΟΘΗΚΗ ΑΘΗΝΩΝ', 'ΚΙΑΦΑΣ 32', 23423, 'ΑΘΗΝΑ', '$2b$10$6ZKVObAZEyIJNpNSrtzhae7AkCHg9tStSiAL6jyFcHobVJ6.ddI8C'),
(3, 'ΒΙΒΛΙΟΘΗΚΗ ΠΑΤΡΩΝ 1987', 'ΘΕΤΙΔΩΣ 333', 74356, 'ΠΑΤΡΑ', '$2b$10$k5kxbvLOX2YLSM2e0rVNdOTACiT58bk/vG.iRi.nCwcJ25VrgCp9W'),
(4, 'ΒΙΒΛΙΟΘΗΚΗ ΕΜΠΟΡΙΚΟΥ Κ. ΘΕΣΣΑΛΟΝΙΚΗΣ', 'ΕΡΜΙΠΤΟΥ 221', 98467, 'ΘΕΣΣΑΛΟΝΙΚΗ', '$2b$10$z1/yMDPZDHCDwHt5L8k6gelaWuujxH86CCCShHQNYU8L8lwJfECmS'),
(5, 'ΔΑΝΕΙΣΤΙΚΗ ΒΙΒΛΙΟΘΗΚΗ ΧΑΝΙΩΝ', 'ΕΠΙΧΑΡΜΟΥ 326', 87476, 'ΧΑΝΙΑ', '$2b$10$0Dy7c6LOjalpvCQtahVhAenO2/d4PAbaAxqrqvyTrblYfdiTF1poK');

-- --------------------------------------------------------

--
-- Table structure for table `Δανεισμός`
--

CREATE TABLE `Δανεισμός` (
  `Κωδικός_δανεισμού` int(11) NOT NULL,
  `Κωδικός_μέλους` int(10) UNSIGNED NOT NULL,
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Αρ_αντιτύπου` int(10) UNSIGNED NOT NULL,
  `Ημερομηνία_δανεισμού` datetime DEFAULT CURRENT_TIMESTAMP,
  `Ημερομηνία_που_επιστράφηκε` datetime DEFAULT NULL,
  `Βιβλιοθήκη_καταχώρησης_δανεισμού` smallint(5) UNSIGNED DEFAULT NULL,
  `Βιβλιοθήκη_καταχώρησης_επιστροφής` smallint(5) UNSIGNED DEFAULT NULL,
  `Κωδικός_βιβλιοθήκης_αντιτύπου` smallint(5) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Δανεισμός`
--

INSERT INTO `Δανεισμός` (`Κωδικός_δανεισμού`, `Κωδικός_μέλους`, `ISBN`, `Αρ_αντιτύπου`, `Ημερομηνία_που_επιστράφηκε`, `Βιβλιοθήκη_καταχώρησης_δανεισμού`, `Βιβλιοθήκη_καταχώρησης_επιστροφής`, `Κωδικός_βιβλιοθήκης_αντιτύπου`) VALUES
(1, 934632, 9780071347778, 9567777, NULL, 2, NULL, 2),
(2, 94534, 9780139460531, 555587, NULL, 2, NULL, 5),
(3, 94534, 9780201513769, 234234, NULL, 4, NULL, 3),
(4, 32638, 9783540575214, 345345, '2022-01-05 00:00:00', 4, 1, 1),
(5, 1953453, 9783540575214, 4578245, NULL, 3, NULL, 3),
(6, 1953453, 9780898711875, 83567, '2022-01-05 00:00:00', 4, 3, 2),
(9, 33398844, 9780139460531, 835676766, '2020-04-03 00:00:00', 4, 1, 4),
(10, 3926663, 9783540575214, 9873456, NULL, 1, NULL, 1),
(11, 3329283, 9783540575214, 9873456, '2021-01-21 00:00:00', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Επιλέγει`
--

CREATE TABLE `Επιλέγει` (
  `Κωδ_μέλους` int(10) UNSIGNED NOT NULL,
  `Όνομα_κατηγορίας` varchar(30) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Επιλέγει`
--

INSERT INTO `Επιλέγει` (`Κωδ_μέλους`, `Όνομα_κατηγορίας`) VALUES
(923443, 'ΔΕΔΟΜΕΝΑ'),
(934632, 'ΔΕΔΟΜΕΝΑ'),
(22499383, 'ΔΕΔΟΜΕΝΑ'),
(27346663, 'ΔΕΔΟΜΕΝΑ'),
(345345, 'ΔΙΚΤΥΑ'),
(22938463, 'ΔΙΚΤΥΑ'),
(33044883, 'ΔΙΚΤΥΑ'),
(3926663, 'ΕΠΙΣΤΗΜΗ'),
(32299923, 'ΕΠΙΣΤΗΜΗ'),
(33398844, 'ΕΠΙΣΤΗΜΗ'),
(549733, 'ΗΛΕΚΤΡΟΝΙΚΗ'),
(923443, 'ΗΛΕΚΤΡΟΝΙΚΗ'),
(934632, 'ΗΛΕΚΤΡΟΝΙΚΗ'),
(3926663, 'ΗΛΕΚΤΡΟΝΙΚΗ'),
(923443, 'ΚΒΑΝΤΙΚΗ ΦΥΣΙΚΗ'),
(927236, 'ΚΒΑΝΤΙΚΗ ΦΥΣΙΚΗ'),
(3926663, 'ΚΒΑΝΤΙΚΗ ΦΥΣΙΚΗ'),
(94534, 'ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ'),
(27346663, 'ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ'),
(33398844, 'ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ');

-- --------------------------------------------------------

--
-- Table structure for table `Επιλογές_Συνδρομής`
--

CREATE TABLE `Επιλογές_Συνδρομής` (
  `Κωδικός_συνδρομής` tinyint(3) UNSIGNED NOT NULL,
  `Διάρκεια` smallint(6) NOT NULL,
  `Τιμή` float DEFAULT NULL,
  `Διάρκεια_δανεισμού` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Επιβάρυνση_καθυστέρησης_ασυνέπειας` float DEFAULT NULL,
  `Όριο_δανεισμών` smallint(4) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Επιλογές_Συνδρομής`
--

INSERT INTO `Επιλογές_Συνδρομής` (`Κωδικός_συνδρομής`, `Διάρκεια`, `Τιμή`, `Διάρκεια_δανεισμού`, `Επιβάρυνση_καθυστέρησης_ασυνέπειας`, `Όριο_δανεισμών`) VALUES
(1, 1, 4, '10', 1, 1),
(2, 2, 6, '15', 0.9, 2),
(3, 3, 7.5, '20', 0.8, 3),
(4, 6, 9, '25', 0.7, 4),
(5, 9, 10, '30', 0.6, 6),
(6, 12, 11, '38', 0.4, 8);

-- --------------------------------------------------------

--
-- Table structure for table `Κατηγορία`
--

CREATE TABLE `Κατηγορία` (
  `Κωδικός` int(11) NOT NULL,
  `Όνομα` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Κατηγορία`
--

INSERT INTO `Κατηγορία` (`Κωδικός`, `Όνομα`) VALUES
(1, 'ΔΕΔΟΜΕΝΑ'),
(2, 'ΔΙΚΤΥΑ'),
(3, 'ΕΠΙΣΤΗΜΗ'),
(4, 'ΗΛΕΚΤΡΟΝΙΚΗ'),
(5, 'ΚΒΑΝΤΙΚΗ ΦΥΣΙΚΗ'),
(6, 'ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ'),
(13, 'ΒΙΟΓΡΑΦΙΕΣ ΚΑΙ ΜΑΡΤΥΡΙΕΣ'),
(14, 'ΔΟΚΙΜΙΑ'),
(15, 'ΠΟΛΙΤΙΚΑ ΒΙΒΛΙΑ'),
(16, 'ΦΙΛΟΣΟΦΙΑ');

-- --------------------------------------------------------

--
-- Table structure for table `Κράτηση`
--

CREATE TABLE `Κράτηση` (
  `Ημερομηνία_κράτησης` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Μέλος` int(10) UNSIGNED NOT NULL,
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Βιβλιοθήκη_κράτησης` smallint(5) UNSIGNED NOT NULL,
  `Κατάσταση_ολοκλήρωσης` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Κράτηση`
--

INSERT INTO `Κράτηση` (`Μέλος`, `ISBN`, `Βιβλιοθήκη_κράτησης`, `Κατάσταση_ολοκλήρωσης`) VALUES
-- (94534, 9783540575214, 3, 0),
-- (5553883, 9783540575214, 1, 0),
-- (1953453, 9783540575214, 1, 1),
-- (22499383, 9783540575214, 1, 0),
-- (94534, 9783540575214, 3, 0),
-- (32299923, 9783540575214, 1, 0),
-- (3329283, 9783540575214, 2, 0),
(33398864, 9780139460531, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Μέλος`
--

CREATE TABLE `Μέλος` (
  `Κωδικός_μέλους` int(10) UNSIGNED NOT NULL,
  `Όνομα` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Επίθετο` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Οδός` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Πόλη` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `ΤΚ` int(11) DEFAULT NULL,
  `Ημερομηνία_Εγγραφής` datetime DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `Κωδικός_πρόσβασης` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Μέλος`
--

INSERT INTO `Μέλος` (`Κωδικός_μέλους`, `Όνομα`, `Επίθετο`, `Οδός`, `Πόλη`, `ΤΚ`, `email`, `Κωδικός_πρόσβασης`) VALUES
(26393, 'ΜΕΝΙΑ', 'ΜΙΧΑΗΛΙΔΟΥ', 'ΔΕΛΦΩΝ 292', 'ΑΘΗΝΑ', 13463, 'menia@gmail.com', '1234214@#g'),
(32638, 'ΧΡΥΣΑ', 'ΝΙΚΟΛΑΚΟΠΟΥΛΟΥ', 'ΓΟΥΝΑΡΑΚΗ 21', 'ΙΩΑΝΝΙΝΑ', NULL, 'xrysa@gmail.com', '2345345*g'),
(94534, 'ΕΥΑ', 'ΚΗΤΣΟΥ', 'ΑΙΓΛΗΣ  33', 'ΑΘΗΝΑ', NULL, 'eva@gmail.com', 'hbhj&GYBUJ'),
(144634, 'ΓΙΑΝΝΗΣ', 'ΓΕΩΡΓΙΟΥ', 'ΑΘΑΜΑΝΙΑΣ 22', 'ΘΕΣΣΑΛΟΝΙΚΗ', 13423, 'giannhs@yahoo.com', 'VGY%^7'),
(345345, 'ΝΙΚΟΣ', 'ΠΑΠΑΜΙΧΑΗΛ', 'ΑΓΑΘΙΟΥ 89', 'ΠΑΤΡΑ', 22652, 'nikos@gmail.com', 'NHGVGHU656&*I'),
(532932, 'ΔΗΜΗΤΡΗΣ', 'ΚΟΥΡΑΚΗΣ', 'ΓΕΜΙΝΟΥ 102', 'ΙΣΤΙΑΙΑ', 94366, 'dimitris@company.com', 'VGGHU5r67yBJ(*7'),
(549733, 'ΒΙΚΤΩΡΙΑ', 'ΕΛΕΥΘΕΡΙΑΔΟΥ', 'ΥΔΡΑΣ 39', 'ΑΡΤΑ', NULL, 'viktwria@company.com', ' CDW@#'),
(782347, 'ΜΑΝΩΛΗΣ', 'ΖΑΝΟΣ', 'ΕΚΑΛΗΣ 22', 'ΑΘΗΝΑ', NULL, 'manwlhs@yahoo.com', 'S!@#$%TG'),
(837648, 'ΣΠΥΡΟΣ', 'ΠΑΠΑΜΙΧΑΗΛ', 'ΑΝΥΜΕΔΟΝΤΟΣ 20', 'ΒΟΛΟΣ', 75435, 'spyros@companyname.com', 'GFG54567TFGh'),
(923443, 'ΣΑΡΑΝΤΗΣ', 'ΧΡΗΣΤΟΠΟΥΛΟΣ', 'ΔΑΜΙΡΑΛΗ 282', 'ΒΟΛΟΣ', NULL, 'saranths@companyname.gr', 'BVFE#$%^'),
(927236, 'ΠΕΤΡΟΣ', 'ΓΕΩΡΓΑΚΟΠΟΥΛΟΣ', 'ΑΚΑΣΤΟΥ 98', 'ΠΑΤΡΑ', 64565, 'petros@compamyname.com', 'GFE$%^&'),
(934632, 'ΦΑΝΗ', 'ΑΘΑΝΑΣΙΟΥ', 'ΖΗΛΩΝ 152', 'ΒΟΛΟΣ', 23455, 'fanh@gmail.com', 'NBGF#$%^'),
(1119483, 'ΣΠΥΡΙΔΟΥΛΑ', 'ΘΑΝΟΥ', 'ΕΡΑΤΥΡΑΣ 32', 'ΑΘΗΝΑ', 45765, 'spyridoula@outlook.com', 'NGFDE#$%'),
(1953453, 'ΓΕΩΡΓΙΑ', 'ΣΤΑΥΡΟΥ', 'ΒΟΥΚΟΥΡΕΣΤΙΟΥ 10', 'ΗΓΟΥΜΕΝΙΤΣΑ', 76345, 'gewrgia@company.com', 'GFDW@#$%^\\'),
(2283573, 'ΚΩΣΤΑΣ', 'ΓΟΥΔΗΣ', 'ΕΥΒΟΙΑΣ 199', 'ΠΑΤΡΑ', 64562, 'kwstas@company.com', 'gfds34%^\\'),
(3329283, 'ΜΙΛΤΟΣ', 'ΗΛΙΑΔΗΣ', 'ΘΕΡΙΣΟΥ 56', 'ΘΕΣΣΑΛΟΝΙΚΗ', NULL, 'miltos@outlook.com', 'r4324tfgsdfg'),
(3926663, 'ΛΟΥΚΑΣ', 'ΑΛΕΞΙΟΥ', 'ΗΡΑΚΛΕΟΥΣ 143', 'ΗΓΟΥΜΕΝΙΤΣΑ', 87676, 'loukas@yahoo.com', '52345gsdg'),
(5553883, 'ΒΑΣΙΛΙΚΗ', 'ΑΡΓΥΡΑΚΗ', 'ΦΙΛΙΝΟΥ 46', 'ΜΕΣΟΛΟΓΓΙ', 34233, 'vasw@gmail.com', '4523erdsfg'),
(20646643, 'ΠΑΝΟΣ', 'ΑΝΤΩΝΙΑΔΗΣ', 'ΘΕΜΙΣΚΥΡΑΣ 21', 'ΧΑΝΙΑ', NULL, 'panos@gmail.com', 'g31retgergdf'),
(22499383, 'ΑΘΗΝΑ', 'ΔΟΞΑΡΑ', 'ΤΑΥΡΙΔΟΣ 38', 'ΣΕΡΡΕΣ', 2346, 'athhna@company.com', 'rhjhgt^*j'),
(22938463, 'ΘΑΛΕΙΑ', 'ΓΕΡΜΑΝΟΥ', 'ΧΑΝΣΕΝ 188', 'ΠΑΤΡΑ', 92346, 'thaleia@company.gr', 'jhgd$%^&h'),
(23499992, 'ΚΩΝΣΤΑΝΤΙΝΑ', 'ΕΥΘΥΜΙΑΔΟΥ', 'ΙΚΑΡΙΑΣ 34', 'ΚΑΛΑΜΑΤΑ', 74003, 'kwnst@company.gr', 'hgfrtyuh%^'),
(27346663, 'ΜΕΝΕΛΑΟΣ', 'ΑΝΔΡΕΑΔΗΣ', 'ΙΑΚΧΟΥ 26', 'ΚΑΒΑΛΑ', 23455, 'menelaos@company.gr', 'jfdh65yhr'),
(32299923, 'ΖΗΣΗΣ', 'ΖΕΡΒΟΣ', 'ΙΒΥΚΟΥ 63', 'ΛΑΜΙΑ', 96578, 'zisis@company.gr', 'gdfg54gfg'),
(33044883, 'ΣΟΦΙΑ', 'ΚΟΚΚΙΝΑΚΗ', 'ΚΑΛΛΙΠΟΥ 183', 'ΞΑΝΘΗ', 33726, 'sofia@company.gr', 'bvcxb45'),
(33292346, 'ΣΑΒΒΑΣ', 'ΙΩΑΝΝΟΥ', 'ΘΥΑΜΙΔΟΣ 98', 'ΛΑΡΙΣΑ', 73455, 'savvas@gmail.com', 'vfxcv35yghf'),
(33398844, 'ΖΩΗ', 'ΔΗΜΑΚΟΠΟΥΛΟΥ', 'ΧΙΜΑΙΡΑΣ 322', 'ΙΩΑΝΝΙΝΑ', 34023, 'zwh@gmail.com', '567^&^&hh'),
(33398864, 'e', 'e', NULL, NULL, NULL, 'e@e', '$2b$10$jIbzG5HFKjTGXaqIs1iD8.m5Exrf0psD42aKzIhw15uhsB8quKaTG'),
(33398865, 'e', 'e', NULL, NULL, NULL, NULL, '$2b$10$Kf1k3CQCoZOtHuW1BA2IeeN.hubZH5JYit/Ruha5GRrEG1hPAPr9C'),
(33398866, 'e', 'e', NULL, NULL, NULL, NULL, '$2b$10$jQ02IVkCsBcuFzCFrfHviO6WukGKSgBzlN6fBETDjwzdMxzsZ2gZ2'),
(33398867, 'e', 'e', NULL, NULL, NULL, NULL, '$2b$10$a.0JjnP4H/9lS1u10guYnO.cgdkctvQKgg7TJcZXXdhcmNsgBYhUa');

-- --------------------------------------------------------

--
-- Table structure for table `Μεταφορά`
--

CREATE TABLE `Μεταφορά` (
  `Κωδικός_μεταφοράς` int(10) UNSIGNED NOT NULL,
  `Κωδικός_Βιβλιοθήκης_προορισμού` smallint(5) UNSIGNED NOT NULL,
  `Βιβλιοθήκη_προέλευσης` smallint(5) UNSIGNED NOT NULL,
  `Ημερομηνία` datetime DEFAULT CURRENT_TIMESTAMP,
  `Κατάσταση_παραλαβής` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Μεταφορά`
--

INSERT INTO `Μεταφορά` (`Κωδικός_μεταφοράς`, `Κωδικός_Βιβλιοθήκης_προορισμού`, `Βιβλιοθήκη_προέλευσης`, `Κατάσταση_παραλαβής`) VALUES
(53688, 5, 1, 0),
(928363, 5, 4, 0),
(1231243, 1, 2, 1),
(2734453, 2, 5, 0),
(2838238, 1, 3, 0),
(9373623, 3, 4, 0),
(37326238, 4, 2, 0),
(932846239, 3, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Περιέχει`
--

CREATE TABLE `Περιέχει` (
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Αρ_αντιτύπου` int(10) UNSIGNED NOT NULL,
  `Κωδ_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL,
  `Κωδ_μεταφοράς` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Περιέχει`
--

INSERT INTO `Περιέχει` (`ISBN`, `Αρ_αντιτύπου`, `Κωδ_Βιβλιοθήκης`, `Κωδ_μεταφοράς`) VALUES
(9783540575214, 253454, 1, 53688),
(9783540575214, 2453454, 1, 932846239),
(9780898711875, 5682835, 2, 1231243);

-- --------------------------------------------------------

--
-- Table structure for table `Περιλαμβλανει`
--

CREATE TABLE `Περιλαμβλανει` (
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Κατηγορία` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Περιλαμβλανει`
--

INSERT INTO `Περιλαμβλανει` (`ISBN`, `Κατηγορία`) VALUES
(9780071347778, 1),
(9780470850978, 1),
(9780792350378, 1),
(9780898711875, 1),
(9780201513769, 2),
(9780470850978, 2),
(9780898711875, 2),
(9780071347778, 3),
(9780139460531, 3),
(9780201513769, 3),
(9780470850978, 3),
(9780792350378, 3),
(9780898711875, 3),
(9781107024137, 3),
(9783540575214, 3),
(9780139460531, 4),
(9783540575214, 5),
(9780201513769, 6),
(9780898711875, 6);

-- --------------------------------------------------------

--
-- Table structure for table `Συγγραφείς`
--

CREATE TABLE `Συγγραφείς` (
  `Συγγραφέας` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `ISBN` bigint(13) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Συγγραφείς`
--

INSERT INTO `Συγγραφείς` (`Συγγραφέας`, `ISBN`) VALUES
('Joseph P. Bigus', 9780070057791),
('Robert Caputo', 9780071347778),
('Theodore Wildi', 9780131776913),
('Hermann A. Haus', 9780139460531),
('David M. Skapura', 9780201513769),
('James A. Freeman', 9780201513769),
('Neil Gray', 9780470850978),
(' Klaus Habetha', 9780792350378),
('Gerhard Jank', 9780792350378),
('Volker Dietrich', 9780792350378),
('Robert Endre Tarjan', 9780898711875),
('Leland Timothy Long', 9781107024137),
('Ronald Douglas Kaufmann', 9781107024137),
('Giampiero Esposito', 9783540575214);

-- --------------------------------------------------------

--
-- Table structure for table `Συνδρομή`
--

CREATE TABLE `Συνδρομή` (
  `Αριθμός_συνδρομής` int(10) UNSIGNED NOT NULL,
  `Ημερομηνία_έναρξης` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Κωδ_μέλους` int(10) UNSIGNED NOT NULL,
  `Κωδ_συνδρομής` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Συνδρομή`
--

INSERT INTO `Συνδρομή` (`Αριθμός_συνδρομής`, `Κωδ_μέλους`, `Κωδ_συνδρομής`) VALUES
(734554, 33292346, 4),
(1984653, 94534, 2),
(2367234, 27346663, 2),
(3262344, 934632, 6),
(4573452, 33398844, 4),
(5466234, 934632, 6),
(8381373, 782347, 3),
(20173338, 345345, 5),
(83725493, 32638, 5),
(98247723, 26393, 6),
(123123822, 32638, 6),
(456732546, 1953453, 4),
(456732547, 3329283, 3),
(456732548, 3926663, 3),
(456732549, 33398864, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Τηλ_Μέλους`
--

CREATE TABLE `Τηλ_Μέλους` (
  `Αρ_Τηλ` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `ID_μέλους` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Τηλ_Μέλους`
--

INSERT INTO `Τηλ_Μέλους` (`Αρ_Τηλ`, `ID_μέλους`) VALUES
('0000000000', 26393),
('6990498887', 26393),
('6987788903', 32638),
('6900192837', 94534),
('24172983', 144634),
('24583122', 345345),
('6933335534', 532932),
('6930192834', 549733),
('6999837283', 782347),
('6930293843', 837648),
('+308298377483', 923443),
('26475900', 927236),
('6909349393', 934632),
('6900029384', 1119483),
('24573822', 1953453),
('24829483', 2283573),
('25485988', 3329283),
('6938293493', 3926663),
('6938294838', 5553883),
('+306039201943', 20646643),
('0000000001', 22499383),
('2', 22499383),
('6920382756', 22499383),
('6983849282', 22938463),
('6092173566', 23499992),
('27583003', 27346663),
('24657818', 32299923),
('6933302039', 33044883),
('6933456666', 33292346),
('6093847381', 33398844);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Έντυπο`
--
ALTER TABLE `Έντυπο`
  ADD PRIMARY KEY (`ISBN`);

--
-- Indexes for table `Ανήκει`
--
ALTER TABLE `Ανήκει`
  ADD PRIMARY KEY (`Βιβλιοθήκη`,`Κωδ_Μέλους`),
  ADD KEY `Ανήκει_fk1` (`Κωδ_Μέλους`);

--
-- Indexes for table `Αντίτυπο`
--
ALTER TABLE `Αντίτυπο`
  ADD PRIMARY KEY (`ISBN`,`Αριθμός_αντιτύπου`,`Κωδικός_Βιβλιοθήκης`),
  ADD KEY `Αριθμός_αντιτύπου` (`Αριθμός_αντιτύπου`),
  ADD KEY `Αντίτυπο_fk1` (`Κωδικός_Βιβλιοθήκης`);

--
-- Indexes for table `Αρ_Τηλ_Βιβλιοθήκης`
--
ALTER TABLE `Αρ_Τηλ_Βιβλιοθήκης`
  ADD PRIMARY KEY (`Κωδικός_Βιβλιοθήκης`,`Τηλέφωνο_Βιβλ`);

--
-- Indexes for table `Βιβλιοθήκη`
--
ALTER TABLE `Βιβλιοθήκη`
  ADD PRIMARY KEY (`Κωδικός_Βιβλιοθήκης`);

--
-- Indexes for table `Δανεισμός`
--
ALTER TABLE `Δανεισμός`
  ADD PRIMARY KEY (`Κωδικός_δανεισμού`),
  ADD KEY `Δανεισμός_fk0` (`Κωδικός_μέλους`),
  ADD KEY `Δανεισμός_fk1` (`ISBN`),
  ADD KEY `Δανεισμός_fk3` (`Βιβλιοθήκη_καταχώρησης_δανεισμού`),
  ADD KEY `Δανεισμός_fk4` (`Βιβλιοθήκη_καταχώρησης_επιστροφής`),
  ADD KEY `Δανεισμός_fk5` (`Κωδικός_βιβλιοθήκης_αντιτύπου`),
  ADD KEY `Δανεισμός_fk2` (`Αρ_αντιτύπου`);

--
-- Indexes for table `Επιλέγει`
--
ALTER TABLE `Επιλέγει`
  ADD PRIMARY KEY (`Κωδ_μέλους`,`Όνομα_κατηγορίας`),
  ADD KEY `Επιλέγει_fk1` (`Όνομα_κατηγορίας`);

--
-- Indexes for table `Επιλογές_Συνδρομής`
--
ALTER TABLE `Επιλογές_Συνδρομής`
  ADD PRIMARY KEY (`Κωδικός_συνδρομής`);

--
-- Indexes for table `Κατηγορία`
--
ALTER TABLE `Κατηγορία`
  ADD PRIMARY KEY (`Κωδικός`);

--
-- Indexes for table `Κράτηση`
--
ALTER TABLE `Κράτηση`
  ADD PRIMARY KEY (`Ημερομηνία_κράτησης`,`Μέλος`),
  ADD KEY `Κράτηση_fk0` (`Μέλος`),
  ADD KEY `Κράτηση_fk1` (`ISBN`),
  ADD KEY `Κράτηση_fk2` (`Βιβλιοθήκη_κράτησης`);

--
-- Indexes for table `Μέλος`
--
ALTER TABLE `Μέλος`
  ADD PRIMARY KEY (`Κωδικός_μέλους`);

--
-- Indexes for table `Μεταφορά`
--
ALTER TABLE `Μεταφορά`
  ADD PRIMARY KEY (`Κωδικός_μεταφοράς`),
  ADD KEY `Μεταφορά_fk0` (`Κωδικός_Βιβλιοθήκης_προορισμού`),
  ADD KEY `Μεταφορά_fk1` (`Βιβλιοθήκη_προέλευσης`);

--
-- Indexes for table `Περιέχει`
--
ALTER TABLE `Περιέχει`
  ADD PRIMARY KEY (`ISBN`,`Αρ_αντιτύπου`,`Κωδ_Βιβλιοθήκης`,`Κωδ_μεταφοράς`),
  ADD KEY `Περιέχει_fk2` (`Κωδ_Βιβλιοθήκης`),
  ADD KEY `Περιέχει_fk3` (`Κωδ_μεταφοράς`),
  ADD KEY `Περιέχει_fk0` (`ISBN`),
  ADD KEY `Περιέχει_fk1` (`Αρ_αντιτύπου`);

--
-- Indexes for table `Περιλαμβλανει`
--
ALTER TABLE `Περιλαμβλανει`
  ADD PRIMARY KEY (`ISBN`,`Κατηγορία`),
  ADD KEY `Περιλαμβλανει_fk1` (`Κατηγορία`);

--
-- Indexes for table `Συγγραφείς`
--
ALTER TABLE `Συγγραφείς`
  ADD PRIMARY KEY (`Συγγραφέας`,`ISBN`),
  ADD KEY `Συγγραφείς_FK` (`ISBN`);

--
-- Indexes for table `Συνδρομή`
--
ALTER TABLE `Συνδρομή`
  ADD PRIMARY KEY (`Αριθμός_συνδρομής`),
  ADD KEY `Συνδρομή_fk0` (`Κωδ_μέλους`),
  ADD KEY `Συνδρομή_fk1` (`Κωδ_συνδρομής`);

--
-- Indexes for table `Τηλ_Μέλους`
--
ALTER TABLE `Τηλ_Μέλους`
  ADD PRIMARY KEY (`Αρ_Τηλ`,`ID_μέλους`),
  ADD KEY `Τηλ_Μέλους_fk0` (`ID_μέλους`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Αντίτυπο`
--
ALTER TABLE `Αντίτυπο`
  MODIFY `Αριθμός_αντιτύπου` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=835676768;

--
-- AUTO_INCREMENT for table `Βιβλιοθήκη`
--
ALTER TABLE `Βιβλιοθήκη`
  MODIFY `Κωδικός_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `Δανεισμός`
--
ALTER TABLE `Δανεισμός`
  MODIFY `Κωδικός_δανεισμού` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Επιλογές_Συνδρομής`
--
ALTER TABLE `Επιλογές_Συνδρομής`
  MODIFY `Κωδικός_συνδρομής` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Κατηγορία`
--
ALTER TABLE `Κατηγορία`
  MODIFY `Κωδικός` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Μέλος`
--
ALTER TABLE `Μέλος`
  MODIFY `Κωδικός_μέλους` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33398877;

--
-- AUTO_INCREMENT for table `Μεταφορά`
--
ALTER TABLE `Μεταφορά`
  MODIFY `Κωδικός_μεταφοράς` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=932846240;

--
-- AUTO_INCREMENT for table `Συνδρομή`
--
ALTER TABLE `Συνδρομή`
  MODIFY `Αριθμός_συνδρομής` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=456732550;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Ανήκει`
--
ALTER TABLE `Ανήκει`
  ADD CONSTRAINT `Ανήκει_fk0` FOREIGN KEY (`Βιβλιοθήκη`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Ανήκει_fk1` FOREIGN KEY (`Κωδ_Μέλους`) REFERENCES `Μέλος` (`κωδικός_μέλους`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Αντίτυπο`
--
ALTER TABLE `Αντίτυπο`
  ADD CONSTRAINT `Αντίτυπο_fk0` FOREIGN KEY (`ISBN`) REFERENCES `Έντυπο` (`ISBN`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Αντίτυπο_fk1` FOREIGN KEY (`Κωδικός_Βιβλιοθήκης`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`);

--
-- Constraints for table `Αρ_Τηλ_Βιβλιοθήκης`
--
ALTER TABLE `Αρ_Τηλ_Βιβλιοθήκης`
  ADD CONSTRAINT `Αρ_Τηλ_Βιβλιοθήκης_fk0` FOREIGN KEY (`Κωδικός_Βιβλιοθήκης`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Δανεισμός`
--
ALTER TABLE `Δανεισμός`
  ADD CONSTRAINT `Δανεισμός_fk0` FOREIGN KEY (`Κωδικός_μέλους`) REFERENCES `Μέλος` (`κωδικός_μέλους`),
  ADD CONSTRAINT `Δανεισμός_fk1` FOREIGN KEY (`ISBN`) REFERENCES `Αντίτυπο` (`ISBN`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Δανεισμός_fk2` FOREIGN KEY (`Αρ_αντιτύπου`) REFERENCES `Αντίτυπο` (`αριθμός_αντιτύπου`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Δανεισμός_fk3` FOREIGN KEY (`Βιβλιοθήκη_καταχώρησης_δανεισμού`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`) ON DELETE SET NULL,
  ADD CONSTRAINT `Δανεισμός_fk4` FOREIGN KEY (`Βιβλιοθήκη_καταχώρησης_επιστροφής`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`) ON DELETE SET NULL,
  ADD CONSTRAINT `Δανεισμός_fk5` FOREIGN KEY (`Κωδικός_βιβλιοθήκης_αντιτύπου`) REFERENCES `Αντίτυπο` (`κωδικός_βιβλιοθήκης`) ON DELETE SET NULL;

--
-- Constraints for table `Επιλέγει`
--
ALTER TABLE `Επιλέγει`
  ADD CONSTRAINT `Επιλέγει_fk0` FOREIGN KEY (`Κωδ_μέλους`) REFERENCES `Μέλος` (`κωδικός_μέλους`) ON DELETE CASCADE;

--
-- Constraints for table `Κράτηση`
--
ALTER TABLE `Κράτηση`
  ADD CONSTRAINT `Κράτηση_fk0` FOREIGN KEY (`Μέλος`) REFERENCES `Μέλος` (`κωδικός_μέλους`) ON DELETE CASCADE,
  ADD CONSTRAINT `Κράτηση_fk1` FOREIGN KEY (`ISBN`) REFERENCES `Έντυπο` (`isbn`) ON DELETE CASCADE,
  ADD CONSTRAINT `Κράτηση_fk2` FOREIGN KEY (`Βιβλιοθήκη_κράτησης`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`) ON DELETE CASCADE;

--
-- Constraints for table `Μεταφορά`
--
ALTER TABLE `Μεταφορά`
  ADD CONSTRAINT `Μεταφορά_fk0` FOREIGN KEY (`Κωδικός_Βιβλιοθήκης_προορισμού`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Μεταφορά_fk1` FOREIGN KEY (`Βιβλιοθήκη_προέλευσης`) REFERENCES `Βιβλιοθήκη` (`κωδικός_βιβλιοθήκης`) ON UPDATE CASCADE;

--
-- Constraints for table `Περιέχει`
--
ALTER TABLE `Περιέχει`
  ADD CONSTRAINT `Περιέχει_fk0` FOREIGN KEY (`ISBN`) REFERENCES `Αντίτυπο` (`isbn`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Περιέχει_fk1` FOREIGN KEY (`Αρ_αντιτύπου`) REFERENCES `Αντίτυπο` (`αριθμός_αντιτύπου`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Περιέχει_fk2` FOREIGN KEY (`Κωδ_Βιβλιοθήκης`) REFERENCES `Αντίτυπο` (`κωδικός_βιβλιοθήκης`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Περιέχει_fk3` FOREIGN KEY (`Κωδ_μεταφοράς`) REFERENCES `Μεταφορά` (`κωδικός_μεταφοράς`) ON UPDATE CASCADE;

--
-- Constraints for table `Περιλαμβλανει`
--
ALTER TABLE `Περιλαμβλανει`
  ADD CONSTRAINT `Περιλαμβλανει_fk0` FOREIGN KEY (`ISBN`) REFERENCES `Έντυπο` (`ISBN`) ON DELETE CASCADE,
  ADD CONSTRAINT `Περιλαμβλανει_fk1` FOREIGN KEY (`Κατηγορία`) REFERENCES `Κατηγορία` (`κωδικός`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Συγγραφείς`
--
ALTER TABLE `Συγγραφείς`
  ADD CONSTRAINT `Συγγραφείς_FK` FOREIGN KEY (`ISBN`) REFERENCES `Έντυπο` (`isbn`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Συνδρομή`
--
ALTER TABLE `Συνδρομή`
  ADD CONSTRAINT `Συνδρομή_fk0` FOREIGN KEY (`Κωδ_μέλους`) REFERENCES `Μέλος` (`κωδικός_μέλους`) ON DELETE CASCADE,
  ADD CONSTRAINT `Συνδρομή_fk1` FOREIGN KEY (`Κωδ_συνδρομής`) REFERENCES `Επιλογές_Συνδρομής` (`κωδικός_συνδρομής`);

--
-- Constraints for table `Τηλ_Μέλους`
--
ALTER TABLE `Τηλ_Μέλους`
  ADD CONSTRAINT `Τηλ_Μέλους_fk0` FOREIGN KEY (`ID_μέλους`) REFERENCES `Μέλος` (`κωδικός_μέλους`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;