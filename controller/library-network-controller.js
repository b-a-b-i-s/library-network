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

    


    model.getBooks(req, (err, books)=> {
        if (err) {
            res.send(err);
        }

        console.log('ok')

        

        // console.log('books')
        // console.log(allBooks)

        model.getLocations(req, (err, locations)=> {
            if (err) {
                res.send(err);
            }
    
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
                console.log(item.ISBN)
                allBooks[item.ISBN].locations.push(item.Όνομα+`: ${item.Ποσότητα}`);
                allBooks[item.ISBN].not_available=0;
            });

            // console.log('end')
            // console.log(allBooks)
            // console.log(Object.values(allBooks));
            res.render('books',{books: allBooks, style: ["books"]})
        });
        
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

        // console.log(book)

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

                // console.log (locations)
        
                res.render('book',{book: book[0],writers_end:writers_end,
                    locations: locations, categories:categories, writers: writers,  imageFile: imageFile, style: ["book"]})
                
            });

        });


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

    model.getUserByUsername(req.body.UserEmail, (err, user) => {
        if (user == undefined) {
            res.render('index', { failedloggin: true });
        }
        else {
            //Θέτουμε τη μεταβλητή συνεδρίας "loggedUserId"
            async function checkcode(){
                console.log(req.body.UserPass)
                                
                bcrypt.compare(req.body.UserPass, user.password, function(err, isMatch) {

                    if (err) {
                    throw err
                    } else if (!isMatch) {
                        res.redirect("/failed");
                    } else {
                        req.session.loggedUserId = user.id;
                        req.session.loggedUserName= user.username;
                        req.session.userId = user.userId
            
                        async function saveit(){
                            await req.session.save()
                            console.log(req.session)
                            const redirectTo = "/loggedin";               
                            res.redirect(redirectTo);
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
    // model.registerUser(req.body.username, req.body.password, (err, result, message) => {
    model.registerUser(req.body.UserName, req.body.UserEmail, req.body.UserPass, (err, result, message) => {
        
        if (err) {
            console.error('registration error: ' + err);
            res.render('index', { message: 'An error occured in the database' });
        }
        else if (message) {
            res.render('index')
        }
        else {
            res.redirect('/afterregister');
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
