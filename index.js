require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')

//IMPORTING THE ROUTES
const authRoutes = require('./routes/auth')
const notesRoutes = require('./routes/note')

const app = express()
const PORT = process.env.PORT || 3001
MONGODB_URI = process.env.MONGODB_URI

//SETUP CORS FOR UPDATING THE POLICIES WITH INTERACTING WITH THE FRONTEND SERVER
app.use(cors({
    origin : `https://kassemnotesfrontend.onrender.com`,
    methods : ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials : true
}))

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.send('API is running...')
})

//SETUP MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '30mb' }))
app.use(cookieParser())
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//ROUTES
app.use('/auth', authRoutes)
app.use('/notes', notesRoutes)

//CONNETCTING TO MONGODB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongo DB") 
    app.listen(PORT, () => 
    console.log(`Server running on http://localhost:${PORT}/`))
})
.catch(error => console.error('Error connecting to MongoDB:', error));
