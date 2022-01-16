'use strict';

const sql = require('./db.remotemysql-com-mysql.js');
const bcrypt = require('bcrypt')


function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
    	result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   	}  
   return result.join('');
}
















//// LOGIN REGISTER ////

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







// Επιστρέφει τον χρήστη με όνομα 'username'

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
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username

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
				let query = 'INSERT INTO Τηλ_Μέλους (Αρ_Τηλ, ID_μέλους)';

				for (let index = 0; index < phonesArray.length; index++) {
					query = query + ' VALUES (?, '+results.insertId+')';
				}

				console.log(query)

				sql.query(query, phonesArray, (err, res) => {
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
			}
			else {
				callback(null, results)
			}

			

		})
	} catch (error) {
		callback(error);
	}
	
}

















exports.getLibraries  = function(req, callback) { 

	const query = {
		sql: `SELECT *
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
		sql: `SELECT *
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
		sql.query('SELECT *\
		FROM Έντυπο LEFT OUTER JOIN Συγγραφείς USING(ISBN)\
		WHERE ISBN LIKE ? OR Τίτλος LIKE ? OR Συγγραφέας LIKE ?'
		, [search, search, search], (err, res) => {
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
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// TODO Replace with VIEW μεταξυ των μεγαλων κενών
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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


exports.getLocationsOfBook  = function(req, callback) { 
	const isbn = req.params.ISBN;


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
		// console.log(res)
		
		callback(null, res)
	})

};





exports.getBook  = function(req, callback) { 

	const isbn = req.params.ISBN;

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
	const userId = req.body.userId;

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



exports.checkForNewReservation  = function(req, callback) {
	const userId = req.body.userId;

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

exports.getBookCategories  = function(req, callback) {
	const isbn = req.params.ISBN;

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






















// function getUserId(signeduserid, callback) {

// 	const query = {
// 		text: `SELECT * FROM "public"."User" WHERE "SignedUserId"=$1;`,
// 		values: [signeduserid]
// 	}

// 	  sql.query(query, (err, res) => {
// 		if (err) {
// 			console.log(err.stack)
// 			callback(err.stack)
// 		}
// 		else {
// 			callback(null, res)

// 		}
// 	})
// }

function getCreatedMeetings(signeduserid, callback) {

	const query = {
		text: `SELECT * FROM "public"."Meeting" WHERE "MeetingCreator"=$1;`,
		values: [signeduserid]
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

function getnumofvotes(meetid, callback){
	const query = {
		text: `SELECT COUNT(DISTINCT "Vote"."UserIdVote") FROM "public"."Vote" WHERE "Vote"."MeetingId"=$1;`,
		values: [meetid]
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

function getchosendate(meetid, dateid, callback){
	const query = {
		text: `SELECT "StartDate" FROM "Date" WHERE "MeetingId"=$1 AND "DateId"=$2;`,
		values: [meetid, parseInt(dateid.substr(1,dateid.length),10)]
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

exports.showMyMeetings = function (req, callback) {
	// console.log(req.session)
    // console.log("🚀 ~ file: meet--me-model-heroku-pg-db.js ~ line 790 ~ req.session.loggedUserId", req.session.loggedUserId)

	const userid = req.session.loggedUserId



			let meetings =[];

			getCreatedMeetings(userid, clbfc);

			async function clbfc(err, res){
				if(err){
					callback(err)
				}
				else{
					const promiseList = []
					for(let i in res.rows){

							console.log("asas",res.rows[i])
							let numofparts;
							promiseList.push ( new Promise((resolve, rej) =>{
								
								getnumofvotes(res.rows[i].MeetingId, callfunc)
								function callfunc(err, rescounts){
									if(err){
										callback(err)
									}
									else{
										numofparts = rescounts.rows[0].count;
										if(res.rows[i].MeetingState!="open"){
											getchosendate(res.rows[i].MeetingId, res.rows[i].MeetingState, callbackfuncdate);
											function callbackfuncdate(errdate, resdate){
												if(errdate){
													callback(errdate)
												}
												else{
													let chosendate = resdate.rows[0].StartDate
													meetings.push({closed: true, meetingTitle: res.rows[i].MeetingTitle, meetingDescription: res.rows[i].MeetingDescription, meetingDateCreated: res.rows[i].MeetingDateCreated, meetingUrl: res.rows[i].MeetingUrl, numberOfParticipants: numofparts, finalDate: chosendate.toLocaleString("en-GB",{}).replace(',',''), name:req.session.loggedUserName})
													resolve()
													// callback(null,meetings)
												}
											}
										}
										else{
											meetings.push({closed: false, meetingTitle: res.rows[i].MeetingTitle, meetingDescription: res.rows[i].MeetingDescription, meetingDateCreated: res.rows[i].MeetingDateCreated, meetingUrl: res.rows[i].MeetingUrl, numberOfParticipants: numofparts, name:req.session.loggedUserName})
											resolve()
											// callback(null,meetings)
										}
				
									}
		
								}
							}))
							
					}

					Promise.all(promiseList)
						.then( () => {
							console.log('meetings', meetings)
							callback(null,meetings)
						})
						.catch(e => {
							console.log(e)
							callback(e)
						})
			


					
					
					

				}
			}
		

	

}