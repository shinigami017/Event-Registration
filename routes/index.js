var express = require("express"),
    router = express.Router();

// Get Landing Page
router.get("/", function(request, response) {
    response.render("index");
});


module.exports = router;