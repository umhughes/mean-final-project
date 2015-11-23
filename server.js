// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var router       = express.Router();
var language     = require("./app/models/language");

var configDB = require('./config/db.js');

// configuration ===============================================================
mongoose.connect(configDB.db); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'secret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here

    
    
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/languages')

    // create a language (accessed at POST http://localhost:8080/api/languages)
    .post(function(req, res) {
        
        var language = new language();      // create a new instance of the language model
        language.name = req.body.name;  // set the language name (comes from the request)

        // save the language and check for errors
        language.save(function(err) {
            if (err)
               return res.send(err);

            res.json({ message: 'language created!' });
        });
    })
    
        // get all the languages (accessed at GET http://localhost:8080/api/languages)
    .get(function(req, res) {
        language.find(function(err, languages) {
            if (err)
                return res.send(err);

            res.json(languages);
        });
    });
    
    router.route('/languages/:language_id')

    // get the language with that id (accessed at GET http://localhost:8080/api/languages/:language_id)
    .get(function(req, res) {
        language.findById(req.params.bear_id, function(err, language) {
            if (err)
            return    res.send(err);
            res.json(language);
        });
    })
    
        // update the language with this id (accessed at PUT http://localhost:8080/api/languages/:language_id)
    .put(function(req, res) {

        // use our bear model to find the language we want
        language.findById(req.params.language_id, function(err, language) {

            if (err)
               return res.send(err);

            language.name = req.body.name;  // update the languages info

            // save the language
            language.save(function(err) {
                if (err)
                   return res.send(err);

                res.json({ message: 'Language updated!' });
            });
        })
        
            // delete the language with this id (accessed at DELETE http://localhost:8080/api/languages/:language_id)
    .delete(function(req, res) {
        language.remove({
            _id: req.params.language_id
        }, function(err, language) {
            if (err)
                return res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
    });  
    



app.use('/api', router);
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);