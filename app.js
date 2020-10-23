require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const hoomanModel = require('./models/hooman.model')


require('./config/db.config')
require('./config/cloudinary.config.js')

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
app.use(session({
    secret: 'Secret',
    saveUninitialized: false,
    resave: false, //don't save session if unmodified
    cookie: {
      maxAge: 24*60*60*1000 //in milliseconds
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24*60*60
    })
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'dogGO';

//to remain logged out even after hitting back button
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

const index = require('./routes/index.routes');
app.use('/', index);

const privateRoutes = (req, res, next) => {
  if (req.session.loggedInUser) {
    next()
  }
  else {
    res.redirect('/login')
  }
}

app.use(privateRoutes)

const ownerRoutes = require('./routes/owner.routes');
app.use('/', ownerRoutes);

const volunteerRoutes = require('./routes/volunteer.routes');
app.use('/', volunteerRoutes);

const messageRoutes = require('./routes/message.routes');
app.use('/', messageRoutes);

const imageRoutes = require('./routes/file-upload.routes');
app.use('/', imageRoutes);


module.exports = app;
