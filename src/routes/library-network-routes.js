
'use strict';

const express = require('express');
const router = express.Router({caseSensitive:true});

const libraryController = require('../controller/library-network-controller.js');



router.get('/', libraryController.renderHome)


router.get('/libraries',  libraryController.renderLibraries)

router.get('/subscriptions', libraryController.renderSubscriptions)

router.get('/books', libraryController.renderBooks)

router.get('/book/:ISBN', libraryController.renderBook)
router.get('/book/:ISBN/success', libraryController.renderBookSuccessfulReservation)
router.get('/book/:ISBN/error', libraryController.renderBookErrorReservation)

router.post('/book/:ISBN', libraryController.newReservation)


//  login
//      User
router.post('/login', libraryController.doLogin);
router.post('/signup', libraryController.doRegister);
//      Staff
router.get('/staff-login', libraryController.renderLibrariesLogin)
router.post('/staff-login',libraryController.doStaffLogin)//,  (req, res) => res.render('staff-login', {style: ["admin", "admin-login"]}))
//      Admin
router.get('/admin-login', (req, res) => res.render('admin-login', {style: ["admin", 'admin-login'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedUserId||req.session.loggedLibraryId}, loggedin:req.session.loggedUserId||req.session.loggedLibraryId}))
router.post('/admin-login', libraryController.doAdminLogin)

router.get('/logout', libraryController.doLogout)




// Staff
router.get('/staff', libraryController.checkStaffAuthenticated, (req,res)=> res.render('staff', {style:['staff'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true}))//,  (req, res) => res.render('staff-login', {style: ["admin", "admin-login"]}))

router.get('/add-book-staff', libraryController.checkStaffOrAdminAuthenticated, libraryController.renderAddNewBook)
router.post('/add-book-staff', libraryController.checkStaffOrAdminAuthenticated, libraryController.addNewBookToDb)

router.get('/transfer-staff', libraryController.checkStaffAuthenticated, libraryController.transferStaff)

router.get('/users-staff', libraryController.checkStaffAuthenticated, libraryController.renderUsers)

router.post('/add-user-subscription/:subId', libraryController.checkStaffAuthenticated, libraryController.addUserSub)// 

router.get('/book-staff/:ISBN', libraryController.checkStaffAuthenticated, libraryController.renderBookStaff);//libraryController.checkStaffAuthenticated
router.post('/book-staff/:ISBN', libraryController.checkStaffAuthenticated, libraryController.addNewBookToLib);//libraryController.checkStaffAuthenticated

router.post('/borrow/:ISBN', libraryController.checkStaffAuthenticated, libraryController.newBorrow);//libraryController.checkStaffAuthenticated
router.get('/reservation-confirm/:userId', libraryController.checkStaffAuthenticated, libraryController.reservationConfirm)

router.get('/return/:isbn/:bookId/:libId/:userId', libraryController.checkStaffAuthenticated, libraryController.returnBook)






// Admin
router.get('/admin', libraryController.checkAdminAuthenticated, (req, res) => res.render('admin', {style: ["staff"], partialContext: {name:'Admin', admin:true}, loggedin:true}))

router.get('/categories-admin', libraryController.checkAdminAuthenticated, libraryController.renderCategories)
router.post('/categories/add', libraryController.checkAdminAuthenticated, libraryController.addCategories)
router.get('/category/remove/:id', libraryController.checkAdminAuthenticated, libraryController.removeCategory)

router.get('/libraries-admin', libraryController.checkAdminAuthenticated, libraryController.renderAdminLibraries)
router.post('/libraries-admin', libraryController.checkAdminAuthenticated, libraryController.newLibrary)
router.get('/libraries-admin/:id', libraryController.checkAdminAuthenticated, libraryController.getSingleLibrary)
router.post('/libraries-admin/:id', libraryController.checkAdminAuthenticated, libraryController.editLibrary)
router.get('/libraries-admin/delete/:id', libraryController.checkAdminAuthenticated, libraryController.deleteLibrary)

router.get('/add-book-admin', libraryController.checkAdminAuthenticated, libraryController.renderAddNewBook)

router.get('/users-admin', libraryController.checkAdminAuthenticated, libraryController.renderUsers)

router.post('/subscriptions', libraryController.checkAdminAuthenticated, libraryController.newSubscription)
router.get('/subscriptions/delete/:id', libraryController.checkAdminAuthenticated, libraryController.deleteSubscription)



// router.all('*', (req, res) => res.render('not_found', {layout: '404'}))
//fetch
// router.get('/meeting/get-data/:url', Controller.getDates)
// router.post('/meeting/choose-final-option/:url',Controller.checkAuthenticated, Controller.chooseFinalOption)
// router.post('/meeting/add-votes/:url/:name',  Controller.addVotes)
// router.post('/add-meeting',Controller.checkAuthenticated, Controller.addMeeting);


module.exports = router;
