const User = require("../models/User");
const Admin = require("../models/admin")

const verifyAuth = async (req, res, next) => {
  
    try {
        if (!req.session.user_id ) {
            console.log("not logged in");
            return res.redirect('/api/auth/login');
        } 
        
        var user = await User.findOne({ _id: req.session.user_id }); 

        if (!user) {
            console.log("User not found");
            return res.redirect('/api/auth/login');
        }

        req.user = user; 
     
        next();
        
    } catch (error) {
        console.error("Error verifying authentication:", error);
        return res.status(500).send('Internal Server Error');
    }
};

const verifyAdminAuth = async (req, res, next) => {
  
    try {
        if (!req.session.admin_id ) {
            console.log("not logged in");
            return res.redirect('/api/auth/admin/login');
        } 
        
        var user = await Admin.findOne({ _id: req.session.admin_id }); 

        if (!user) {
            console.log("User not found");
            return res.redirect('/api/auth/login');
        }

        req.user = user; 
     
        next();
        
    } catch (error) {
        console.error("Error verifying authentication:", error);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports = {verifyAuth,verifyAdminAuth}