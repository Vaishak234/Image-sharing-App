const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const {verifyAuth} = require("../middlewares/verifyAuth")
const  passport  = require("passport")
const restrictAccess = require("../middlewares/restrictAcces")
const {register, getAdminLogin, adminLogin, getRegister, getLogin, login, googleAuth, logout} = require("../controllers/authController")
const Admin = require("../models/admin")



// -------admin login --------------
router.get("/admin/login", getAdminLogin)

router.post("/admin/login", adminLogin)

router.get("/register",restrictAccess, getRegister)

router.get("/login",restrictAccess, getLogin)

router.post("/register",restrictAccess, register)

router.post("/login",restrictAccess,login )

router.get("/google",passport.authenticate("google",["profile","email"]))

router.get('/google/callback',restrictAccess, googleAuth);

router.get("/logout", logout)


module.exports = router