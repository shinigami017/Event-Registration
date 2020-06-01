const express = require("express");
const multer = require("multer");
const router = express.Router();

var Registration = require("../models/registration");


// Set Storage engine
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "cards");
    },
    filename: function(req, file, cb) {
        let newfilename = "ID_CARD" + Date.now() + "." + file.originalname.split(".").pop();
        cb(null, newfilename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        // Accept a file
        cb(null, true);
    } else {
        // Reject a file
        // cb(null, false);
        cb(new Error("Only .jpeg | .png files allowed."), false);
    }
};

//Init upload
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 //max size of 10mb allowed for file uploaded
    },
    fileFilter: fileFilter
});

function generateRegistrationNumber() {
    var generate = new Date().toISOString();
    var numbers = generate.match(/\d+/g).map(Number);
    return numbers.join("");
}
// ROUTES

// Get Homepage
router.get("/", function(request, response) {
    response.render("home");
});

router.post("/add-registration", upload.single("idCard"), function(request, response, next) {
    var { name, phone, email, type, tickets } = request.body;
    var number = generateRegistrationNumber();
    tickets = (type == "Self") ? "1" : tickets;
    const file = request.file;
    if (!file) {
        const error = (request.fileValidationError) ? (request.fileValidationError) : (new Error("Please upload a file"));
        error.httpStatusCode = 400;
        return next(error);
    }
    var id_card = "\\" + file.path;
    var registration = new Registration({ name, phone, email, id_card, type, tickets, number });
    registration.save(function(error, newRegistration) {
        if (error) {
            response.redirect("/home");
            return console.log(error);
        } else {
            response.render("success", { registration: newRegistration });
        }
    });
});

router.get("/preview", function(request, response) {
    response.render("show");
});

module.exports = router;