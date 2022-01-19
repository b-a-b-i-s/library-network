'use strict';

const sql = require('./db.remotemysql-com-mysql.js');
const bcrypt = require('bcrypt')













// LOGIN REGISTER //

exports.getUser = (userInfo, callback) => {

	sql.query('SELECT Όνομα, Επίθετο, Κωδικός_μέλους, email, Αρ_Τηλ, Κωδικός_πρόσβασης\
			   FROM Μέλος LEFT OUTER JOIN Τηλ_Μέλους ON Κωδικός_μέλους=ID_μέλους\
			   WHERE email=? OR Αρ_Τηλ=?\
	', [userInfo, userInfo], (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					callback(null, res)
				}
			})
}




exports.getAllUsers = function (req, callback) {
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username
	const query = {
		sql: 'SELECT email, Αρ_Τηλ\
			  FROM Μέλος LEFT OUTER JOIN Τηλ_Μέλους ON Κωδικός_μέλους=ID_μέλους'
	}
	sql.query(query, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {
				callback(null, res)
			}
		}) 
}


exports.registerUser = async function (username, lastname, email, password, phones, street, town, zip, callback) {

	let newemail = email;
	let newstreet = street;
	let newtown = town;
	let newzip = zip;
	if (email=='') newemail = null;
	if (street=='') newstreet = null;
	if (town=='') newtown = null;
	if (zip=='') newzip = null;
	
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		sql.query('INSERT INTO `Μέλος` (`Κωδικός_μέλους`, `Όνομα`, `Επίθετο`, `Οδός`, `Πόλη`, `ΤΚ`, \
					`Ημερομηνία_Εγγραφής`, `email`, `Κωδικός_πρόσβασης`) \
					VALUES (NULL, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?);',
		 [username, lastname, newstreet, newtown, newzip, newemail, hashedPassword] , (err, results) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
            
			let phonesArray = Object.keys(phones);

			if (phonesArray.length>0){
				let query = 'INSERT INTO Τηλ_Μέλους (Αρ_Τηλ, ID_μέλους) VALUES ';

				for (let index = 0; index < phonesArray.length; index++) {
					if (index==0) query = query + '(?, '+results.insertId+')';
					else		query = query + ',(?, '+results.insertId+')';
				}

				console.log(query)

				sql.query(query, phonesArray, (err, res) => {
					if (err) {
						console.log(err.stack)
						callback(err.stack)
					}
					
					callback(null, res)
				})
			}
			else {
				callback(null, results)
			}

			

		})
	} catch (error) {
		callback(error);
	}
	
}










exports.getLibrariesAndQtt  = function(req, callback) { 
	// Ανακτούνται οι βιβλιοθήκες και το πλήθος διαθεσιμων βιβλιων
	const query = {
		sql: `SELECT Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης, Όνομα, IFNULL(book_sum,0) as book_sum, Οδός, Πόλη, ΤΚ, Τηλέφωνο_Βιβλ FROM (
			SELECT Βιβλιοθήκη_τώρα, SUM(Ποσότητα) as book_sum
			FROM (
			SELECT new_t.ISBN, new_t.Βιβλιοθήκη_τώρα, COUNT(*) as Ποσότητα
				FROM
				(SELECT all_books.ISBN, all_books.Αριθμός_αντιτύπου, all_books.Κωδικός_Βιβλιοθήκης,
				CASE 
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NULL) THEN Κωδικός_Βιβλιοθήκης
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL) THEN 
						CASE 
							WHEN (Κατάσταση_παραλαβής=0) THEN NULL
							WHEN (Κατάσταση_παραλαβής=1) THEN Κωδικός_Βιβλιοθήκης_προορισμού
						END
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NOT NULL) THEN 
						CASE 
							WHEN (Ημερομηνία_που_επιστράφηκε>=date_moved) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής
							WHEN (Ημερομηνία_που_επιστράφηκε<date_moved) THEN Κωδικός_Βιβλιοθήκης_προορισμού
						END
				END AS Βιβλιοθήκη_τώρα,
				IF (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL AND Κατάσταση_παραλαβής=0,Κωδικός_Βιβλιοθήκης_προορισμού, NULL) AS Μεταφέρεται_σε,
				IF (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL AND Βιβλιοθήκη_καταχώρησης_επιστροφής is NULL, Δανεισμός.Κωδικός_μέλους, NULL) AS Δανεισμένο_σε
				
				FROM
					(   -- Πρώτα βρίσκω τα τελευταία απο τελευταιους δανεισμούς και μεταφορές και μετά βρίσκω λεπτομέρειες
						SELECT books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης, max(Κωδικός_δανεισμού) as Κωδικός_δανεισμού, max(Κωδικός_μεταφοράς) as Κωδικός_μεταφοράς
						FROM (
							SELECT Αντίτυπο.ISBN, Αντίτυπο.Αριθμός_αντιτύπου, Αντίτυπο.Κωδικός_Βιβλιοθήκης, Κωδικός_δανεισμού, Ημερομηνία_που_επιστράφηκε
							FROM Αντίτυπο LEFT JOIN Δανεισμός ON Αντίτυπο.ISBN=Δανεισμός.ISBN AND Αντίτυπο.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	Αντίτυπο.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου) as books_and_borrows
						LEFT JOIN (
							SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Κωδικός_μεταφοράς
							FROM Μεταφορά,Περιέχει
							WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved
						ON books_and_borrows.ISBN=moved.ISBN and books_and_borrows.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND books_and_borrows.Κωδικός_Βιβλιοθήκης=moved.Κωδ_βιβλιοθήκης
						GROUP BY books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης
					) as all_books LEFT OUTER JOIN
					Δανεισμός
					ON all_books.ISBN=Δανεισμός.ISBN AND all_books.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	all_books.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου AND all_books.Κωδικός_δανεισμού=Δανεισμός.Κωδικός_δανεισμού
					LEFT OUTER JOIN
					(SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Ημερομηνία as date_moved, Κατάσταση_παραλαβής, Κωδ_μεταφοράς, Κωδικός_Βιβλιοθήκης_προορισμού
					FROM Μεταφορά,Περιέχει
					WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved
					ON all_books.ISBN=moved.ISBN AND all_books.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND 	all_books.Κωδικός_Βιβλιοθήκης=moved.Κωδ_Βιβλιοθήκης AND all_books.Κωδικός_μεταφοράς=moved.Κωδ_μεταφοράς
				) as new_t JOIN Βιβλιοθήκη ON new_t.Βιβλιοθήκη_τώρα=Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης
				WHERE new_t.Βιβλιοθήκη_τώρα IS NOT NULL
				GROUP BY new_t.ISBN, new_t.Βιβλιοθήκη_τώρα
		) as book_locs 
		GROUP BY Βιβλιοθήκη_τώρα
		) as books_sums RIGHT OUTER JOIN Βιβλιοθήκη ON books_sums.Βιβλιοθήκη_τώρα=Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης LEFT OUTER JOIN Αρ_Τηλ_Βιβλιοθήκης ON Αρ_Τηλ_Βιβλιοθήκης.Κωδικός_Βιβλιοθήκης=Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης
		ORDER BY Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης`
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}


		// console.log('results')
		// console.log(res)
		// console.log('rows')
		// console.log(res.rows)
		
		callback(null, res)
	})

};






exports.getLibraries  = function(req, callback) { 

	const query = {
		sql:`SELECT *
			 FROM (Αρ_Τηλ_Βιβλιοθήκης NATURAL JOIN Βιβλιοθήκη)
			 ORDER BY Κωδικός_Βιβλιοθήκης`
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}


		// console.log('results')
		// console.log(res)
		// console.log('rows')
		// console.log(res.rows)
		
		callback(null, res)
	})

};

exports.getSubscriptions  = function(req, callback) { 


	const query = {
		sql:`SELECT *
			 FROM Επιλογές_Συνδρομής
			 ORDER BY Διάρκεια`
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		// console.log('rows')
		// console.log(res.rows)
		
		callback(null, res)
	})
};

exports.getBooks  = function(search, callback) { 


	if (search){
		sql.query(	'SELECT *\
					FROM Έντυπο LEFT OUTER JOIN Συγγραφείς USING(ISBN)\
					WHERE ISBN LIKE ? OR Τίτλος LIKE ? OR Συγγραφέας LIKE ?'
					, [				search, 		search, 			search], (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}

			// console.log('books model')

			// console.log(res)
			
			callback(null, res)
		})
	}
	else {
		const query = {
			sql: `SELECT * FROM Έντυπο LEFT OUTER JOIN Συγγραφείς USING(ISBN)`
		}

		sql.query(query, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}

			// console.log('books model')

			// console.log(res)
			
			callback(null, res)
		})
	}

	

};

// exports.getWriters  = function(req, callback) { 

// 	const query = {
// 		sql: `SELECT *
// 		FROM Συγγραφείς`
// 	}

// 	sql.query(query, (err, res) => {
// 		if (err) {
// 			console.log(err.stack)
// 			callback(err.stack)
// 		}

// 		callback(null, res)
// 	})

// };

exports.getLocations  = function(req, callback) { 
	// Βρίσκει που βρίσκεται του κάθε εντύπου ανά βιβλιοθήκη
	// Can be replaced with view
	// 

	const query = {
		sql: `SELECT all_before_kratiseis.ISBN, all_before_kratiseis.Βιβλιοθήκη_τώρα, Όνομα, Ποσότητα - IFNULL(Κρατήσεις,0) AS Ποσότητα, IFNULL(Κρατήσεις,0) as Κρατήσεις
		FROM(
			SELECT new_t.ISBN, new_t.Βιβλιοθήκη_τώρα, Όνομα, COUNT(*) as Ποσότητα
				FROM
				(SELECT all_books.ISBN, all_books.Αριθμός_αντιτύπου, all_books.Κωδικός_Βιβλιοθήκης,
				CASE 
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NULL) THEN Κωδικός_Βιβλιοθήκης
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής
				--    	CASE 
				--        	WHEN (Βιβλιοθήκη_καταχώρησης_επιστροφής IS NULL) THEN NULL
				--        	WHEN (Βιβλιοθήκη_καταχώρησης_επιστροφής IS NOT NULL) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής
				--        END
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL) THEN 
						CASE 
							WHEN (Κατάσταση_παραλαβής=0) THEN NULL
							WHEN (Κατάσταση_παραλαβής=1) THEN Κωδικός_Βιβλιοθήκης_προορισμού
						END
					WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NOT NULL) THEN 
						CASE 
							WHEN (Ημερομηνία_που_επιστράφηκε>=date_moved) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής
							WHEN (Ημερομηνία_που_επιστράφηκε<date_moved) THEN Κωδικός_Βιβλιοθήκης_προορισμού
						END
				END AS Βιβλιοθήκη_τώρα,
				IF (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL AND Κατάσταση_παραλαβής=0,Κωδικός_Βιβλιοθήκης_προορισμού, NULL) AS Μεταφέρεται_σε,
				IF (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL AND Βιβλιοθήκη_καταχώρησης_επιστροφής is NULL, Δανεισμός.Κωδικός_μέλους, NULL) AS Δανεισμένο_σε
				
				FROM
					(   -- Πρώτα βρίσκω τα τελευταία απο τελευταιους δανεισμούς και μεταφορές και μετά βρίσκω λεπτομέρειες
						SELECT books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης, max(Κωδικός_δανεισμού) as Κωδικός_δανεισμού, max(Κωδικός_μεταφοράς) as Κωδικός_μεταφοράς
						FROM (
							SELECT Αντίτυπο.ISBN, Αντίτυπο.Αριθμός_αντιτύπου, Αντίτυπο.Κωδικός_Βιβλιοθήκης, Κωδικός_δανεισμού, Ημερομηνία_που_επιστράφηκε
							FROM Αντίτυπο LEFT JOIN Δανεισμός ON Αντίτυπο.ISBN=Δανεισμός.ISBN AND Αντίτυπο.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	Αντίτυπο.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου) as books_and_borrows
						LEFT JOIN (
							SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Κωδικός_μεταφοράς
							FROM Μεταφορά,Περιέχει
							WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved
						ON books_and_borrows.ISBN=moved.ISBN and books_and_borrows.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND books_and_borrows.Κωδικός_Βιβλιοθήκης=moved.Κωδ_βιβλιοθήκης
						GROUP BY books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης
					) as all_books LEFT OUTER JOIN
					Δανεισμός
					ON all_books.ISBN=Δανεισμός.ISBN AND all_books.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	all_books.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου AND all_books.Κωδικός_δανεισμού=Δανεισμός.Κωδικός_δανεισμού
					LEFT OUTER JOIN
					(SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Ημερομηνία as date_moved, Κατάσταση_παραλαβής, Κωδ_μεταφοράς, Κωδικός_Βιβλιοθήκης_προορισμού
					FROM Μεταφορά,Περιέχει
					WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved
					ON all_books.ISBN=moved.ISBN AND all_books.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND 	all_books.Κωδικός_Βιβλιοθήκης=moved.Κωδ_Βιβλιοθήκης AND all_books.Κωδικός_μεταφοράς=moved.Κωδ_μεταφοράς
				) as new_t JOIN Βιβλιοθήκη ON new_t.Βιβλιοθήκη_τώρα=Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης
				WHERE new_t.Βιβλιοθήκη_τώρα IS NOT NULL
				GROUP BY new_t.ISBN, new_t.Βιβλιοθήκη_τώρα
		) as all_before_kratiseis LEFT OUTER JOIN
		(SELECT ISBN, Βιβλιοθήκη_κράτησης, COUNT(*) as Κρατήσεις
		FROM Κράτηση
		WHERE hour(TIMEDIFF(CURRENT_TIMESTAMP(),Ημερομηνία_κράτησης))/24 < 7 AND Κατάσταση_ολοκλήρωσης=0
		GROUP BY ISBN, Βιβλιοθήκη_κράτησης) as krathseis
		ON all_before_kratiseis.ISBN=krathseis.ISBN AND all_before_kratiseis.Βιβλιοθήκη_τώρα=krathseis.Βιβλιοθήκη_κράτησης;`
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log(res)
		
		callback(null, res)
	})

};

exports.bookCountAllISBN = function(isbn, callback) { 


	// console.log('isbn')
	// console.log(isbn)

	if (isbn) {
		const query = ``


		sql.query('SELECT ISBN, COUNT(*) as total_books_count\
				   FROM Έντυπο NATURAL JOIN Αντίτυπο\
				   WHERE ISBN=?', isbn, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}

			// console.log('books model')

			// console.log(res)
			
			callback(null, res)
		})
	}
	else {

		const query = `SELECT ISBN, COUNT(*) as total_books_count
					FROM Έντυπο NATURAL JOIN Αντίτυπο
					GROUP BY ISBN`


		sql.query(query, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}

			// console.log('books model')

			// console.log(res)
			
			callback(null, res)
		})
	}

};



exports.getLocationsOfBook  = function(isbn, callback) { 
	//	Βρίσκει σε ποιες βιβλιοθήκες βρίσκεται ένα βιβλίο


	sql.query('SELECT all_before_kratiseis.ISBN, all_before_kratiseis.Βιβλιοθήκη_τώρα, Όνομα, Ποσότητα - IFNULL(Κρατήσεις,0) AS Ποσότητα, IFNULL(Κρατήσεις,0) as Κρατήσεις\
	FROM(\
	SELECT new_t.ISBN, new_t.Βιβλιοθήκη_τώρα, Όνομα, COUNT(*) as Ποσότητα FROM\
	(SELECT all_books.ISBN, all_books.Αριθμός_αντιτύπου, all_books.Κωδικός_Βιβλιοθήκης,\
	CASE \
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NULL) THEN Κωδικός_Βιβλιοθήκης\
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής\
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL) THEN \
			CASE \
				WHEN (Κατάσταση_παραλαβής=0) THEN NULL\
				WHEN (Κατάσταση_παραλαβής=1) THEN Κωδικός_Βιβλιοθήκης_προορισμού\
			END\
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NOT NULL) THEN \
			CASE \
				WHEN (Ημερομηνία_που_επιστράφηκε>=date_moved) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής\
				WHEN (Ημερομηνία_που_επιστράφηκε<date_moved) THEN Κωδικός_Βιβλιοθήκης_προορισμού\
			END\
	END AS Βιβλιοθήκη_τώρα,\
	IF (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL AND Κατάσταση_παραλαβής=0, Κωδικός_Βιβλιοθήκης_προορισμού, NULL) AS Μεταφέρεται_σε,\
	IF (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL AND Βιβλιοθήκη_καταχώρησης_επιστροφής is NULL, Δανεισμός.Κωδικός_μέλους, NULL) AS Δανεισμένο_σε\
	FROM\
		(  \
			SELECT books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης, max(Κωδικός_δανεισμού) as Κωδικός_δανεισμού, max(Κωδικός_μεταφοράς) as Κωδικός_μεταφοράς\
			FROM (\
				SELECT Αντίτυπο.ISBN, Αντίτυπο.Αριθμός_αντιτύπου, Αντίτυπο.Κωδικός_Βιβλιοθήκης, Κωδικός_δανεισμού, Ημερομηνία_που_επιστράφηκε\
				FROM \
				(SELECT * \
				 FROM\
				 Αντίτυπο\
				 WHERE ISBN=?\
				 ) as Αντίτυπο\
				LEFT JOIN Δανεισμός ON Αντίτυπο.ISBN=Δανεισμός.ISBN AND Αντίτυπο.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	Αντίτυπο.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου) as books_and_borrows\
			LEFT JOIN (\
				SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Κωδικός_μεταφοράς\
				FROM Μεταφορά,Περιέχει\
				WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved\
			ON books_and_borrows.ISBN=moved.ISBN and books_and_borrows.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND books_and_borrows.Κωδικός_Βιβλιοθήκης=moved.Κωδ_βιβλιοθήκης\
			GROUP BY books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης\
		) as all_books LEFT OUTER JOIN\
		Δανεισμός\
		ON all_books.ISBN=Δανεισμός.ISBN AND all_books.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	all_books.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου AND all_books.Κωδικός_δανεισμού=Δανεισμός.Κωδικός_δανεισμού\
		LEFT OUTER JOIN\
		(SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Ημερομηνία as date_moved, Κατάσταση_παραλαβής, Κωδ_μεταφοράς, Κωδικός_Βιβλιοθήκης_προορισμού\
		FROM Μεταφορά,Περιέχει\
		WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved\
		ON all_books.ISBN=moved.ISBN AND all_books.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND 	all_books.Κωδικός_Βιβλιοθήκης=moved.Κωδ_Βιβλιοθήκης AND all_books.Κωδικός_μεταφοράς=moved.Κωδ_μεταφοράς\
		) as new_t JOIN Βιβλιοθήκη ON new_t.Βιβλιοθήκη_τώρα=Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης\
		WHERE new_t.Βιβλιοθήκη_τώρα IS NOT NULL\
	GROUP BY new_t.ISBN, new_t.Βιβλιοθήκη_τώρα\
	ORDER BY new_t.Βιβλιοθήκη_τώρα) as all_before_kratiseis LEFT OUTER JOIN\
	(SELECT ISBN, Βιβλιοθήκη_κράτησης, COUNT(*) as Κρατήσεις\
	FROM Κράτηση\
	WHERE hour(TIMEDIFF(CURRENT_TIMESTAMP(),Ημερομηνία_κράτησης))/24 < 7 AND Κατάσταση_ολοκλήρωσης=0\
	GROUP BY ISBN, Βιβλιοθήκη_κράτησης) as krathseis\
	ON all_before_kratiseis.ISBN=krathseis.ISBN AND all_before_kratiseis.Βιβλιοθήκη_τώρα=krathseis.Βιβλιοθήκη_κράτησης;\
	', isbn, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		console.log(res)
		
		callback(null, res)
	})

};





exports.getBook  = function(isbn, callback) { 


	// console.log('isbn')
	// console.log(isbn)


	sql.query('SELECT * \
			FROM Έντυπο LEFT OUTER JOIN Συγγραφείς USING(ISBN) \
			WHERE ISBN=?;', isbn, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		// console.log('books model')

		// console.log(res)
		
		callback(null, res)
	})

};



exports.makeNewReservation  = function(req, callback) {
	const isbn = req.params.ISBN;

	const libId = req.body.selectLibrary;
	const userId = req.session.loggedUserId;

	console.log(libId)

	// console.log('isbn')
	// console.log(isbn)


	sql.query('INSERT INTO `Κράτηση` \
			   (`Ημερομηνία_κράτησης`, `Μέλος`, `ISBN`, `Βιβλιοθήκη_κράτησης`, `Κατάσταση_ολοκλήρωσης`) \
			   VALUES (CURRENT_TIMESTAMP, ?, ?, ?, 0);', [userId, isbn, libId] , (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		// console.log('books model')

		// console.log(res)
		
		callback(null, res)
	})

}



exports.checkForNewReservation  = function(userId, callback) {

	// console.log('userId')
	// console.log(userId)
	// console.log(userId.Κωδ_μέλους)

	// console.log('isbn')
	// console.log(isbn)


	sql.query('SELECT Κωδ_μέλους \
	FROM (\
		SELECT Κωδ_μέλους,max(date_add(Ημερομηνία_έναρξης, interval Διάρκεια MONTH))>now() as Ενεργή_συνδρομή\
		FROM Συνδρομή,Επιλογές_Συνδρομής\
		WHERE Κωδ_μέλους=? AND Συνδρομή.Κωδ_συνδρομής=Επιλογές_Συνδρομής.Κωδικός_συνδρομής\
		GROUP BY Κωδ_μέλους\
	) as syndromes\
	WHERE Ενεργή_συνδρομή=1 AND Κωδ_μέλους NOT IN \
	(\
		SELECT Μέλος as Κωδ_μέλους\
		FROM `Κράτηση` \
		WHERE hour(TIMEDIFF(CURRENT_TIMESTAMP(),`Ημερομηνία_κράτησης`))/24 < 7 AND Κατάσταση_ολοκλήρωσης=0\
	);', userId, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		// console.log('books model')

		// console.log(res)
		
		callback(null, res)
	})

}

exports.getBookCategories  = function(isbn, callback) {

	// console.log('isbn')
	// console.log(isbn)


	sql.query('SELECT Όνομα \
	FROM Περιλαμβλανει JOIN Κατηγορία ON Περιλαμβλανει.Κατηγορία=Κατηγορία.Κωδικός\
	WHERE ISBN=?;', isbn, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		// console.log('books model')

		// console.log(res)
		
		callback(null, res)
	})

}


exports.reservationConfirm  = function(userId, callback) { 


	sql.query('UPDATE Κράτηση \
	SET Κατάσταση_ολοκλήρωσης=1\
	WHERE Μέλος=?', userId , (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		
		callback(null, res)
	})
};















/////////////////
//    STAFF    //
/////////////////

exports.getLibrariesNoPhone  = function(req, callback) { 

	const query = {
		sql: `SELECT Κωδικός_Βιβλιοθήκης, Όνομα
		FROM Βιβλιοθήκη`
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		
		callback(null, res)
	})
};

exports.addBookToDb  = function(isbn, title, publisher, version, year, ddc, pages, callback) { 
	if (publisher=='') publisher = null;
	if (version=='') version = null;
	if (year=='') year = null;
	if (ddc=='') ddc = null;
	if (pages=='') pages = null;

	let query = 'INSERT INTO `Έντυπο` (`ISBN`, `Τίτλος`, `Εκδοτικός_οίκος`, `Έκδοση`, `Ημερομηνία_Έκδοσης`, `DDC`, `Σελίδες`) \
	VALUES (?, ?, ?, ?, ?, ?, ?)';


	// console.log('bef', categories)
	
	
	sql.query('SELECT * FROM Έντυπο WHERE ISBN=?', 
		[isbn], (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}

            // console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 666 ~ res", res)

			if (res[0]) {
				callback(null, null, 1)
			}
			else{
				sql.query(query, 
					[isbn, title, publisher, version, year, ddc, pages], (err, res) => {
						if (err) {
							console.log(err.stack)
							callback(err.stack)
						}
						// console.log('results')
						// console.log(res)
						
						callback(null, res)
					})
			}
			// console.log('results')
			// console.log(res)			
		})

	
};


exports.addBookCategoriesAndWriters  = function(isbn, writers, categories, callback) { 

	let query1;

	for (let index = 0; index < writers.length; index++) {
		if (index==0) query1 = 'INSERT INTO `Συγγραφείς` (`Συγγραφέας`, `ISBN`) VALUES (?, '+isbn+')';
		else 			query1 += ',(?, '+isbn+')';
	}

	let query2;

	for (let index = 0; index < categories.length; index++) {
		if (index==0) query2 = 'INSERT INTO `Περιλαμβλανει` (`ISBN`, `Κατηγορία`) VALUES ('+isbn+', ?)';
		else 			query2 += ',('+isbn+', ?)';
	}

	// console.log(query2)


	// console.log('bef', categories)
	if (query1) {
		sql.query(query1, 
			writers, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}

				callback(null, res)
				// console.log('results')
				// console.log(res)
				
			})
	}
	else if (query2){
		sql.query(query2, 
			categories, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				// console.log('results')
				// console.log(res)
				
				callback(null, res)
			})
	}
	else {
		callback(null,null)
	}
};


exports.getUserStatus  = function(req, callback) { 
// `SET time_zone = "+02:00"; αντί για το date_add(NOW(),interval 2 HOUR) -> NOW()
	const query = {
		sql:   `SELECT Κωδικός_Μέλους, Όνομα, Επίθετο, email, Ημερομηνία_Εγγραφής, 
		Κωδ_συνδρομής, Διάρκεια, date_add(Ημερομηνία_έναρξης, interval Διάρκεια MONTH) as Ημερομηνία_λήξης, 
		Διάρκεια_δανεισμού, date_add(Ημερομηνία_έναρξης, interval Διάρκεια MONTH) > now() as Ενεργή,
		TIMESTAMPDIFF(DAY,date_add(NOW(),interval 2 HOUR),date_add(Ημερομηνία_έναρξης, interval Διάρκεια MONTH)) as Λήγει_σε, 
        Όριο_δανεισμών, Όριο_δανεισμών-IFNULL(Δανεισμένα,0) as Νέο_όριο_δανεισμών, IFNULL(Δανεισμένα,0) as Δανεισμένα
		FROM
			(SELECT Κωδ_μέλους, max(Ημερομηνία_έναρξης) as Ημερομηνία_έναρξης
			FROM Συνδρομή JOIN Επιλογές_Συνδρομής ON Συνδρομή.Κωδ_συνδρομής=Επιλογές_Συνδρομής.Κωδικός_συνδρομής
			GROUP BY Κωδ_μέλους) as syndromes
			JOIN Συνδρομή USING(Κωδ_μέλους,Ημερομηνία_έναρξης) JOIN Επιλογές_Συνδρομής ON Κωδ_συνδρομής=Κωδικός_συνδρομής 
			RIGHT OUTER JOIN Μέλος ON Κωδ_μέλους=Κωδικός_Μέλους LEFT OUTER JOIN 
            (SELECT Κωδικός_μέλους, COUNT(*) as Δανεισμένα
            FROM Δανεισμός
            WHERE Ημερομηνία_που_επιστράφηκε is NULL
            GROUP BY Κωδικός_μέλους) as borrows USING(Κωδικός_μέλους)`
	}

	// console.log('bef', categories)
		sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}

				callback(null, res)
				// console.log('results')
				// console.log(res)
				
			})

};


exports.getUsersPhones = (userInfo, callback) => {

	const query = {
		sql: `SELECT *
			  FROM Τηλ_Μέλους`
	}
	sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					callback(null, res)
				}
			})
}


exports.addUserSub = (subId, userId, end_date, callback) => {
// console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 839 ~ userId", userId)
// console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 839 ~ subId", subId)

	if (end_date) {
		sql.query('INSERT INTO `Συνδρομή` (`Αριθμός_συνδρομής`, `Ημερομηνία_έναρξης`, `Κωδ_μέλους`, `Κωδ_συνδρομής`) \
				VALUES (NULL, ?, ?, ?)', 
				[end_date, userId, subId], (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {
				callback(null, res)
			}
		})
	}
	else{
		sql.query('INSERT INTO `Συνδρομή` (`Αριθμός_συνδρομής`, `Ημερομηνία_έναρξης`, `Κωδ_μέλους`, `Κωδ_συνδρομής`) \
			VALUES (NULL, CURRENT_TIMESTAMP, ?, ?)', 
			[userId, subId], (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {
				callback(null, res)
			}
		})
	}
	
}


exports.checkPaid = (userId, callback) => {
	
		sql.query('SELECT count(*) as Χρωστούμενα\
		FROM Δανεισμός \
		WHERE Κωδικός_μέλους=? and Ημερομηνία_που_επιστράφηκε is NULL\
		GROUP BY Κωδικός_μέλους', 
				   [userId], (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			else {
				callback(null, res)
			}
		})
}


// Έλεγχος αν έχει ήδη συνδρομή ώστε η συνδρομή να επεκτέινει την τωρινή
exports.getLastSub = (userId, callback) => {
	
	sql.query('SELECT max(Ημερομηνία_λήξης) as end_date, max(Ημερομηνία_λήξης)>NOW() as active FROM \
					(SELECT Κωδ_μέλους,\
					Κωδ_συνδρομής, Διάρκεια, date_add(Ημερομηνία_έναρξης, interval Διάρκεια MONTH) as Ημερομηνία_λήξης\
					FROM\
						(SELECT Κωδ_μέλους, max(Ημερομηνία_έναρξης) as Ημερομηνία_έναρξης\
						FROM Συνδρομή JOIN Επιλογές_Συνδρομής ON Συνδρομή.Κωδ_συνδρομής=Επιλογές_Συνδρομής.Κωδικός_συνδρομής\
						WHERE Κωδ_μέλους=?\
						GROUP BY Κωδ_μέλους) as syndromes\
						JOIN Συνδρομή USING(Κωδ_μέλους,Ημερομηνία_έναρξης) JOIN Επιλογές_Συνδρομής ON Κωδ_συνδρομής=Κωδικός_συνδρομής) as exp_dates', 
			   [userId], (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			callback(null, res)
		}
	})
}


// Βρίσκει τη θέση κάθε αντιτύπου
exports.getSpecificLocationOfSpecificBook = (isbn, callback) => {
	
	sql.query('SELECT all_books.ISBN, all_books.Αριθμός_αντιτύπου, all_books.Κωδικός_Βιβλιοθήκης,\
	CASE \
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NULL) THEN Κωδικός_Βιβλιοθήκης\
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής\
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL) THEN \
			CASE \
				WHEN (Κατάσταση_παραλαβής=0) THEN NULL\
				WHEN (Κατάσταση_παραλαβής=1) THEN Κωδικός_Βιβλιοθήκης_προορισμού\
			END\
		WHEN (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NOT NULL) THEN \
			CASE \
				WHEN (Ημερομηνία_που_επιστράφηκε>=date_moved) THEN Βιβλιοθήκη_καταχώρησης_επιστροφής\
				WHEN (Ημερομηνία_που_επιστράφηκε<date_moved) THEN Κωδικός_Βιβλιοθήκης_προορισμού\
			END\
	END AS Βιβλιοθήκη_τώρα,\
	IF (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL AND Κατάσταση_παραλαβής=0, Κωδικός_Βιβλιοθήκης_προορισμού, NULL) AS Μεταφέρεται_σε,\
	IF (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL AND Βιβλιοθήκη_καταχώρησης_επιστροφής is NULL, Δανεισμός.Κωδικός_μέλους, NULL) AS Δανεισμένο_σε\
	FROM\
		(  \
			SELECT books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης, max(Κωδικός_δανεισμού) as Κωδικός_δανεισμού, max(Κωδικός_μεταφοράς) as Κωδικός_μεταφοράς\
			FROM (\
				SELECT Αντίτυπο.ISBN, Αντίτυπο.Αριθμός_αντιτύπου, Αντίτυπο.Κωδικός_Βιβλιοθήκης, Κωδικός_δανεισμού, Ημερομηνία_που_επιστράφηκε\
				FROM \
				(SELECT * \
				 FROM\
				 Αντίτυπο\
				 WHERE ISBN=?\
				 ) as Αντίτυπο\
				LEFT JOIN Δανεισμός ON Αντίτυπο.ISBN=Δανεισμός.ISBN AND Αντίτυπο.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	Αντίτυπο.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου) as books_and_borrows\
			LEFT JOIN (\
				SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Κωδικός_μεταφοράς\
				FROM Μεταφορά,Περιέχει\
				WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved\
			ON books_and_borrows.ISBN=moved.ISBN and books_and_borrows.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND books_and_borrows.Κωδικός_Βιβλιοθήκης=moved.Κωδ_βιβλιοθήκης\
			GROUP BY books_and_borrows.ISBN, books_and_borrows.Αριθμός_αντιτύπου, books_and_borrows.Κωδικός_Βιβλιοθήκης\
		) as all_books LEFT OUTER JOIN\
		Δανεισμός\
		ON all_books.ISBN=Δανεισμός.ISBN AND all_books.Αριθμός_αντιτύπου=Δανεισμός.Αρ_αντιτύπου AND 	all_books.Κωδικός_Βιβλιοθήκης=Δανεισμός.Κωδικός_βιβλιοθήκης_αντιτύπου AND all_books.Κωδικός_δανεισμού=Δανεισμός.Κωδικός_δανεισμού\
		LEFT OUTER JOIN\
		(SELECT ISBN, Κωδ_βιβλιοθήκης, Αρ_αντιτύπου, Ημερομηνία as date_moved, Κατάσταση_παραλαβής, Κωδ_μεταφοράς, Κωδικός_Βιβλιοθήκης_προορισμού\
		FROM Μεταφορά,Περιέχει\
		WHERE Κωδικός_μεταφοράς=Κωδ_μεταφοράς) AS moved\
		ON all_books.ISBN=moved.ISBN AND all_books.Αριθμός_αντιτύπου=moved.Αρ_αντιτύπου AND all_books.Κωδικός_Βιβλιοθήκης=moved.Κωδ_Βιβλιοθήκης AND all_books.Κωδικός_μεταφοράς=moved.Κωδ_μεταφοράς\
		', isbn, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			callback(null, res)
		}
	})
}


exports.getIsbnReservations = (isbn, callback) => {

	sql.query('SELECT ISBN, Βιβλιοθήκη_κράτησης, COUNT(*) as Κρατήσεις, Μέλος\
	FROM Κράτηση\
	WHERE ISBN=? AND hour(TIMEDIFF(CURRENT_TIMESTAMP(),Ημερομηνία_κράτησης))/24 < 7 AND Κατάσταση_ολοκλήρωσης=0\
	GROUP BY ISBN, Βιβλιοθήκη_κράτησης, Μέλος\
	ORDER BY Βιβλιοθήκη_κράτησης', isbn, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			callback(null, res)
		}
	})
}



exports.addNewBookToLib = (ISBN, loggedLibraryId, callback) => {

	sql.query('INSERT INTO `Αντίτυπο` (`ISBN`, `Αριθμός_αντιτύπου`, `Κωδικός_Βιβλιοθήκης`) \
				VALUES (?, NULL, ?);', [ISBN, loggedLibraryId], (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					callback(null, res)
				}
			})
}


exports.newBorrow = (userId, ISBN, bookNum, libraryId, loggedLibraryId, callback) => {

	sql.query('INSERT INTO `Δανεισμός` (`Κωδικός_δανεισμού`, `Κωδικός_μέλους`, `ISBN`, `Αρ_αντιτύπου`, `Ημερομηνία_δανεισμού`, `Ημερομηνία_που_επιστράφηκε`, `Βιβλιοθήκη_καταχώρησης_δανεισμού`, `Βιβλιοθήκη_καταχώρησης_επιστροφής`, `Κωδικός_βιβλιοθήκης_αντιτύπου`) VALUES \
			(NULL, ?, ?, ?, CURRENT_TIMESTAMP, NULL, ?, NULL, ?)', [userId, ISBN, bookNum, loggedLibraryId, libraryId], (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					callback(null, res)
				}
			})
}



exports.checkBorrow = (userId, callback) => {

	sql.query('SELECT (Όριο_δανεισμών - borrows  ) > 0 as possible\
	FROM ( \
	SELECT Όριο_δανεισμών\
	FROM Μέλος, Συνδρομή, Επιλογές_Συνδρομής\
	WHERE Κωδικός_μέλους=? AND Κωδ_μέλους=? AND Κωδ_συνδρομής=Κωδικός_συνδρομής \
	ORDER BY Αριθμός_συνδρομής\
	LIMIT 1) as max_possible, \
	(SELECT COUNT(*) as borrows\
	FROM Μέλος NATURAL JOIN Δανεισμός\
	WHERE Ημερομηνία_που_επιστράφηκε is NULL AND Κωδικός_μέλους=?) as made', 
	[userId,userId,userId], (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					callback(null, res)
				}
			})
}


exports.findExtraCost = (userId, isbn, bookId, libId, callback) => {
console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 1046 ~ libId", bookId)

	sql.query('SELECT IF (days>Διάρκεια_δανεισμού, ceil((days-Διάρκεια_δανεισμού) * Επιβάρυνση_καθυστέρησης_ασυνέπειας), 0) AS cost,\
	days-Διάρκεια_δανεισμού as extra_days\
	FROM \
	(SELECT Διάρκεια_δανεισμού, Επιβάρυνση_καθυστέρησης_ασυνέπειας\
	FROM Μέλος, Συνδρομή, Επιλογές_Συνδρομής\
	WHERE Κωδικός_μέλους=? AND Κωδ_μέλους=? AND Κωδ_συνδρομής=Κωδικός_συνδρομής \
	ORDER BY Αριθμός_συνδρομής\
	LIMIT 1) as t1,\
	(SELECT datediff(CURRENT_TIMESTAMP(),Ημερομηνία_δανεισμού) as days, Ημερομηνία_δανεισμού \
	 FROM `Δανεισμός` \
	 WHERE `Κωδικός_μέλους`=? AND `ISBN`=? AND `Αρ_αντιτύπου`=? AND Κωδικός_βιβλιοθήκης_αντιτύπου=? AND `Ημερομηνία_που_επιστράφηκε` IS NULL) as t2', 
	[userId,userId,userId, isbn, bookId, libId], (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 1046 ~ libId", libId)

					callback(null, res)
				}
			})
}

exports.findExtraCost = (userId, isbn, bookId, libId, callback) => {

	sql.query('SELECT IF (days>Διάρκεια_δανεισμού, ceil((days-Διάρκεια_δανεισμού) * Επιβάρυνση_καθυστέρησης_ασυνέπειας), 0) AS cost,\
	days-Διάρκεια_δανεισμού as extra_days\
	FROM \
	(SELECT Διάρκεια_δανεισμού, Επιβάρυνση_καθυστέρησης_ασυνέπειας\
	FROM Μέλος, Συνδρομή, Επιλογές_Συνδρομής\
	WHERE Κωδικός_μέλους=? AND Κωδ_μέλους=? AND Κωδ_συνδρομής=Κωδικός_συνδρομής \
	ORDER BY Αριθμός_συνδρομής\
	LIMIT 1) as t1,\
	(SELECT datediff(CURRENT_TIMESTAMP(),Ημερομηνία_δανεισμού) as days, Ημερομηνία_δανεισμού \
	 FROM `Δανεισμός` \
	 WHERE `Κωδικός_μέλους`=? AND `ISBN`=? AND `Αρ_αντιτύπου`=? AND Κωδικός_βιβλιοθήκης_αντιτύπου=? AND `Ημερομηνία_που_επιστράφηκε` IS NULL) as t2', 
	[userId,userId,userId, isbn, bookId, libId], (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					callback(null, res)
				}
			})
}



exports.returnBook = (userId, isbn, bookId, libId, loggedLibraryId, callback) => {
console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 1096 ~ userId", userId)

	sql.query('UPDATE Δανεισμός \
				SET Ημερομηνία_που_επιστράφηκε=CURRENT_TIMESTAMP, Βιβλιοθήκη_καταχώρησης_επιστροφής=?\
				WHERE ISBN=? AND Κωδικός_βιβλιοθήκης_αντιτύπου=? AND Αρ_αντιτύπου=? AND Ημερομηνία_που_επιστράφηκε IS NULL', 
	[loggedLibraryId,isbn,libId, bookId], (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					callback(null, res)
				}
			})
}

















////////////////
//   ADMIN    //
////////////////

exports.getCategories  = function(req, callback) { 

	const query = {
		sql: `SELECT * 
		FROM Κατηγορία 
		ORDER BY Όνομα`
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		
		callback(null, res)
	})
};


exports.addCategories  = function(categories, callback) { 


	let query = 'INSERT INTO `Κατηγορία` (`Κωδικός`, `Όνομα`) VALUES ';
	console.log('bef', categories)

	for (let index = 0; index < categories.length; index++) {
		if (index==0) query = query + '(NULL, ?)';
		else 			query = query + ',(NULL, ?)';
	}
	query += ';';


	sql.query(query, categories, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		// console.log('rows')
		// console.log(res.rows)
		
		callback(null, res)
	})
};


exports.removeCategory  = function(id, callback) { 

	sql.query('DELETE FROM `Κατηγορία`\
	 WHERE `Κατηγορία`.`Κωδικός` = ?;', id, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		
		callback(null, res)
	})
};


exports.newLibrary  = async function(libName, street, town, zip, phonesArray, password, callback) { 

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		sql.query('INSERT INTO `Βιβλιοθήκη` (`Κωδικός_Βιβλιοθήκης`, `Όνομα`, `Οδός`, `ΤΚ`, `Πόλη`, `Κωδικός_πρόσβασης`) \
		VALUES (NULL, ?, ?, ?, ?, ?);', [libName,street, zip, town,hashedPassword], (err, results) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
            
			let query = 'INSERT INTO `Αρ_Τηλ_Βιβλιοθήκης` (`Κωδικός_Βιβλιοθήκης`, `Τηλέφωνο_Βιβλ`) VALUES ';

			for (let index = 0; index < phonesArray.length; index++) {
				if (index==0) query += '('+results.insertId+', ?)';
				else		query += ',('+results.insertId+', ?)';
			}
			query += ';';
			console.log(query)

			sql.query(query, phonesArray, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				// console.log('results')
				// console.log(res)
				
				callback(null, res)
			})
		})
	} catch (error) {
		callback(error);
	}
};


exports.deleteLibrary  = function(id, callback) { 

	sql.query('DELETE FROM `Βιβλιοθήκη` \
			   WHERE `Βιβλιοθήκη`.`Κωδικός_Βιβλιοθήκης` = ?;', id, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		
		callback(null, res)
	})
};


exports.getSingleLibrary  = function(id, callback) { 

	sql.query('SELECT * FROM Βιβλιοθήκη NATURAL JOIN Αρ_Τηλ_Βιβλιοθήκης\
			   WHERE Βιβλιοθήκη.Κωδικός_Βιβλιοθήκης = ?;', id, (err, res) => {
    //   console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 774 ~ res", res)
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		// console.log('results')
		// console.log(res)
		
		callback(null, res)
	})
};



exports.editLibrary  = async function(libName, street, town, zip, phonesArray, id, callback) { 

	sql.query('UPDATE Βιβλιοθήκη \
			SET Όνομα=?, Οδός=?, ΤΚ=?, Πόλη=? \
			WHERE Κωδικός_Βιβλιοθήκης=?;', 
			[libName,street, zip, town, id], (err, results) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		sql.query('DELETE FROM `Αρ_Τηλ_Βιβλιοθήκης` \
		WHERE `Αρ_Τηλ_Βιβλιοθήκης`.`Κωδικός_Βιβλιοθήκης` = ?', id, (err, res) => {
			if (err) {
				console.log(err.stack)
				callback(err.stack)
			}
			// console.log('results')
			// console.log(res)
			let query = 'INSERT INTO `Αρ_Τηλ_Βιβλιοθήκης` (`Κωδικός_Βιβλιοθήκης`, `Τηλέφωνο_Βιβλ`) VALUES ';
                console.log("🚀 ~ file: library-network-model-remotemysql-com-mysql-db.js ~ line 810 ~ exports.editLibrary=function ~ phonesArray", phonesArray)

			for (let index = 0; index < phonesArray.length; index++) {
				if (index==0) query += '('+id+', ?)';
				else		query += ',('+id+', ?)';
			}
			query += ';';
			console.log(query)

			sql.query(query, phonesArray, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				// console.log('results')
				// console.log(res)
				
				callback(null, res)
			})	
		})            
			
	})
};



exports.newSubscription  = function(months, price, maxDays, maxBooks, extraMoney, callback) { 

	sql.query('INSERT INTO `Επιλογές_Συνδρομής` \
	(`Κωδικός_συνδρομής`, `Διάρκεια`, `Τιμή`, `Διάρκεια_δανεισμού`, `Επιβάρυνση_καθυστέρησης_ασυνέπειας`, `Όριο_δανεισμών`) \
	VALUES (NULL, ?, ?, ?, ?, ?)', [months, price, maxDays, extraMoney, maxBooks], (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		callback(null,res)
		
        
	})
	
};



exports.deleteSubscription  = function(id, callback) { 

	sql.query('DELETE FROM `Επιλογές_Συνδρομής` \
			   WHERE `Επιλογές_Συνδρομής`.`Κωδικός_συνδρομής` = ?', 
	[id], (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		callback(null,res)
		
        
	})
	
};


