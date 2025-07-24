const { default: mongoose } = require("mongoose");

const homeSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    photo:{
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Home', homeSchema);