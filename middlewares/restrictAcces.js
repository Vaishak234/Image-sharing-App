const asyncHandler = require('express-async-handler');

const restrictAccess = asyncHandler(async (req, res, next) => {
  
        if (req.session.user_id ) {
            console.log("not logged in");
            return res.redirect('/api/posts');
        } 
        
        next();
        
   
})


module.exports = restrictAccess