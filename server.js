require('dotenv').config(); // KUN TIL DEV/test lokalt - 

const cors = require('cors');
const express = require('express');
//const formData = require('express-form-data'); // Kun hvis der ikke er multer i routes!!!!

const app = express();
const PORT = process.env.PORT;


// Mongoose og MongoDB ---------------------------------------------------
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("/// Og nu er der sgisme også hul igennem til en veldrejet DATABASE! ///"));


// APP ----------------------------------------------------------------
app.use(cors({ credentials: true, origin: true }));
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ROUTES ----------------------------------------------------------

//  INDEX
app.get('/', async (req, res) => {
    console.log("HEJ og velkommen serverens startside - vælg en route ...")
});


//  ROUTES -------------------------------------------
app.use('/monarker', require('./routes/monark.routes'));


// LISTEN --------------------------------------------------------------------------------------------------
app.listen(PORT, () => console.log('/// Din SERVER er fuld af krudt og lytter for vildt på port ' + PORT + " ///"));
