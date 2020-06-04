const express = require("express");
const multer = require("multer");
const router = express.Router();

const Registration = require("../models/registration");
const isLoggedIn = require("../config/auth");

// Set Storage engine
const storage = multer.diskStorage({
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
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 //max size of 10mb allowed for file uploaded
    },
    fileFilter: fileFilter
});

function generateRegistrationNumber() {
    let generate = new Date().toISOString();
    let numbers = generate.match(/\d+/g).map(Number);
    return numbers.join("");
}

// ROUTES

// Add new registration
router.post("/", upload.single("idCard"), function(request, response, next) {
    let { name, phone, email, type, tickets } = request.body;
    let number = generateRegistrationNumber();
    tickets = (type == "Self") ? "1" : tickets;
    const file = request.file;
    if (!file) {
        const error = (request.fileValidationError) ? (request.fileValidationError) : (new Error("Please upload a file"));
        error.httpStatusCode = 400;
        // return next(error);
        return response.json({ error: error });
    }
    let id_card = "\\" + file.path;
    let registration = new Registration({ name, phone, email, id_card, type, tickets, number });
    registration.save(function(error, newRegistration) {
        if (error) {
            return response.json({ error: error });
        }
        response.json(newRegistration);
    });
});

// Get all registrations
router.get("/", isLoggedIn, function(request, response) {
    Registration.find(function(error, registrations) {
        if (error) {
            response.json({ error: error });
        } else {
            response.json(registrations);
        }
    });
});

// Get specific registration
router.get("/:id", isLoggedIn, function(request, response) {
    Registration.findById(request.params.id, function(error, registration) {
        if (error) {
            response.json({ error: error });
        } else {
            response.json(registration);
        }
    });
});

module.exports = router;