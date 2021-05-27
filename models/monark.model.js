const mongoose = require('mongoose');

const monarkSchema = new mongoose.Schema({

    navn: {
        type: String,
        required: true
    },
    land: {
        type: String,
        required: true
    },
    historie: {
        type: String,
        required: true
    },
    foedtaar: {
        type: Number
    },
    doedaar: {
        type: Number
    },
    billede: {
        type: String
    }
})


module.exports = mongoose.model('Monark', monarkSchema, 'monarker')