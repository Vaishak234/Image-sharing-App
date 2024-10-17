const mongoose = require("mongoose")


const connectDb = async( ) =>{
    try {
        let connection = await mongoose.connect("mongodb://localhost/project-app", {
             useNewUrlParser: true,
             useUnifiedTopology: true,
         })
         if (connection) {
            console.log('mongoDb is connected on host',connection.connection.host );
        }
    } catch (error) {
        console.log("database connection error")
        
    }
}

module.exports = connectDb