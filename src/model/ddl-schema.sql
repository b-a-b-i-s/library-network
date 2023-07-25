
/*!50503 SET NAMES utf8mb4 */;

--
-- Table structure for table `Έντυπο`
--

CREATE TABLE `Έντυπο` (
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Τίτλος` varchar(1300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Εκδοτικός_οίκος` varchar(400) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `Έκδοση` varchar(5) COLLATE utf8_unicode_ci,
  `Ημερομηνία_Έκδοσης` varchar(10),
  `DDC` varchar(30) COLLATE utf8_unicode_ci,
  `Σελίδες` int(10) UNSIGNED
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Ανήκει`
--

CREATE TABLE `Ανήκει` (
  `Βιβλιοθήκη` smallint(5) UNSIGNED NOT NULL,
  `Κωδ_Μέλους` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Αντίτυπο`
--

CREATE TABLE `Αντίτυπο` (
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Αριθμός_αντιτύπου` int(10) UNSIGNED NOT NULL,
  `Κωδικός_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Αρ_Τηλ_Βιβλιοθήκης`
--

CREATE TABLE `Αρ_Τηλ_Βιβλιοθήκης` (
  `Κωδικός_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL,
  `Τηλέφωνο_Βιβλ` varchar(18) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `Επιλέγει`
--

CREATE TABLE `Επιλέγει` (
  `Κωδ_μέλους` int(10) UNSIGNED NOT NULL,
  `Όνομα_κατηγορίας` varchar(30) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `Κατηγορία`
--

CREATE TABLE `Κατηγορία` (
  `Κωδικός` int(11) NOT NULL,
  `Όνομα` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `Περιλαμβλανει`
--

CREATE TABLE `Περιλαμβλανει` (
  `ISBN` bigint(13) UNSIGNED NOT NULL,
  `Κατηγορία` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Συγγραφείς`
--

CREATE TABLE `Συγγραφείς` (
  `Συγγραφέας` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `ISBN` bigint(13) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `Τηλ_Μέλους`
--

CREATE TABLE `Τηλ_Μέλους` (
  `Αρ_Τηλ` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `ID_μέλους` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  MODIFY `Αριθμός_αντιτύπου` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Βιβλιοθήκη`
--
ALTER TABLE `Βιβλιοθήκη`
  MODIFY `Κωδικός_Βιβλιοθήκης` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Δανεισμός`
--
ALTER TABLE `Δανεισμός`
  MODIFY `Κωδικός_δανεισμού` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Επιλογές_Συνδρομής`
--
ALTER TABLE `Επιλογές_Συνδρομής`
  MODIFY `Κωδικός_συνδρομής` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Κατηγορία`
--
ALTER TABLE `Κατηγορία`
  MODIFY `Κωδικός` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Μέλος`
--
ALTER TABLE `Μέλος`
  MODIFY `Κωδικός_μέλους` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Μεταφορά`
--
ALTER TABLE `Μεταφορά`
  MODIFY `Κωδικός_μεταφοράς` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Συνδρομή`
--
ALTER TABLE `Συνδρομή`
  MODIFY `Αριθμός_συνδρομής` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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