const mongoose = require("mongoose");

function getDefaultDate() {
    let today = new Date();
    let currentDate = (today.getDate() < 10) ? `0${today.getDate()}` : today.getDate();
    let currentMonth = ((today.getMonth() + 1) < 10) ? `0${today.getMonth()+1}` : today.getMonth() + 1;
    let currentYear = today.getFullYear();
    today = `${currentYear}-${currentMonth}-${currentDate}`;
    return today;
}

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    id_card: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tickets: {
        type: String,
        default: "1"
    },
    number: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: String,
        default: getDefaultDate()
    }
});

module.exports = mongoose.model("Registration", registrationSchema);