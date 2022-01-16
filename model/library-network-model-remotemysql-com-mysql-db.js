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

function getMeetingIdFromUrl(url, callback) {

	const query = {
		text: `SELECT "MeetingId" FROM public."Meeting" WHERE "MeetingUrl" = $1;`,
		values: [url],
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

function getNamesById(userIds, callback) {

	// const userIdToName;

	const query = {
		text: `SELECT * FROM public."User" WHERE "UserId" = ANY($1::int[]);`,
		values: [userIds],
	}
	sql.query(query)
		.then(res => {
			// console.log(res)
			const IdsToSignedTempIds = {};
			// const TempIdToUserId = {}
			// const SignedIdToUserId = {}
			res.rows.forEach(el => {
				if (el.TempId) IdsToSignedTempIds[el.UserId] = {TempId:el.TempId};
				else IdsToSignedTempIds[el.UserId] = {SignedUserId:el.SignedUserId}
			})
			getNames(IdsToSignedTempIds);
		})
		.catch(e => {
			console.log(e)
			callback(e)
		})

	function getNames(IdsToSignedTempIds){
		// const TempIds = IdsToSignedTempIds.filter(el => el.TempId)
		const promiseList = [];

		for (const [id, value] of Object.entries(IdsToSignedTempIds)) {
			let query;
			if (value.SignedUserId) {
				query = {
					text: `SELECT * FROM public."Signed User" WHERE "SignedUserId" = $1;`,
					values: [value.SignedUserId],
				}
			}
			else {
				query = {
					text: `SELECT * FROM public."Temporary User" WHERE "TempId" = $1;`,
					values: [value.TempId],
				}
			}
			promiseList.push(
				sql.query(query)
			)
		}
		Promise.all(promiseList)
			.then(res => {
				// console.log(res)
				const TempNames = {};
				const SignedNames = {}
				res.forEach(eachRes => {
					let el = eachRes.rows[0];
					if (el.SignedUserId) {
						SignedNames[el.SignedUserId] = el.UserName
						
					}
					else {
						TempNames[el.TempId] = el.TempName
					}
				})
				for (const [id, value] of Object.entries(IdsToSignedTempIds)) {
				
					if (value.SignedUserId) {
						value.name = SignedNames[value.SignedUserId];
					}
					else {
						value.name = TempNames[value.TempId];
					}
				}
				callback(null, IdsToSignedTempIds)
			})
			.catch(e => {
				console.log(e)
				callback(e)
			})
	}

}

exports.addMeeting = function (newData, loggedUserId, callback) {
 	// console.log('addong to db', newData)

	let url = makeid(6);
	let userId;
	console.log('url', url)

	getMeetingIdFromUrl(url, callbackFunc);

	function callbackFunc(err, result) {
		if (err) {
			callback(err);
		}
		if (result.rowCount !== 0){
			url = makeid(6)
			console.log(url)
			getMeetingIdFromUrl(url,callbackFunc)
		}
		else {
			createMeeting();
		}
	} 

	// function findUserId() {
	// 	const query = {
	// 		text: `SELECT "UserId" FROM public."User" WHERE "SignedUserId" = ($1);`,
	// 		values: [loggedUserId],
	// 	}
	
	// 	sql.query(query, (err, res) => {
	// 		if (err)
	// 			callback(err.stack, null);
	// 		else {
	// 			userId = res.rows[0].UserId
	// 			createMeeting();
	// 		}
	// 	})
	// }

	function createMeeting(){
		const query = {
			text: `INSERT INTO public."Meeting" \
			("MeetingState", "MeetingTitle", "MeetingDescription", "MeetingDateCreated", \
			"MeetingSingleVote", "MeetingUrl","MeetingCreator") \
			VALUES	('open', $1, $2, CURRENT_TIMESTAMP, $3, $4, $5) RETURNING "MeetingId";`,
			values: [newData.name, newData.description, newData.oneVote, url, loggedUserId],
		}
	
		sql.query(query, (err, result) => {
			if (err)
				callback(err.stack, null);
			else {
				writeDates(result.rows[0].MeetingId)
			}
		})
	}

	function writeDates(MeetingId) {
		const promiseList = []
		newData.lista.forEach((element, index) => {
			const year = element.date.slice(-4)
			const month = element.date.slice(0,2)
			const day = element.date.slice(3,5)
			const startHour = element.startTime.slice(0,2)
			const endHour = element.endTime.slice(0,2)
			const startMinutes = element.startTime.slice(3,5)
			const endMinutes = element.endTime.slice(3,5)

			const startTimestamp = `make_timestamp(${year},${month},${day},${startHour},${startMinutes},0.0)`
			const endTimestamp = `make_timestamp(${year},${month},${day},${endHour},${endMinutes},0.0)`

			const query = {
				text: `INSERT INTO public."Date" \
				("MeetingId", "DateId", "StartDate", "EndDate") VALUES
				($1, $2, ${startTimestamp}, ${endTimestamp});`,
				values: [MeetingId, index+1],
				}
			promiseList.push(
				sql.query(query)
			)
		});
		Promise.all(promiseList)
			.then(callback(null, url))
			.catch(e => callback(e))
	}

}



exports.addVotes = function (req, callback) {
	const url = req.params.url;
	const votes = req.body;
	const name = req.params.name;
	const userId = req.session.userId;
	// console.log(newData)

	let meetingId;

	new Promise( (resolve) => {
		getMeetingIdFromUrl(url, (err, result) => {
			if (err) {
				callback(err);
			}
			meetingId = result.rows[0].MeetingId
			resolve()
		})
	})
	.then( () => {
		return new Promise((resolve) => {
			let query;
			if (req.session.loggedUserName) {
				query = {
					text: `UPDATE "Signed User" \
					SET "UserName" = $1 \
					WHERE "SignedUserId" = $2;`,
					values: [name, req.session.loggedUserId],
				}
			}
			else {
				query = {
					text: `UPDATE "Temporary User" \
					SET "TempName" = $1 \
					WHERE "TempId" = $2;`,
					values: [name, req.session.tempUserId],
				}
			}
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					resolve()
					// callback(null, data, votes)
				}
			})
		})
	})
	.then( () => {
		return new Promise((resolve) => {
			const query = {
				text: `SELECT "MeetingSingleVote" FROM public."Meeting" WHERE "MeetingId" = $1;`,
				values: [meetingId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					if ((votes.length > 1) && (res.rows[0].MeetingSingleVote)) callback(null, true)
					resolve()
					// callback(null, data, votes)
				}
			})
		})
	})
	.then( () => {
		return new Promise((resolve) => {
			const query = {
				text: `DELETE FROM public."Vote" WHERE "MeetingId" = $1 AND "UserIdVote" = $2;`,
				values: [meetingId,userId],
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					resolve()
				}
			})
		})
	})
	.then( () => {
		const promiseList = []
		votes.forEach(el => {
			const query = {
				text: `INSERT INTO public."Vote" \
				("MeetingId", "UserIdVote", "VoteDateId") VALUES
				($1, $2, $3);`,
				values: [meetingId, userId, el],
				}
			promiseList.push(
				sql.query(query)
			)
		})
		Promise.all(promiseList)
			.then(callback(null))
			.catch(e => {
				console.error(e)
				callback(e)
			})
	})
	.catch(e => {
		console.error(e)
		callback(e)
	})

}



exports.checkIfClosedAndIfUserIsCreator = function(req, callback) {
	const url = req.params.url;
	const loggedUserId = req.session.loggedUserId;
	
	const query = {
		text: `SELECT * FROM public."Meeting" WHERE "MeetingUrl" = $1;`,
		values: [url],
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			const closed = res.rows[0].MeetingState != 'open';
			const check = res.rows[0].MeetingCreator == loggedUserId;
			callback(null, closed, check)
		}
	})

}


exports.chooseFinalOption = function(req, callback) {
	
	const url = req.params.url;

	const dateId = req.body[0]

	const query = {
		text: `UPDATE "Meeting" \
			SET "MeetingState" = $1 \
			WHERE "MeetingUrl" = $2;`,
		values: [`'${dateId}'`,url],
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}
		else {
			callback(null)
		}
	})
}




















//// LOGIN REGISTER ////


function getUserNames(username, callback) {

	const query = {
		text: `SELECT * FROM "public"."Signed User" WHERE "UserEmail"=$1;`,
		values: [username]
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
// Επιστρέφει τον χρήστη με όνομα 'username'
exports.getUserByUsername = (username, callback) => {

	getUserNames(username, callbackFunction);
	
	function callbackFunction(err, res) {
		let user;
		if (err) {
			callback(err);
		}
		if (res.rowCount == 0){
			console.log("No such user exists")
			callback(null)
		}
		else {
			user = { id: res.rows[0].SignedUserId, useremail: res.rows[0].UserEmail, username: res.rows[0].UserName, password: res.rows[0].UserPassword };
			const query = {
				text: `SELECT "UserId" FROM public."User" WHERE "SignedUserId"=$1;`,
				values: [user.id]
			}
		
			sql.query(query, (err, res) => {
				if (err) {
					console.log(err.stack)
					callback(err.stack)
				}
				else {
					user.userId = res.rows[0].UserId
					callback(null, user)
		
				}
			})
		}
		
	} 

}
function addNewUser(userfullname, email, password, callback) {

	const query = {
		text: `INSERT INTO "public"."Signed User" ("UserName", "UserEmail", "UserPassword") VALUES
		($1, $2, $3);`,
		values: [userfullname, email, password]
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
exports.registerUser = function (username, email, password, callback) {
    // ελέγχουμε αν υπάρχει χρήστης με αυτό το username
    exports.getUserByUsername(email, async (err, user) => {
        if (user != undefined) {
            callback(null, null, { message: "Υπάρχει ήδη χρήστης με αυτό το όνομα" })
        } else {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
				addNewUser(username, email, hashedPassword, callbackFunction)
				function callbackFunction(err, res) {
					let user;
					if (err) {
						callback(err);
					}
					callback(null,res);
				}

            } catch (error) {
                callback(error);
            }
        }
    })
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

exports.getBooks  = function(req, callback) { 

	const query = {
		sql: `SELECT * FROM Έντυπο LEFT OUTER JOIN Συγγραφείς USING(ISBN)`
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log(err.stack)
			callback(err.stack)
		}

		// console.log('books model')

		console.log(res)
		
		callback(null, res)
	})

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
		sql: `SELECT new_t.ISBN, new_t.Βιβλιοθήκη_τώρα, Όνομα, COUNT(*) as Ποσότητα
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
		IF (Δανεισμός.Κωδικός_δανεισμού is NULL and Κωδικός_μεταφοράς is NOT NULL AND Κατάσταση_παραλαβής=0, Κωδικός_Βιβλιοθήκης_προορισμού, NULL) AS Μεταφέρεται_σε,
		IF (Δανεισμός.Κωδικός_δανεισμού is NOT NULL and Κωδικός_μεταφοράς is NULL AND Βιβλιοθήκη_καταχώρησης_επιστροφής is NULL, Δανεισμός.Κωδικός_μέλους, NULL) AS Δανεισμένο_σε
		
		FROM
			(   -- Πρώτα βρίσκω τα τελευταία και μετά βρίσκω λεπτομέρειες
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
        ORDER BY new_t.Βιβλιοθήκη_τώρα`
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


	sql.query('SELECT new_t.ISBN, new_t.Βιβλιοθήκη_τώρα, Όνομα, COUNT(*) as Ποσότητα FROM\
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
	ORDER BY new_t.Βιβλιοθήκη_τώρα', isbn, (err, res) => {
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