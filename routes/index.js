const express = require("express"),
    router = express.Router();

// Get Landing Page
router.get("/", function(request, response) {
    response.send("homepage");
});

module.exports = router;