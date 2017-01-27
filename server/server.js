require('dotenv').config({});
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var async        = require('async');
var jwt          = require('jwt-simple');
var moment       = require('moment');
var request      = require('request');
var cors         = require('cors');
var paypal       = require('paypal-rest-sdk');
var fs           = require('fs');
var session      = require('express-session');

var autenticate = require('./controllers/autenticate');


/********************************************************************************************************
 *************************************  DB CONFIG  ******************************************************
 *******************************************************************************************************/
var connection = mongoose.connect(process.env.DB_URL);


/********************************************************************************************************
 ***********************************  REQUIRE MODELS  ***************************************************
 *******************************************************************************************************/

require('./models/User');


/********************************************************************************************************
 ***********************************  REQUIRE ROUTES  ***************************************************
 *******************************************************************************************************/

var routes = require('./routes/index');
var users  = require('./routes/users');

var app    = express();
var server = require('http').Server(app);
var io     = require('socket.io')(server);


// ------------------------------------------------------------------------------------------------------
//                                         APP CONFIGURATION START
//  ------------------------------------------------------------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, '/../client/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /assets
//core.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/../client')));

// Use cors
app.use(cors());

// Attach socket.io to response object
app.use(function (req, res, next) {
    res.io = io;
    next();
});


//  ------------------------------------------------------------------------------------------------------
//                                         APP CONFIGURATION END
//  ------------------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------------------
//                                           ROUTES START
// -------------------------------------------------------------------------------------------------------

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);


/********************************************************************************************************
 ***************************************  USERS  ********************************************************
 *******************************************************************************************************/

// No Token required
app.post('/api/user/signin', users.signin);
app.post('/api/user/signup', users.signup);


/********************************************************************************************************
 ***************************************  DEFAULT ROUTE  ************************************************
 *******************************************************************************************************/

app.get('*', routes.index);

// -------------------------------------------------------------------------------------------------------
//                                           ROUTES END
// -------------------------------------------------------------------------------------------------------


module.exports = {app: app, server: server};
