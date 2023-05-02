const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10

// Require the User model in order to interact with the database
const User = require('../models/User.model')

// Require the User model in order to interact with the database
const Festival = require('../models/Festival.model')

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')

/* GET one profile*/ 
router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId)
    const allFestivals = await Festival.find({createdBy:userId})
        
    res.render('profile/profile', {user, allFestivals})
  } catch(err){
    console.error('There is an error with the profile page' , err)
  }
});

/* POST edit profile */
router.post("/edit-profile", isLoggedIn, async (req, res) => {
  try {
    const sessionId = req.session.user._id
    const profileToEdit = await User.findById(sessionId)
    res.render("profile/edit-profile", {profileToEdit});
  } catch (err){
    console.error('There is an error with the edit profile page' , err)
  }
});

/* POST profile edited */
router.post("/profile-edited", isLoggedIn, async (req, res) => {
  try {
    const sessionId = req.session.user._id
  const {name, surname, username, country, email} = req.body
  const updatedUser = await User.findByIdAndUpdate(sessionId, {name, surname, username, country, email}, { new: true });
  res.redirect("profile");}
  catch (err){
    console.error('There is an error with the edited profile page' , err)
  }
})

module.exports = router