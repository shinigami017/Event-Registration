const express = require("express"),
    path = require("path"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    mongoose = require("mongoose");

// Init App
const app = express();

// Connect to MongoDB
const Connection_URI = process.env.MONGODB_URI || "mongodb+srv://shinigami017newuser:newuser1234@shinigami017-azees.mongodb.net/EventRegistration?retryWrites=true&w=majority";
mongoose.connect(
    Connection_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
).then(() => console.log("DB Connected!")).catch(error => console.log(error));


// Express body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set Static Folder
app.use("/cards", express.static(path.join(__dirname, "cards")));

// Set up cookie parser
app.use(cookieParser());

// Express Session Middleware
app.use(session({
    secret: "session secret",
    saveUninitialized: true,
    resave: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require("./config/passport")(passport);

// Routes
// var indexRoute = require("./routes/index"),
var userRoute = require("./routes/users"),
    registrationRoute = require("./routes/registration");
// app.use("/", indexRoute);
app.use("/users", userRoute);
app.use("/registrations", registrationRoute);

// Port Setup
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function() {
    console.log(`Server started on port ${app.get("port")}!`);
    console.log(`Browse the url http://localhost:${app.get("port")}/`);
    console.log(`Press Ctrl + C to stop the server.\n`);
});