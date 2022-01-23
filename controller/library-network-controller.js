'use strict';

const model = require('../model/library-network-model-remotemysql-com-mysql-db.js');
const bcrypt = require('bcrypt');
// const e = require('express');
const fs = require('fs');
// const { redirect } = require('express/lib/response');
const path = require('path');
const formidable = require('formidable');
// const res = require('express/lib/response');
const { join } = require('path');






exports.renderHome = function (req, res, next) {
    let loggedin=false;
    if (req.session.loggedUserName){
        loggedin = true;
    }
    res.render('home', {style: ['home'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
}

exports.renderLibraries = (req, res) => {
    model.getLibrariesAndQtt(req, (err, libraries)=> {
        if (err) {
            res.send(err);
        }

        let last = null;
        let indexOfLast = 0;

        for (let index = 0; index < libraries.length; index++) {
            // console.log(last);
            // console.log("🚀 ~ file: library-network-controller.js ~ line 25 ~ model.getLibraries ~ libraries[index].Κωδικός_Βιβλιοθήκης", libraries[index].Κωδικός_Βιβλιοθήκης);

			if (last==libraries[index].Κωδικός_Βιβλιοθήκης) {
                libraries[indexOfLast].Τηλέφωνο_Βιβλ.push(libraries[index].Τηλέφωνο_Βιβλ);
                libraries[indexOfLast].multiple_numbers=1
                libraries[index].Όνομα=null;
            }
            else {
                libraries[index].Τηλέφωνο_Βιβλ = [libraries[index].Τηλέφωνο_Βιβλ];
                last = libraries[index].Κωδικός_Βιβλιοθήκης;
                indexOfLast = index;
                libraries[index].multiple_numbers=0
            }
		}
        // console.log('libraries')
        // console.log(libraries)
        let loggedin=false;
        

        if (req.session.loggedUserName){
            loggedin = true;
        }
        
        res.render('libraries',{libraries: libraries, style: ['libraries'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
        
    });
}

exports.renderSubscriptions = (req, res) => {
    model.getSubscriptions(req, (err, subscriptions)=> {
        if (err) {
            res.send(err);
        }

        subscriptions.forEach(item=>{
            if (item.Διάρκεια>1) item.month_end='ες';
            else  item.month_end='α';
        })

        // console.log(subscriptions)
        let loggedin=false;
        

        if (req.session.loggedUserName){
            loggedin = true;
        }

        if (req.session.admin){
            res.render('subscriptions',{subscriptions: subscriptions, style: ["libraries-admin","subscriptions-admin"], partialContext: {name:'Admin'}, admin:true, loggedin:true});
        }
        else{
            res.render('subscriptions',{subscriptions: subscriptions, style: ["libraries-admin","subscriptions-admin"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
        }
    });
}


exports.renderBooks = (req, res) => {

    let search;
    if (req.query.search){
        search=`%${req.query.search}%`
    }


    model.getBooks(search, (err, books)=> {
        // console.log("🚀 ~ file: library-network-controller.js ~ line 92 ~ model.getBooks ~ books", books)
        if (err) {
            res.send(err);
        }
        if (books.length===0){
            let loggedin=false;
        

            if (req.session.loggedUserName){
                loggedin = true;
            }
            // res.render('books',{no_result: req.query.search, style: ["books"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin});
        }
        else{

            model.getLocations(req, (err, locations)=> {
                if (err) {
                    res.send(err);
                }

                model.bookCountAllISBN(null, (err, book_counts)=> {
                    // console.log("🚀 ~ file: library-network-controller.js ~ line 112 ~ model.bookCountAllISBN ~ book_counts", book_counts)
                    if (err) {
                        res.send(err);
                    }

                    // console.log(books)
        
                    let allBooks = {};
    
                    books.forEach(item=>{
                        if (allBooks[item.ISBN]){
                            allBooks[item.ISBN].Συγγραφείς.push(', '+item.Συγγραφέας);
                            allBooks[item.ISBN].writers_end='είς';
                        }
                        else{
                            let temp= {
                                ISBN:item.ISBN,
                                Τίτλος:item.Τίτλος,
                                Έκδοση:item.Έκδοση,
                                Εκδοτικός_οίκος:item.Εκδοτικός_οίκος,
                                Συγγραφείς: [item.Συγγραφέας],
                                writers_end:'έας',
                                locations:[],
                                total_books_count:0,
                                not_available:1,
                                imageFile: checkCoverImage(item.ISBN)
                            };
                            allBooks[item.ISBN] = temp;
                            // console.log(temp.imageFile)
                        }
                        
                    });
                    // console.log(allBooks)
                    // console.log(locations)
                    locations.forEach(item=>{
                        // console.log(item.ISBN)
                        if (allBooks[item.ISBN]) {
                            allBooks[item.ISBN].locations.push({
                                available:`${item.Όνομα}: ${item.Ποσότητα}`,
                                kratiseis: item.Κρατήσεις,
                                kratiseis_str: item.Κρατήσεις>1 ? 'Κρατήσεις' : 'Κράτηση'
                            });
                            allBooks[item.ISBN].not_available=0;
                        }
                    });

                    book_counts.forEach(item=>{
                        if (allBooks[item.ISBN])
                        allBooks[item.ISBN].total_books_count = item.total_books_count;
                    })

                    model.getCategories(req, (err, categories)=> {
                        if (err) {
                            res.send(err);
                        }

                        model.getLibrariesNoPhone(req, (err, libraries)=> {
                            if (err) {
                                res.send(err);
                            }                        
        
                    // console.log('end')
                    // console.log(allBooks)
                        // console.log(Object.values(allBooks));
                            let loggedin=false;
                

                            if (req.session.loggedUserName){
                                loggedin = true;
                            }
                            if (req.session.loggedLibraryId){
                                res.render('books',{books: allBooks,categories:categories, libraries:libraries, style: ["books"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, libraryLogged:true, loggedin:loggedin});
                            }
                            else {
                                res.render('books',{books: allBooks,categories:categories, libraries:libraries, style: ["books"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin});
                            }
                        });
                    })
                })       
            });
        }
    });
}




function checkCoverImage(ISBN) {
    // console.log(__dirname)
    const imagePath1 = `./public/images/${ISBN}.jpg`;
    const imagePath2 = `./public/images/${ISBN}.jpeg`;
    const imagePath3 = `./public/images/${ISBN}.png`;

    // console.log(imagePath1)

    let imageFile;
    try {
        if (fs.existsSync(imagePath1)) {
            imageFile = `/images/${ISBN}.jpg`;
        }
        else if (fs.existsSync(imagePath2)){
            imageFile = `/images/${ISBN}.jpeg`;
        }
        else if (fs.existsSync(imagePath3)){
            imageFile = `/images/${ISBN}.png`;
        }
    } catch(err) {
        throw(err)
    }

    return imageFile;
}

exports.renderBook = (req, res) => {

    model.getBook(req.params.ISBN, (err, book) => {
        
        if (err) {
            res.send(err);
        }
        if (book.length==0 || book==undefined) {
            let loggedin=false;
            if (req.session.loggedUserName){
                loggedin = true;
            }
            res.render('not_found', {layout:'404.hbs', partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin});
        }
        else{
            model.getLocationsOfBook(req.params.ISBN, (err, locations)=> {
            if (err) {
                res.send(err);
            }
            // console.log(req.params.ISBN)

    
                model.getBookCategories(req.params.ISBN, (err, categories)=> {
                    if (err) {
                        res.send(err);
                    }
                    // console.log(req.params.ISBN)

                    model.bookCountAllISBN(req.params.ISBN, (err, total_books_count)=> {
                        if (err) {
                            res.send(err);
                        }
        
                        let imageFile = checkCoverImage(book[0].ISBN);

                        const writers = [];

                        book.forEach((element, i)=>{
                            if (i==0)
                                writers.push(element.Συγγραφέας);
                            else
                                writers.push(', '+element.Συγγραφέας);
                        });

                        let writers_end = 'έας';

                        if (writers.length>1) {
                            writers_end = 'είς'
                        }

                        categories.forEach((element, i)=>{
                            if (i!=0)
                                element.Όνομα = ' | '+element.Όνομα
                        });

                        locations.forEach(element => {
                            if (element.Κρατήσεις>1){
                                element.Κρατήσεις_str='Κρατήσεις';
                            }
                            else {
                                element.Κρατήσεις_str='Κράτηση';
                            }
                        });

                        // console.log (locations)
                        let loggedin=false;
                        if (req.session.loggedUserName){
                            loggedin = true;
                        }
                        // console.log(total_books_count)
                            
                        res.render('book',{book: book[0],writers_end:writers_end, total_books_count:total_books_count[0].total_books_count,
                            locations: locations, categories:categories, writers: writers,  imageFile: imageFile, style: ["book"]
                            , partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
                    });
                });

            });
        }
    });
}

exports.renderBookErrorReservation = (req, res) => {

    model.getBook(req.params.ISBN, (err, book) => {
        
        if (err) {
            res.send(err);
        }

        if (book==undefined) {
            let loggedin=false;
            if (req.session.loggedUserName){
                loggedin = true;
            }
            res.render('error', {layout:'404.hbs', partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin});
        }


        model.getLocationsOfBook(req.params.ISBN, (err, locations)=> {
            if (err) {
                res.send(err);
            }
    
            model.getBookCategories(req.params.ISBN, (err, categories)=> {
                if (err) {
                    res.send(err);
                }

                model.bookCountAllISBN(req.params.ISBN, (err, total_books_count)=> {
                    if (err) {
                        res.send(err);
                    }
    
                    let imageFile = checkCoverImage(book[0].ISBN);

                    const writers = [];

                    book.forEach((element, i)=>{
                        if (i==0)
                            writers.push(element.Συγγραφέας);
                        else
                            writers.push(', '+element.Συγγραφέας);
                    });

                    let writers_end = 'έας';

                    if (writers.length>1) {
                        writers_end = 'είς'
                    }

                    categories.forEach((element, i)=>{
                        if (i!=0)
                            element.Όνομα = ' | '+element.Όνομα
                    });

                    locations.forEach(element => {
                        if (element.Κρατήσεις>1){
                            element.Κρατήσεις_str='Κρατήσεις';
                        }
                        else {
                            element.Κρατήσεις_str='Κράτηση';
                        }
                    });

                    // console.log (locations)
                    let loggedin=false;
                    if (req.session.loggedUserName){
                        loggedin = true;
                    }
                    res.render('book',{book: book[0],writers_end:writers_end,
                        locations: locations,alert:'Αποτυχία', categories:categories, writers: writers,  imageFile: imageFile, style: ["book"],
                        partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
                })
            });

        });


    });
}

exports.renderBookSuccessfulReservation = (req, res) => {

    model.getBook(req.params.ISBN, (err, book) => {
        
        if (err) {
            res.send(err);
        }

        if (book==undefined) {
            let loggedin=false;
            if (req.session.loggedUserName){
                loggedin = true;
            }
            res.render('error', {layout:'404.hbs', partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin});
        }


        model.getLocationsOfBook(req.params.ISBN, (err, locations)=> {
            if (err) {
                res.send(err);
            }
    
            model.getBookCategories(req.params.ISBN, (err, categories)=> {
                if (err) {
                    res.send(err);
                }
                model.bookCountAllISBN(req.params.ISBN, (err, total_books_count)=> {
                    if (err) {
                        res.send(err);
                    }
    
                    let imageFile = checkCoverImage(book[0].ISBN);

                    const writers = [];

                    book.forEach((element, i)=>{
                        if (i==0)
                            writers.push(element.Συγγραφέας);
                        else
                            writers.push(', '+element.Συγγραφέας);
                    });

                    let writers_end = 'έας';

                    if (writers.length>1) {
                        writers_end = 'είς'
                    }

                    categories.forEach((element, i)=>{
                        if (i!=0)
                            element.Όνομα = ' | '+element.Όνομα
                    });

                    locations.forEach(element => {
                        if (element.Κρατήσεις>1){
                            element.Κρατήσεις_str='Κρατήσεις';
                        }
                        else {
                            element.Κρατήσεις_str='Κράτηση';
                        }
                    });

                    // console.log (locations)
                    let loggedin=false;
                    if (req.session.loggedUserName){
                        loggedin = true;
                    }
                    res.render('book',{book: book[0],writers_end:writers_end,
                        locations: locations,alert:'Επιτυχία', categories:categories, writers: writers,  imageFile: imageFile, style: ["book"], 
                        partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
                })
            });

        });


    });
}
    
exports.newReservation = (req, res) => {
    // console.log(req.session.loggedUserId)
    if (req.session.loggedUserId) {
        model.checkForNewReservation(req.session.loggedUserId, (err, userId)=> {
            if (err) {
                res.send(err);
            }

            // console.log(userId[0])

            if (userId[0]){// success
                model.makeNewReservation(req, (err, result)=> {
                    if (err) {
                        res.send(err);
                    }
                    
                    // console.log('success')

                    res.redirect(`/book/${req.params.ISBN}/success`);
            
                });
                
            }
            else { // not success
                res.redirect(`/book/${req.params.ISBN}/error`);
            }
            

        });
    }
    else {
        res.redirect(`/book/${req.params.ISBN}/error`);
    }
    
}































// LOGIN REDISTER //




exports.doLogin = function (req, res) {
    //Ελέγχει αν το username και το password είναι σωστά και εκτελεί την
    //συνάρτηση επιστροφής authenticated

    model.getUser(req.body.UserEmailOrPhone, (err, user) => {
        if (user == undefined) {
            res.render('home', {alert: 'Λάθος στοιχεία', style: ["home"]})
        }
        else {
            //Θέτουμε τη μεταβλητή συνεδρίας "loggedUserId"

            async function checkcode(){
                // console.log(req.body.UserPass)
                                
                bcrypt.compare(req.body.UserPass, user[0].Κωδικός_πρόσβασης, function(err, isMatch) {
        // console.log("🚀 ~ file: library-network-controller.js ~ line 542 ~ model.getUser ~ user", user)

                    if (err) {
                    throw err
                    } else if (!isMatch) {
                        res.render('home', {alert: 'Λάθος κωδικός', style: ["home"]})
                    } else {
                        req.session.loggedUserId = user[0].Κωδικός_μέλους;
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 450 ~ bcrypt.compare ~ req.session.loggedUserId", req.session.loggedUserId)
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 450 ~ bcrypt.compare ~ user[0].Κωδικός_μέλους", user[0].Κωδικός_μέλους)
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 602 ~ bcrypt.compare ~ user[0]", user[0])
                        req.session.loggedUserName = user[0].Όνομα + ' ' + user[0].Επίθετο;
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 564 ~ bcrypt.compare ~ user[0].Όνομα", user[0].Όνομα)
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 564 ~ bcrypt.compare ~ req.session.loggedUserName", req.session.loggedUserName)
                        // req.session.userId = user.userId

                        // res.render('home', {alert: 'Επιτυχής σύνδεση', style: ['home'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:true})

                        // save function needed if a redirect is made
                        async function saveit(){
                            await req.session.save()
                            // console.log(req.session)
                            // const redirectTo = "/loggedin";      
                            res.redirect('/')         
                        }
                        saveit();
                    }
                })
            }
            checkcode();
        }
    })
}



//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένςου χρήστες
// exports.checkAuthenticated = function (req, res, next) {
//     //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
//         // console.log("🚀 ~ file: library-network-controller.js ~ line 475 ~ req.originalUrl", req.session)

//     if (req.session.loggedUserId) {
//         console.log("user is authenticated", req.originalUrl);
//         //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
//         next();
//     }
//     else {
//         res.render('home', {style: ['home'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
//     }
// }


exports.doLogout = (req, res) => {
    //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
    // console.log("loggedout")
    req.session.destroy();
    res.redirect('/');
}

exports.doRegister = function (req, res) {
    const UserData = Object.keys(req.body)
    const Phones = {}
    // console.log("🚀 ~ file: library-network-controller.js ~ line 648 ~ Register")


    for (let index = 0; index < UserData.length; index++) {
            // console.log("🚀 ~ file: library-network-controller.js ~ line 571 ~ req.body[UserData[index]]", req.body[UserData[index]])
            // console.log("🚀 ~ file: library-network-controller.js ~ line 571 ~ UserData[index].slice(0,8)", UserData[index].slice(0,8))

        if (UserData[index].slice(0,8)==='LibPhone' && req.body[UserData[index]]) {
            Phones[req.body[UserData[index]]] = 1
        }
    }

    // console.log(Phones)

    // console.log(Phones)
    // model.registerUser(req.body.username, req.body.password, (err, result, message) => {
    model.getAllUsers(req, (err, users) => {

        let checkFalseEmail = 0;
        let checkFalsePhone = 0;

        for (let index = 0; index < users.length; index++) {
            // console.log('l', users[index].email, users[index].Αρ_Τηλ)
            // console.log('body', req.body.UserEmail)
            if (users[index].email==req.body.UserEmail && users[index].email!=null && req.body.UserEmail!=null){
                checkFalseEmail = 1;
                break;
            }
            else if (users[index].Αρ_Τηλ in Phones && users[index].Αρ_Τηλ!=null){
                checkFalsePhone = 1;
                break;
            }
        }

        if (checkFalseEmail) {
            res.render('home', {alert: 'To email χρησιμοποιείται ήδη', style: ["home"]});
        }
        else if (checkFalsePhone) {
            res.render('home', {alert: 'To τηλέφωνο χρησιμοποιείται ήδη', style: ["home"]});
        }
        else{
            model.registerUser(req.body.UserName, req.body.LastName, req.body.UserEmail, req.body.UserPass, Phones, req.body.Street, req.body.Town, req.body.Zip, (err, result) => {
        
                if (err) {
                    console.error('registration error: ' + err);
                    res.render('home', {alert: 'Προέκυψε κάποιο σφάλμα', style: ["home"]});
                }
                else {
                    res.render('home', {alert: 'Επιτυχής εγγραφή', style: ["home"]});
                }
            })
        }
    })
}



















/////////////////////
//      STAFF      //
/////////////////////


exports.renderLibrariesLogin = (req, res) => {
    model.getLibrariesNoPhone(req, (err, libraries)=> {
        if (err) {
            res.send(err);
        }

        let loggedin=false;
        if (req.session.loggedUserName){
            loggedin = true;
        }

        res.render('staff-login',{libraries: libraries, style: ["admin", "admin-login"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
    });
}



exports.doStaffLogin = function (req, res) {
    //Ελέγχει αν το username και το password είναι σωστά και εκτελεί την
    //συνάρτηση επιστροφής authenticated
    // console.log(Object.keys(req.body))

    model.getSingleLibrary(req.body.selectLibrary, (err, user) => {
        if (user == undefined) {

            res.redirect('/staff-login')

        }
        else {
            //Θέτουμε τη μεταβλητή συνεδρίας "loggedUserId"

            async function checkcode(){
                // console.log(req.body.UserPass)
                                
                bcrypt.compare(req.body.LibraryPass, user[0].Κωδικός_πρόσβασης, function(err, isMatch) {
                // console.log("🚀 ~ file: library-network-controller.js ~ line 674 ~ bcrypt.compare ~ user[0].Κωδικός_πρόσβασης", user[0].Κωδικός_πρόσβασης)
                // console.log("🚀 ~ file: library-network-controller.js ~ line 674 ~ bcrypt.compare ~ req.body.selectLibrary", req.body.selectLibrary)

                    if (err) {
                    throw err
                    } else if (!isMatch) {
                        model.getLibrariesNoPhone(req, (err, libraries)=> {
                            if (err) {
                                res.send(err);
                            }
                    
                            let loggedin=false;
                            if (req.session.loggedUserName){
                                loggedin = true;
                            }
                    
                            res.render('staff-login',{alert: 'Λάθος στοιχεία', libraries: libraries, style: ["admin", "admin-login"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:loggedin})
                        });
                    } else {
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 686 ~ bcrypt.compare ~ req.session.LibraryId bef ", req.session)

                        //req.session.destroy();
                       req.session.loggedUserId=undefined;
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 686 ~ bcrypt.compare ~ req.session.LibraryId mid", req.session)

                        req.session.loggedLibraryId = user[0].Κωδικός_Βιβλιοθήκης
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 686 ~ bcrypt.compare ~ req.session.LibraryId", req.session.loggedLibraryId)
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 602 ~ bcrypt.compare ~ user[0]", user[0])
                        req.session.loggedUserName= user[0].Όνομα;
                        // req.session.userId = user.userId
            
                        async function saveit(){
                            await req.session.save()
                            // console.log(req.session)
                            // const redirectTo = "/loggedin";               
                            //res.render('home', {alert: 'Επιτυχής σύνδεση', style: ['home'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId}, loggedin:true})
                            // res.render('staff', {style:['staff'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true})
                            res.redirect('/staff')
                        }
                        saveit();
                    }
                })
            }
            checkcode();
        }
    })
}

//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένςου χρήστες
exports.checkStaffAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
        // console.log("🚀 ~ file: library-network-controller.js ~ line 475 ~ req.originalUrl", req.session)
    if (req.session.loggedLibraryId){
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        res.redirect('/staff-login');
    }
}


exports.renderAddNewBook = function (req, res, next) {
    model.getCategories(req, (err, categories)=> {
        if (err) {
            res.send(err);
        }

        if (req.session.admin){
            res.render('add-book-staff', {categories:categories, style: ["add-book-staff", "dropdown"], partialContext: {name:'Admin'}, admin:1, loggedin:true});
        }
        else{
            res.render('add-book-staff', {categories:categories, style: ["add-book-staff", "dropdown"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true});
        }

        
    })
}


exports.addNewBookToDb = function (req, res) {
    

    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send(err);
        }
    //   res.json({ fields, files });
    //   console.log(fields)
        const UserData = Object.keys(fields)
        const writers = [];
        const categories = []

        UserData.forEach((element,index) => {
            // console.log(UserData[index].slice(0,8))
            if (UserData[index].slice(0,6)==='Writer' && fields[UserData[index]]) {
                writers.push(fields[element])
            }
            else if (UserData[index].slice(0,8)==='category') {
                categories.push(UserData[index].slice(8,))
            }
        });    

        // console.log(writers)
        // console.log(categories)

        model.addBookToDb(fields.isbn, fields.title, fields.publisher, fields.version,
                        fields.year, fields.ddc, fields.pages, (err, users, duplicate) => {
            if (err) {
                res.send(err);
            }
            if (duplicate) {
                if (req.session.admin) res.render('admin', {alert:'Υπάρχει ήδη', style: ["admin"], partialContext: {name:'Admin'}, loggedin:true});
                else res.render('staff', {alert:'Υπάρχει ήδη', style:['staff'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true})
            }
            else {
                
            }

            if (files.filetoupload.size){
                const oldpath = files.filetoupload.filepath;
                // console.log("🚀 ~ file: library-network-controller.js ~ line 794 ~ form.parse ~ files.filetoupload.filepath", files.filetoupload.filepath)
                const extension = path.extname(files.filetoupload.originalFilename)
                const newpath = './public/images/' + fields.isbn +extension;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    callbackContinue()
                });

            }
            else callbackContinue();
            function callbackContinue() {
                if (writers.length+categories.length>0){
                    model.addBookCategoriesAndWriters(fields.isbn, writers, [], (err, result) => {
                        if (err) {
                            res.send(err);
                        }
                        model.addBookCategoriesAndWriters(fields.isbn, [], categories, (err, result) => {
                            if (err) {
                                res.send(err);
                            }
            
                            if (req.session.admin) res.render('admin', {alert:'Επιτυχής καταχώρηση', style: ["admin"], partialContext: {name:'Admin'}, loggedin:true});
                            else
                                res.redirect(`/book/${fields.isbn}`);
                        })
                    })
                }
                else {
                    if (req.session.admin) res.render('admin', {alert:'Επιτυχής καταχώρηση', style: ["admin"], partialContext: {name:'Admin'}, loggedin:true});
                    else
                        res.redirect(`/book/${fields.isbn}`);
                }
            }
            
            

        })
    });

}



//OLD FUNCTION NO FILES
// exports.addNewBookToDb = function (req, res) {
//     const UserData = Object.keys(req.body)
//     const writers = [];
//     const categories = []

//     const form = formidable({ multiples: true });

//     // form.parse(req, (err, fields, files) => {
//     //   if (err) {
//     //     res.send(err);
//     //   }
//     // //   res.json({ fields, files });
//     //   console.log(fields)
//     // });

//     // console.log(req.body)

//     UserData.forEach((element,index) => {
//         console.log(UserData[index].slice(0,8))
//         if (UserData[index].slice(0,6)==='Writer' && req.body[UserData[index]]) {
//             writers.push(req.body[element])
//         }
//         else if (UserData[index].slice(0,8)==='category') {
//             categories.push(UserData[index].slice(8,))
//         }
//     });    

//     // console.log(writers)
//     // console.log(categories)

//     model.addBookToDb(req.body.isbn, req.body.title, req.body.publisher, req.body.version,
//                     req.body.year, req.body.ddc, req.body.pages, (err, users, duplicate) => {
//         if (err) {
//             res.send(err);
//         }
//         if (duplicate) {
//             if (req.session.admin) res.render('admin', {alert:'Υπάρχει ήδη', style: ["admin"], partialContext: {name:'Admin', admin:true}, loggedin:true});
//             else res.render('staff', {alert:'Υπάρχει ήδη', style:['staff'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true})
//         }
//         else if (writers.length+categories.length>0){
//             model.addBookCategoriesAndWriters(req.body.isbn, writers, [], (err, result) => {
//                 if (err) {
//                     res.send(err);
//                 }
//                 model.addBookCategoriesAndWriters(req.body.isbn, [], categories, (err, result) => {
//                     if (err) {
//                         res.send(err);
//                     }
    
//                     if (req.session.admin) res.render('admin', {alert:'Επιτυχής καταχώρηση', style: ["admin"], partialContext: {name:'Admin', admin:true}, loggedin:true});
//                     else
//                         res.redirect(`/book/${req.body.isbn}`);
//                 })
//             })
//         }
//         else {
//             if (req.session.admin) res.render('admin', {alert:'Επιτυχής καταχώρηση', style: ["admin"], partialContext: {name:'Admin', admin:true}, loggedin:true});
//             else
//                 res.redirect(`/book/${req.body.isbn}`);
//         }
        

//     })
// }



exports.renderUsers = function (req, res, next) {
    model.getUserStatus(req, (err, users)=> {
        if (err) {
            res.send(err);
        }

        model.getUsersPhones(req, (err, phones)=> {
            // console.log("🚀 ~ file: library-network-controller.js ~ line 952 ~ model.getUsersPhones ~ phones", phones)
            if (err) {
                res.send(err);
            }

            const newPhones = {};

            if (phones){
                phones.forEach(element => {
                    if (newPhones[element.ID_μέλους]) {
                        newPhones[element.ID_μέλους].push(element.Αρ_Τηλ)
                    }
                    else newPhones[element.ID_μέλους] = [element.Αρ_Τηλ];
                });
            }
            // console.log("🚀 ~ file: library-network-controller.js ~ line 971 ~ model.getUsersPhones ~ users", users)

            if (users)
            users.forEach(element => {
                element.phone = newPhones[element.Κωδικός_Μέλους];
                element.Ημερομηνία_Εγγραφής = element.Ημερομηνία_Εγγραφής.toISOString().replace(/T/, ' ').replace(/\..+/, '')


            });

            model.getSubscriptions(req, (err, subscriptions)=> {
                // console.log("🚀 ~ file: library-network-controller.js ~ line 978 ~ model.getSubscriptions ~ subscriptions", subscriptions)
                if (err) {
                    res.send(err);
                }
                if (subscriptions)
                subscriptions.forEach(element => {
                    if (element.Διάρκεια>1) element.months_end = 'ες';
                    else element.months_end = 'α';
                    if (element.Διάρκεια_δανεισμού>1) element.Διάρκεια_δανεισμού_end = 'ες';
                    else element.Διάρκεια_δανεισμού_end = 'α';
                    if (element.Όριο_δανεισμών>1) element.Όριο_δανεισμών_end = 'α';
                    else element.Όριο_δανεισμών_end = 'ο';
                });

                if (req.session.admin){
                    res.render('users-staff', {subscriptions:subscriptions, users:users, style: ["users-staff"], partialContext: {name:'Admin'},admin:1, loggedin:true});
                }
                else{
                    res.render('users-staff', {subscriptions:subscriptions, users:users, style: ["users-staff"], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true});
                }
            })
        })

        
    })
}


exports.addUserSub = function (req, res, next) {
    // Νέα συνδρομή μέλους

    // console.log("🚀 ~ file: library-network-controller.js ~ line 1009 ~ Object.keys(req.body)", Object.keys(req.body))
    let userId = req.body.userId
    let subId = req.params.subId

    // Έλεγχος αν χρωστάει βιβλία
    model.checkPaid(req.body.userId, (err, results)=> {
    
        // console.log("🚀 ~ file: library-network-controller.js ~ line 1013 ~ model.checkPaid ~ results", results)
        if (err) {
            res.send(err);
        }

        if (results>0) {
            if (req.session.admin) res.render('staff', {alert:'Χρωσταει βιβλία', style:['staff'], partialContext: {name:'Admin'},admin:true, loggedin:true})
            else res.render('staff', {alert:'Χρωσταει βιβλία', style:['staff'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true})
        }
        

            // Έλεγχος αν έχει ήδη συνδρομή ώστε η συνδρομή να επεκτέινει την τωρινή
            model.getLastSub(req.body.userId, (err, results)=> {
                if (err) {
                    res.send(err);
                }

                if (results>0){
                    if (results[0].active) {
                        model.addUserSub(req.params.subId, req.body.userId, results[0].end_date, (err, results)=> {
                            if (err) {
                                res.send(err);
                            }
                            res.redirect('/users-staff');
                        })
                    }
                    else callbackAddUserSub();
                }
                else callbackAddUserSub();

                
                function callbackAddUserSub(){

                    // Βάζει τη συνδρομή
                    model.addUserSub(req.params.subId, req.body.userId, undefined, (err, results)=> {
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 1057 ~ model.addUserSub ~ results", results)
                        if (err) {
                            res.send(err);
                        }
                
                        res.redirect('/users-staff');
                    })
                }

            })
        
    })

}




exports.renderBookStaff = (req, res) => {

    model.getBook(req.params.ISBN, (err, book) => {
        
        if (err) {
            res.send(err);
        }
        if (book.length==0 || book==undefined) {
            res.render('not_found', {layout:'404.hbs', partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true});
        }
        else{

            model.getBookCategories(req.params.ISBN, (err, categories)=> {
                if (err) {
                    res.send(err);
                }
                // console.log(req.params.ISBN)
                model.bookCountAllISBN(req.params.ISBN, (err, total_books_count)=> {
                    if (err) {
                        res.send(err);
                    }
    
                    let imageFile = checkCoverImage(book[0].ISBN);
                    const writers = [];
                    book.forEach((element, i)=>{
                        if (i==0)
                            writers.push(element.Συγγραφέας);
                        else
                            writers.push(', '+element.Συγγραφέας);
                    });
                    let writers_end = 'έας';
                    if (writers.length>1) {
                        writers_end = 'είς'
                    }
                    categories.forEach((element, i)=>{
                        if (i!=0)
                            element.Όνομα = ' | '+element.Όνομα
                    });
                    
                    // continueFindingBook(req, book[0],writers_end, total_books_count[0].total_books_count,
                    //      categories, writers,  imageFile)
                    model.getSpecificLocationOfSpecificBook(req.params.ISBN, (err, locations)=> {
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 1121 ~ model.getSpecificLocationOfEveryBook ~ location", locations)
                        if (err) {
                            res.send(err);
                        }
                    
                        model.getIsbnReservations(req.params.ISBN, (err, reservations)=> {
                            // console.log("🚀 ~ file: library-network-controller.js ~ line 1127 ~ model.getAllReservations ~ reservations", reservations)
                            if (err) {
                                res.send(err);
                            }
    // console.log("🚀 ~ file: library-network-controller.js ~ line 1132 ~ model.getIsbnReservations ~ reservations", reservations)

                            if (reservations.length>0){
                                reservations.forEach(element => {
                                    for (let j = 0; j < locations.length; j++) {                                        
                                        // console.log("🚀 ~ file: library-network-controller.js ~ line 1125 ~ model.getIsbnReservations ~ locations[j].Βιβλιοθήκη_τώρα", locations[j].Βιβλιοθήκη_τώρα)
                                        // console.log("🚀 ~ file: library-network-controller.js ~ line 1121 ~ model.getIsbnReservations ~ element.Βιβλιοθήκη_κράτησης", element.Βιβλιοθήκη_κράτησης)

                                        if (element.Βιβλιοθήκη_κράτησης==locations[j].Βιβλιοθήκη_τώρα &&
                                            locations[j].Μεταφέρεται_σε==null && 
                                            locations[j].Δανεισμένο_σε==null &&
                                            locations[j].Μέλος == undefined){
                                                locations[j].Μέλος= element.Μέλος;
                                                break;
                                            }
                                        }
                                    
                                    
                                });
                            }


                            model.getLibrariesNoPhone(req, (err, libraries)=> {
                                if (err) {
                                    res.send(err);
                                }

                                const libDict = {};

                                libraries.forEach(el=>{
                                    libDict[el.Κωδικός_Βιβλιοθήκης] = el.Όνομα;
                                })

                                let thisLib = [];

                                let otherLibs = [];
                                locations.forEach(item=>{                                        
                                    // console.log("🚀 ~ file: library-network-controller.js ~ line 1154 ~ model.getLibrariesNoPhone ~ req.session.loggedLibraryId", req.session.loggedLibraryId)
                                        // console.log("🚀 ~ file: library-network-controller.js ~ line 1154 ~ model.getLibrariesNoPhone ~ item.Κωδικός_Βιβλιοθήκης", item.Κωδικός_Βιβλιοθήκης)

                                    if (item.Κωδικός_Βιβλιοθήκης==req.session.loggedLibraryId){
                                        item.Βιβλιοθήκη_τώρα_όνομα = libDict[item.Βιβλιοθήκη_τώρα]
                                        if (item.Βιβλιοθήκη_τώρα==req.session.loggedLibraryId) {
                                            item.here = true;
                                        }
                                        thisLib.push(item);
                                    }
                                    else if (item.Βιβλιοθήκη_τώρα==req.session.loggedLibraryId) {
                                        item.here = true;
                                        item.owner = libDict[item.Κωδικός_Βιβλιοθήκης]
                                        otherLibs.push(item);
                                    }
                                })
                                locations.forEach(item=>{
                                    if (item.Κωδικός_Βιβλιοθήκης!=req.session.loggedLibraryId && item.Βιβλιοθήκη_τώρα!=req.session.loggedLibraryId) {
                                        
                                        item.Βιβλιοθήκη_τώρα_όνομα = libDict[item.Βιβλιοθήκη_τώρα]
                                        item.owner = libDict[item.Κωδικός_Βιβλιοθήκης]
                                        otherLibs.push(item);
                                    }
                                })

                                
                                // console.log("🚀 ~ file: library-network-controller.js ~ line 1138 ~ model.getIsbnReservations ~ thisLib", thisLib)
                                // console.log("🚀 ~ file: library-network-controller.js ~ line 1142 ~ model.getIsbnReservations ~ otherLibs", otherLibs)

// res.redirect('/')
                            res.render('book-staff',{book: book[0],writers_end:writers_end, total_books_count:total_books_count[0].total_books_count,
                                isbn:req.params.ISBN, categories:categories, writers: writers,  imageFile: imageFile, style: ["book",'book-staff']
                                ,thisLib:thisLib, otherLibs:otherLibs, booksHere: thisLib.lenth, booksOthers: otherLibs.lenth, partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true})
                            });
                        })
                    })
                    
                });
            });
        }
    });
}

exports.addNewBookToLib = function (req, res, next) {
    model.addNewBookToLib(req.params.ISBN, req.session.loggedLibraryId, (err, result)=> {
        if (err) {
            res.send(err);
        }

        res.redirect(`/book-staff/${req.params.ISBN}`);
    })
}


exports.newBorrow = function (req, res, next) {
        // console.log("🚀 ~ file: library-network-controller.js ~ line 1210 ~ model.checkBorrow ~ req.body.userId", req.body.userId)

    model.checkBorrow(req.body.userId, (err, result)=> {
        if (err) {
            res.send(err);
        }

        if (result){
            if (result[0]){
                if (result[0].possible) {
                model.newBorrow(req.body.userId, req.params.ISBN, req.body.bookNum, req.body.libraryId, req.session.loggedLibraryId, (err, result)=> {
                    if (err) {
                        res.send(err);
                    }
            
                    res.redirect('back');
                })
            }
            else res.redirect('back')
            }
            else res.redirect('back')
            
        }
        else res.redirect('back')  
    })
}




exports.returnBook = function (req, res, next) {
    const {isbn,bookId,libId,userId} = req.params;
    // console.log("🚀 ~ file: library-network-controller.js ~ line 1236 ~ libId", libId)
    // console.log("🚀 ~ file: library-network-controller.js ~ line 1236 ~ bookId", bookId)

    // console.log("🚀 ~ file: library-network-controller.js ~ line 1236 ~ a", isbn)
    

    model.findExtraCost(userId, isbn,bookId,libId, (err, result)=> {
        // console.log("🚀 ~ file: library-network-controller.js ~ line 1256 ~ model.findExtraCost ~ result", result)
        if (err) {
            res.send(err);
        }

        
        let message;

            if (result) {
                if (result[0].cost>0)
                message = `Ο χρήστης πρέπει να πληρώσει ${result[0].cost}€ γιατί καθυστέρησε ${result[0].extra_days} μέρες`;
            }
            else message='Επιτυχία'
        

        model.returnBook(userId,isbn,bookId,libId, req.session.loggedLibraryId, (err, result)=>{
            if (err) {
                res.send(err);
            }

            res.render('home', {alert:message, style: ['home'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true})
        })

    })
}


exports.reservationConfirm = function (req, res, next) {
    model.reservationConfirm(req.params.userId, (err, result)=> {
        if (err) {
            res.send(err);
        }

        res.redirect(`back`);
    })
}


















////////////////
//    ADMIN   //
////////////////

exports.doAdminLogin = function (req, res) {

    if (req.body.username == process.env.ADMINUSERNAME && req.body.password == process.env.ADMINPASSWORD){
        req.session.loggedUserId=undefined;
        req.session.loggedLibraryId=undefined;


        req.session.loggedUserName='Admin';
        req.session.admin=1;
        // req.session.userId = user.userId
        
        async function saveit(){
            await req.session.save()
            // console.log(req.session)
            // const redirectTo = "/loggedin";               
            //res.render('home', {alert: 'Επιτυχής σύνδεση', style: ['home'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId}, loggedin:true})
            // res.render('admin', {style: ["staff"], partialContext: {name:'Admin', admin:true}, loggedin:true})
            res.redirect('/admin')
        }
        saveit();
    }
    else {
        res.render('admin-login', {alert:'Λάθος στοιχεία', style: ["admin", 'admin-login'], loggedin:false})
    }

}


exports.checkAdminAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
        // console.log("🚀 ~ file: library-network-controller.js ~ line 475 ~ req.originalUrl", req.session)

    if(req.session.admin){
        next()
    }
    else {
        res.redirect('/admin-login');
    }
}

exports.checkStaffOrAdminAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
        // console.log("🚀 ~ file: library-network-controller.js ~ line 475 ~ req.originalUrl", req.session)
    if (req.session.loggedLibraryId || req.session.admin){
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        res.redirect('/staff-login');
    }
}


exports.renderCategories = function (req, res, next) {
    model.getCategories(req, (err, categories)=> {
        if (err) {
            res.send(err);
        }

        res.render('categories-admin', {categories:categories, style: ["categories-admin"], partialContext: {name:'Admin'}, loggedin:true});
    })
}

exports.addCategories = function (req, res, next) {
    const UserData = Object.keys(req.body)
    const categories = [];
    // console.log("🚀 ~ file: library-network-controller.js ~ line 648 ~ cat", Object.keys(req.body))

    UserData.forEach(element => {
        categories.push(req.body[element])
    });        

    // console.log(categories)


    model.addCategories(categories, (err, result)=> {
        if (err) {
            res.send(err);
        }

        res.redirect('/categories-admin');
    })
}

exports.removeCategory = function (req, res, next) {
    model.removeCategory(req.params.id, (err, result)=> {
        if (err) {
            res.send(err);
        }

        res.redirect('/categories-admin');
    })
}


exports.renderAdminLibraries = (req, res) => {
    model.getLibrariesAndQtt(req, (err, libraries)=> {
        if (err) {
            res.send(err);
        }

        let last = null;
        let indexOfLast = 0;

        for (let index = 0; index < libraries.length; index++) {
            // console.log(last);
            // console.log("🚀 ~ file: library-network-controller.js ~ line 25 ~ model.getLibraries ~ libraries[index].Κωδικός_Βιβλιοθήκης", libraries[index].Κωδικός_Βιβλιοθήκης);

			if (last==libraries[index].Κωδικός_Βιβλιοθήκης) {
                libraries[indexOfLast].Τηλέφωνο_Βιβλ.push(libraries[index].Τηλέφωνο_Βιβλ);
                libraries[indexOfLast].multiple_numbers=1
                libraries[index].Όνομα=null;
            }
            else {
                libraries[index].Τηλέφωνο_Βιβλ = [libraries[index].Τηλέφωνο_Βιβλ];
                last = libraries[index].Κωδικός_Βιβλιοθήκης;
                indexOfLast = index;
                libraries[index].multiple_numbers=0
            }
		}
        // console.log('libraries')
        // console.log(libraries)
        
        res.render('libraries-admin',{libraries: libraries, style: ['libraries-admin'], partialContext: {name:'Admin'}, loggedin:true});
        
    });
}


exports.newLibrary = (req, res) => {
    const UserData = Object.keys(req.body)
    const Phones = [];
    // console.log("🚀 ~ file: library-network-controller.js ~ line 648 ~ Register")


    for (let index = 0; index < UserData.length; index++) {
            // console.log("🚀 ~ file: library-network-controller.js ~ line 571 ~ req.body[UserData[index]]", req.body[UserData[index]])
            // console.log("🚀 ~ file: library-network-controller.js ~ line 571 ~ UserData[index].slice(0,8)", UserData[index].slice(0,8))

        if (UserData[index].slice(0,8)==='LibPhone' && req.body[UserData[index]]) {
            Phones.push([req.body[UserData[index]]])
        }
    }
    model.newLibrary(req.body.libName, req.body.street, req.body.town, req.body.zip, Phones, req.body.password, (err, id)=> {
        if (err) {
            res.send(err);
        }

        res.redirect('/libraries-admin');
    });
}



exports.deleteLibrary = (req, res) => {
    model.deleteLibrary(req.params.id, (err, id)=> {
        if (err) {
            res.send(err);
        }

        res.redirect('/libraries-admin');
    });
}


exports.getSingleLibrary = (req, res) => {
    model.getSingleLibrary(req.params.id, (err, library)=> {
        if (err) {
            res.send(err);
        }


        const phone0 = library[0].Τηλέφωνο_Βιβλ;

        const phones = [];

        library.forEach((el, index) => {
            if (index>0) phones.push({
                phone: el.Τηλέφωνο_Βιβλ,
                id:index+1
            })
        });

        res.render('library-edit-admin',{library: library[0], phone0:phone0, phones:  phones, style: ['libraries-admin'], partialContext: {name:'Admin'}, loggedin:true});
    });
}


exports.editLibrary = (req, res) => {
    const UserData = Object.keys(req.body)
    const Phones = [];
    // console.log("🚀 ~ file: library-network-controller.js ~ line 648 ~ Register")


    for (let index = 0; index < UserData.length; index++) {
            // console.log("🚀 ~ file: library-network-controller.js ~ line 571 ~ req.body[UserData[index]]", req.body[UserData[index]])
            // console.log("🚀 ~ file: library-network-controller.js ~ line 571 ~ UserData[index].slice(0,8)", UserData[index].slice(0,8))

        if (UserData[index].slice(0,8)==='LibPhone' && req.body[UserData[index]]) {
            Phones.push([req.body[UserData[index]]])
        }
    }
    
    model.editLibrary(req.body.libName, req.body.street, req.body.town, req.body.zip, Phones, req.params.id, (err, result)=> {
        if (err) {
            res.send(err);
        }
        //console.log('editing lll')

        res.redirect('/libraries-admin');
    });
}



exports.newSubscription = (req, res) => {

    model.newSubscription(req.body.months, req.body.price, req.body.maxDays, req.body.maxBooks, req.body.extraMoney, (err, result)=> {
        if (err) {
            res.send(err);
        }

        res.redirect('/subscriptions');
    });
}


exports.deleteSubscription = (req, res) => {

    model.deleteSubscription(req.params.id, (err, result)=> {
        if (err) {
            res.send(err);
        }

        res.redirect('/subscriptions');
    });
}