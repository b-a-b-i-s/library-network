'use strict';

const model = require('../model/library-network-model-remotemysql-com-mysql-db.js');
const bcrypt = require('bcrypt');
const e = require('express');
const fs = require('fs')




exports.renderLibraries = (req, res) => {
    model.getLibraries(req, (err, libraries)=> {
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

        res.render('libraries',{libraries: libraries, style: ['libraries']})
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

        res.render('subscriptions',{subscriptions: subscriptions, style: ["libraries-admin","subscriptions-admin"]})
    });
}

exports.renderBooks = (req, res) => {

    let search;
    if (req.query.search){
        search=`%${req.query.search}%`
    }


    model.getBooks(search, (err, books)=> {
        if (err) {
            res.send(err);
        }
        if (books.length===0){
            res.render('books',{no_result: req.query.search, style: ["books"]});
        }
        else{

            model.getLocations(req, (err, locations)=> {
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
                            not_available:1,
                            imageFile: checkCoverImage(item.ISBN)
                        };
                        allBooks[item.ISBN] = temp;
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
    
                // console.log('end')
                // console.log(allBooks)
                // console.log(Object.values(allBooks));
                res.render('books',{books: allBooks, style: ["books"]});
            });


        }
        

        // console.log('books')
        // console.log(allBooks)

        
    });
}

function checkCoverImage(ISBN) {
    // console.log(__dirname)
    const imagePath1 = `./public/images/${ISBN}.jpg`;
    const imagePath2 = `./public/images/${ISBN}.jpeg`;
    const imagePath3 = `./public/images/${ISBN}.png`;

    // console.log(imagePath1)

    let imageFile = '/images/booknotpictured.jpg';
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
        console.error(err)
    }

    return imageFile;
}

exports.renderBook = (req, res) => {

    model.getBook(req, (err, book) => {
        
        if (err) {
            res.send(err);
        }

        if (book==undefined) {
            res.render('error', {layout:'404.hbs'});
        }


        model.getLocationsOfBook(req, (err, locations)=> {
            if (err) {
                res.send(err);
            }
    
            model.getBookCategories(req, (err, categories)=> {
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
        
                res.render('book',{book: book[0],writers_end:writers_end,
                    locations: locations, categories:categories, writers: writers,  imageFile: imageFile, style: ["book"]})
                
            });

        });


    });
}

exports.renderBookErrorReservation = (req, res) => {

    model.getBook(req, (err, book) => {
        
        if (err) {
            res.send(err);
        }

        if (book==undefined) {
            res.render('error', {layout:'404.hbs'});
        }


        model.getLocationsOfBook(req, (err, locations)=> {
            if (err) {
                res.send(err);
            }
    
            model.getBookCategories(req, (err, categories)=> {
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
        
                res.render('book',{book: book[0],writers_end:writers_end,
                    locations: locations,alert:'Αποτυχία', categories:categories, writers: writers,  imageFile: imageFile, style: ["book"]})
                
            });

        });


    });
}

exports.renderBookSuccessfulReservation = (req, res) => {

    model.getBook(req, (err, book) => {
        
        if (err) {
            res.send(err);
        }

        if (book==undefined) {
            res.render('error', {layout:'404.hbs'});
        }


        model.getLocationsOfBook(req, (err, locations)=> {
            if (err) {
                res.send(err);
            }
    
            model.getBookCategories(req, (err, categories)=> {
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
        
                res.render('book',{book: book[0],writers_end:writers_end,
                    locations: locations,alert:'Επιτυχία', categories:categories, writers: writers,  imageFile: imageFile, style: ["book"]})
                
            });

        });


    });
}
    
exports.newReservation = (req, res) => {
    model.checkForNewReservation(req, (err, userId)=> {
        if (err) {
            res.send(err);
        }

        // console.log(userId[0])

        if (userId[0]){// success
            model.makeNewReservation(req, (err, result)=> {
                if (err) {
                    res.send(err);
                }
                
                console.log('success')

                res.redirect(`/book/${req.params.ISBN}/success`);
        
            });
            
        }
        else { // not success
            res.redirect(`/book/${req.params.ISBN}/error`);
        }
        

    });
}





















exports.addMeeting = (req, res) => {
    model.addMeeting(req.body, req.session.loggedUserId, (err, url) => {
        if (err) {
            res.send(err);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(url, 'utf-8')
    });
}

exports.publish = (req, res) => {    
    res.render('publish', { 
        url:req.headers.host+'/meeting/'+req.params.url,
        shorturl:'/meeting/'+req.params.url,
        loggedin:true,
        partialContext: {name: req.session.loggedUserName}
        // name:req.session.userName
    })
}
    


exports.renderVote = (req, res) => {
    if (!req.session.userId) {
        model.addTempUser(req, (err, user)=> {
            if (err) {
                console.log(err)
                res.send(err)
            }

            req.session.userId = user.userId
            req.session.name = user.name
            req.session.tempUserId = user.id


            async function saveit(){
                await req.session.save()
                console.log(req.session)
                model.checkIfClosedAndIfUserIsCreator(req, (err, closed, check) => {
                    if (err) {
                        res.send(err);
                    }
                    if (closed){
                        res.render('vote',{open:false});
                    }
                    else {
                        res.render('vote',{open:true})
                    }
                    
                }); 
            }
            saveit();

        })
    }
    else {
        model.checkIfClosedAndIfUserIsCreator(req, (err, closed, check) => {
            if (err) {
                res.send(err);
            }
            if (closed){
                if (req.session.loggedUserId) {
                    res.render('vote',{open:false, isCreator:check, partialContext: {name:req.session.loggedUserName}, loggedin:true});
                }
                else {
                    res.render('vote',{open:false})
                }
            }
            else {
                if (req.session.loggedUserId) {
                    res.render('vote',{name:req.session.loggedUserName, open:true, isCreator:check, partialContext: {name:req.session.loggedUserName}, loggedin:true});
                }
                else {
                    res.render('vote',{open:true})
                }
            }
        }); 
    }
    
    
    
    
    

}



exports.getDates = (req, res) => {
    let userId = req.session.userId;
    
    model.getDates(req, (err, data, votes, meetingInfo, userName) => {
        if (err) {
            res.send(err);
        }
        if (votes) {
            votes.forEach(el => {
                if (el.UserIdVote === userId) el.UserIdVote = true//req.session.useid
                else el.UserIdVote = false
            });
        }
        res.json( { 
            data:data,
            votes:votes,
            meetingInfo : meetingInfo,
            thisUserName : userName
        })
    });
}

exports.addVotes = (req, res) => {

    if (req.session.loggedUserName) req.session.loggedUserName = req.params.name
    
    model.checkIfClosedAndIfUserIsCreator(req, (err, closed, check) => {
        if (err) {
            res.send(err);
        }
        if (closed){
            res.render('vote',{open:false});
        }
        else {
            model.addVotes(req, (err, invalid) => {
                if (err) {
                    res.send(err);
                }
                if (invalid) {
                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                    res.end('invalid', 'utf-8')
                }
        
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end('votes updated', 'utf-8')
            });
        }

    }); 


    
}

exports.chooseFinalOption = (req, res) => {
    
    model.chooseFinalOption(req, (err) => {
        if (err) {
            res.send(err);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('selected final date', 'utf-8')
    });
}










///// LOGIN REDISTER /////




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

                    if (err) {
                    throw err
                    } else if (!isMatch) {
                        res.render('home', {alert: 'Λάθος κωδικός', style: ["home"]})
                    } else {
                        req.session.loggedUserId = user[0].Κωδικός_μέλους;
                        // console.log("🚀 ~ file: library-network-controller.js ~ line 602 ~ bcrypt.compare ~ user[0]", user[0])
                        req.session.loggedUserName= user[0].Όνομα + ' ' + user[0].Επίθετο;
                        // req.session.userId = user.userId
            
                        async function saveit(){
                            await req.session.save()
                            console.log(req.session)
                            const redirectTo = "/loggedin";               
                            res.render('home', {alert: 'Επιτυχής σύνδεση', style: ["home"]})
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
exports.checkAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
    if(req.originalUrl=="/" && req.session.loggedUserId){
        console.log("efttasa")
        res.render('index', {partialContext: {name:req.session.loggedUserName}, loggedin:true})
    }
    else if(req.originalUrl=="/"){
        next()
    }
    else if (req.session.loggedUserId) {
        console.log("user is authenticated", req.originalUrl);
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        res.redirect('/login');
    }
}


exports.doLogout = (req, res) => {
    //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
    console.log("loggedout")
    req.session.destroy();
    res.redirect('/');
}

exports.doRegister = function (req, res) {
    const UserData = Object.keys(req.body)
    const Phones = {}
    console.log("🚀 ~ file: library-network-controller.js ~ line 648 ~ Register")


    for (let index = 0; index < UserData.length; index++) {
        if (UserData[index].slice(0,8)==='LibPhone' && req.body[UserData[index]]) {
            Phones[req.body[UserData[index]]] = 1
        }
    }

    console.log(Phones)
    // model.registerUser(req.body.username, req.body.password, (err, result, message) => {
    model.getAllUsers(req, (err, users) => {

        let checkFalseEmail = 0;
        let checkFalsePhone = 0;

        for (let index = 0; index < users.length; index++) {
            console.log('l', users[index].email, users[index].Αρ_Τηλ)
            console.log('body', req.body.UserEmail)
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

exports.showMyMeetings = function (req, res) {
    
    model.showMyMeetings(req, (err, result) => {
        
        if (err) {
            console.error('registration error: ' + err);
            res.render('index');
        }
        else {
            console.log(result)
            res.render('mymeetings', {meeting:result, partialContext: {name:req.session.loggedUserName}, loggedin:true})

        }
    })
}
