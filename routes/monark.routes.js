const express = require( 'express' );
const router = express.Router();
const Monark = require( '../models/monark.model' );

const multer = require( 'multer' );
const upload = multer( {

    storage: multer.diskStorage( {
        destination: function ( req, file, cb ) {
            cb( null, 'public/images' );
        },
        filename: function ( req, file, cb ) {
            //cb(null, Date.now() + '-' + file.originalname)
            cb( null, file.originalname )
        }
    } )
} );


// ----- HENT/GET ALLE ------------------------------------------------------------------------------------------

router.get( '/', async ( req, res ) => {

    console.log( "HENT ALLE" );

    try {
        const monarker = await Monark.find().sort( [ [ 'navn', 1 ] ] );

        res.json( monarker );

    } catch ( err ) {
        res.status( 500 ).json( { message: "Der var en fejl i :" + err.message } ); // 500 = serverproblem
    }

} );


// ----- HENT/GET SØGNING  ------------------------------------------------------------------------------------------------------------- 
// ----- OBS! Denne skal ligge før /:id da ordet "soeg" i routen ellers bliver regnet for en "id"

router.get( '/soeg/:soegeord', async ( req, res ) => { //

    console.log( "SØG SIMPEL" );

    try {

        const monarker = await Monark.find( {
            $or: [
                { "navn": { "$regex": req.params.soegeord, "$options": "i" } },       // søg i alt som små bogstaver
                { "historie": { "$regex": req.params.soegeord, "$options": "i" } }
            ]
        } )

        res.json( monarker );

    } catch ( err ) {
        res.status( 500 ).json( { message: "Der var en fejl i: " + err.message } ); // 500 = serverproblem
    }

} );


// ----- HENT/GET UDVALGT  ------------------------------------------------------------------------------------------------------------- 

router.get( '/:id', findMonark, async ( req, res ) => { //

    console.log( "HENT UDVALGT" )

    res.json( res.monark );

} );





// ADMIN ROUTES  -----------------------------------------------------------
// *************************************************************************


// ----- OPRET/POST NY ----------------------------------------------------------------------------------------

router.post( '/admin', upload.single( 'billede' ), async ( req, res ) => {

    console.log( "POST" );

    let monark;

    try {

        nymonark = new Monark( req.body );
        nymonark.billede = req.file ? req.file.filename : "404.jpg"; // eller null hvis der ikke skal være paavej.jpg

        await nymonark.save();
        res.status( 201 ).json( { message: "Ny er oprettet", oprettet: nymonark } );

    } catch ( error ) {
        res.status( 400 ).json( { message: "Der er sket en fejl", error: error } );
    }

} );




// ----- SLET/DELETE ------------------------------------------------------------------------------------------------------------- 

router.delete( '/admin/:id', findMonark, async ( req, res ) => {

    console.log( "DELETE" )

    try {

        let slettetmonark = await res.monark.remove();
        res.status( 200 ).json( { message: 'Monark slettet', slettet: slettetmonark } )

    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json( { message: 'Kan ikke slettes - der er opstået en fejl', slettet: null } )
        //res.status( 500 ).end();
    }

} );


// ----- RET/PUT ------------------------------------------------------------------------------------------------------------- 

router.put( '/admin/:id', upload.single( 'billede' ), findMonark, async ( req, res ) => {

    console.log( "PUT" )

    try {

        res.monark.navn = req.body.navn;
        res.monark.land = req.body.land;
        res.monark.historie = req.body.historie
        res.monark.foedtaar = req.body.foedtaar
        res.monark.doedaar = req.body.doedaar

        // fra multer - skal kunne håndtere at billedet måske ikke skal udskiftes
        if ( req.file ) {
            res.monark.billede = req.file.filename;
        }

        await res.monark.save();

        res.status( 200 ).json( { message: 'Der er rettet', rettet: res.monark } );

    } catch ( error ) {
        console.log( error )
        res.status( 400 ).json( { message: 'Kan ikke rettes - der er opstået en fejl', rettet: null } )
        //res.status(400).end();
    }

} );



// MIDDLEWARE 

// FIND UD FRA ID  ---------------------------------------------------------------------------------------------

async function findMonark ( req, res, next ) {

    console.log( "FIND UD FRA ID", req.params.id )

    let monark;

    try {

        monark = await Monark.findById( req.params.id );

        if ( monark == null ) {
            return res.status( 404 ).json( { message: 'Ingen med den ID' } );
            //return res.status( 404 ).end();
        }


    } catch ( error ) {

        console.log( error );
        return res.status( 500 ).json( { message: "Problemer: " + error.message } ); // problemer med server
    }

    res.monark = monark; // put det fundne ind i responset
    next();
}


module.exports = router;