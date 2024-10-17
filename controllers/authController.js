const bcrypt = require("bcryptjs")
const User = require("../models/User")
const  passport  = require("passport")
const { default: mongoose } = require("mongoose")
const asyncHandler = require('express-async-handler');




// @desc get admin login
const getAdminLogin =  (req, res) => {
    
   res.render("admin/login",{layout:"layouts/authLayout.ejs"})
}

// @desc admin login 
const adminLogin = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body
        if (!email || !password) return res.status(404).json({ message: "all fields are required" })
         
          const userExist = await Admin.findOne({email})
       
        
     if(!userExist) return res.status(404).json({ message: "user not exist" })
   
     const isMatch = await bcrypt.compare(password, userExist.password)
     if(!isMatch) return res.status(404).json({ message: "wrong password" })
   
      req.session.admin_id = userExist._id
      res.redirect("/api/admin")

})

// @desc get register page
const getRegister = (req, res) => {

   res.render("users/register",{layout:"layouts/authLayout"})
}


// @desc get login page
const getLogin = (req, res) => {
    
   res.render("users/login",{layout:"layouts/authLayout.ejs"})
}


// @desc register
const register = asyncHandler(async (req, res) => {
     
       const { username, email, password, confirmPassword } = req.body
       const userExist = await User.findOne({ $or: [{ username }, { email }] })
      
       if(userExist) return res.status(404).json({ message: "username or email already exist" })
       if (!username || !email || !password || !confirmPassword) return res.status(404).json({ message: "all fields are required" })
       if (password != confirmPassword) return res.status(404).json({ message: "password not match" })
       const hashedPassword = await bcrypt.hash(password, 10)
       
       await User.create({
           username,
           email,
           password: hashedPassword,
           role:"user"
       })
        
         res.redirect("/api/auth/login")

})

// @desc login 
const login = asyncHandler(async(req, res,next) => {

     const { email, password } = req.body
     if (!email || !password ) res.status(404).json({ message: "all fields required" })
     const userExist = await User.findOne({ email})
     if(!userExist) return res.status(404).json({ message: "user not exist" })
   
     const isMatch = await bcrypt.compare(password, userExist.password)
     if(!isMatch) return res.status(404).json({ message: "wrong password" })

      req.session.user_id = userExist._id
      res.redirect("/api/posts")

})




// @desc google auth
const googleAuth = asyncHandler(async(req, res, next) => {
  
    passport.authenticate('google',{passReqToCallback:true}, (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            return res.status(401).json({ message: "Authentication failed" });
        }
        
        if (!user) {
            console.log("No user found, redirecting to login");
            return res.redirect('/api/auth/login'); // Redirect if no user found
        }

        req.login(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return res.status(401).json({ message: "Login failed" });
            }
        
            // Store user ID in session
            req.session.user_id = user 
            return res.redirect('/api/posts'); 
        });
    })(req, res, next); 
})

//@desc logout 
const logout = asyncHandler(async(req, res) => {

    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
  
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json('Could not log out.');
            }
            res.redirect('/api/auth/login')
        });
    })
})



module.exports = {
    register,
    logout,
    googleAuth,
    getLogin,
    getRegister,
    login,
    adminLogin,
    getAdminLogin

}