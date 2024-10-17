const express = require("express")
const dotenv = require("dotenv").config()
const path = require("path")
const ejsLayout = require("express-ejs-layouts")
const expressSession = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const passport = require("passport")


const postRoute = require("./routes/postRoute")
const userRoute = require("./routes/userRouter")
const authRoutes = require("./routes/authRoute")
const adminRoutes = require("./routes/adminRoutes")
const connectDb = require("./database/connection")
const passportStrategy = require("./utils/passport")
const errorHandler = require("./middlewares/errorHandler")
const app = express()


const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const store = new MongoDBStore({
    uri: "mongodb://localhost/project-app",
    collection: 'sessions'
});


app.use(expressSession({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store:store,
    cookie: { httpOnly:true}
}))



app.use(passport.initialize())
app.use(passport.session())


// app.use((req, res,next) => {
//     console.log("session user id : ",req.session?.user_id);
//     console.log("session user : ",req.user);
//     next()
// })


app.use("/static", express.static(path.join(__dirname, "public")))

app.use(ejsLayout)
app.set('layout','./layouts/layout')
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "ejs")

connectDb()


app.use("/api/posts",postRoute)
app.use("/api/user",userRoute)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)


// error handler middleware
app.use(errorHandler)

app.get('/', (req, res) => {
    
    res.render("user",{layout:"layouts/authLayout"})
})



const server = app.listen(PORT, () =>  console.log(`Server is running on http://localhost:${PORT}/api/auth/login`))

// const io = require("socket.io")(server)


// io.on('connection', (socket) => {
//     console.log("new client has ben connected");
//     socket.username = "Anonymous"

//     socket.on("new_message", (data) => {
//         io.sockets.emit("new_message",{message:data.message,username:socket.username})
//     })
// })

