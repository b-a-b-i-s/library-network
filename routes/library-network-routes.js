
'use strict';

const express = require('express');
const router = express.Router({caseSensitive:true});

const libraryController = require('../controller/library-network-controller.js');

//fetch
// router.get('/meeting/get-data/:url',  meetMeController.getDates)
// router.post('/meeting/choose-fianl-option/:url',meetMeController.checkAuthenticated, meetMeController.chooseFinalOption)
// router.post('/meeting/add-votes/:url/:name',  meetMeController.addVotes)
// router.post('/add-meeting',meetMeController.checkAuthenticated, meetMeController.addMeeting);

// router.get('/meeting/:url',  meetMeController.renderVote)

router.get('/libraries',  libraryController.renderLibraries)

router.get('/subscriptions', libraryController.renderSubscriptions)

router.get('/books', libraryController.renderBooks)

router.get('/book/:ISBN', libraryController.renderBook)
router.get('/book/:ISBN/success', libraryController.renderBookSuccessfulReservation)
router.get('/book/:ISBN/error', libraryController.renderBookErrorReservation)

router.post('/book/:ISBN', libraryController.newReservation)

// router.get('/create-meetme',  meetMeController.checkAuthenticated, (req, res) => res.render('create_meetme',{partialContext: {name:req.session.loggedUserName}, loggedin:true}));

// router.all('/publish/:url',meetMeController.checkAuthenticated, meetMeController.publish);

// router.get('/loggedin',meetMeController.checkAuthenticated, (req, res) => res.render('index', {partialContext: {name:req.session.loggedUserName}, loggedin:true}))

// router.get('/mymeetings', meetMeController.checkAuthenticated, meetMeController.showMyMeetings);

router.get('/', libraryController.renderHome)

router.get('/staff-login', libraryController.renderLibrariesLogin)
router.get('/staff', libraryController.checkStaffAuthenticated, (req,res)=> res.render('staff', {style:['staff'], partialContext: {name:req.session.loggedUserName, userid: req.session.loggedLibraryId}, loggedin:true}))//,  (req, res) => res.render('staff-login', {style: ["admin", "admin-login"]}))

router.post('/staff-login',libraryController.doStaffLogin)//,  (req, res) => res.render('staff-login', {style: ["admin", "admin-login"]}))

router.get('/admin-login', (req, res) => res.render('admin-login', {style: ["admin", 'admin-login'], loggedin:false}))

router.post('/admin-login', libraryController.doAdminLogin)

router.get('/admin', libraryController.checkAdminAuthenticated, (req, res) => res.render('admin', {style: ["admin"], partialContext: {name:'Admin', admin:true}, loggedin:true}))

router.get('/categories-admin', libraryController.checkAdminAuthenticated, libraryController.renderCategories)
router.post('/categories/add', libraryController.checkAdminAuthenticated, libraryController.addCategories)
router.get('/category/remove/:id', libraryController.checkAdminAuthenticated, libraryController.removeCategory)

router.get('/libraries-admin', libraryController.checkAdminAuthenticated, libraryController.renderAdminLibraries)
router.post('/libraries-admin', libraryController.checkAdminAuthenticated, libraryController.newLibrary)
router.get('/libraries-admin/:id', libraryController.checkAdminAuthenticated, libraryController.getSingleLibrary)
router.post('/libraries-admin/:id', libraryController.checkAdminAuthenticated, libraryController.editLibrary)
router.get('/libraries-admin/delete/:id', libraryController.checkAdminAuthenticated, libraryController.deleteLibrary)

//log in-------------------------------------------------------------------------------------------------
router.post('/login', libraryController.doLogin);
router.post('/signup', libraryController.doRegister);
// router.get('/login', (req, res) => res.render('index', {needtolog:true}));
// router.get('/loggedin', (req, res) => res.render('index', {partialContext: {name:req.session.loggedUserName}, loggedin:true}))
router.get('/logout', libraryController.doLogout)
// router.get('/afterregister',(req, res) => res.render('index', {aftersignup:true}))
// router.get('/failed',(req, res) => res.render('index', { failedloggin: true }))


// router.all('*', (req, res) => res.render('not_found', {layout: '404'}))


module.exports = router;
