var express= require('express');
var path= require('path');
var mongoose= require('mongoose');
var expressValidator = require('express-validator');
var config= require('./config/database.js');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var fileUpload = require('express-fileupload');
var id = require('./routes/adminfounditems');
const passport = require('passport');

require('./config/passport')(passport);
require('./config/authentication');
//MONGOOSE CONNECTION

mongoose.connect('mongodb+srv://Raj:test@server-37xsm.mongodb.net/cart?retryWrites=true&w=majority');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'console error:'));
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//VIEWS
var app= express();
app.set('views', path.join(__dirname, 'views'));


app.set('view engine', 'ejs');

//USE THE PUBLIC FOLDER FOR .CSS FILE

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/foundItems_images/:id')));

app.locals.errors = null;

var Page = require('./models/page')

//EXPRESS FILEUPLOAD//
app.use(fileUpload());

//BODY-PARSER
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//EXPRESS SESSION
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      secure: true, 
    },
  }))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//EXPRESS VALIDATOR
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
      },
      customValidators: {
        isImage: function(value, filename){
          var extension = (path.extname(filename)).toLowerCase();
          switch(extension){
            case '.jpg':
              return '.jpg';
            case '.jpeg':
              return '.jpeg';
            case '.png':
              return '.png';
            default:
              return false;
          }

      }
    }

  }));


//EXPRESS MESSAGES
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use((req, res, next) => {
  res.locals.sucess_msg = req.flash('sucess_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



var Category = require('./models/category');
var foundItems = require('./models/foundItems');

//Implement categories into index
Category.find(function (err, categories) {
  if (err){
    console.log(err);
  } else {
    app.locals.categories = categories;
  }
});


app.get('*', function(req, res,next){
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});


//SETTING ROUTES

///PAGES ROUTE


//FOUND ITEMS ROUTE
var foundItems = require('./routes/foundItems.js');
var adminpages = require('./routes/adminpages.js');
var adminCategories = require('./routes/admincategories.js');
var adminfoundItems = require('./routes/adminfounditems.js');


app.use('/', require('./routes/index'));

app.use('/foundItems', foundItems);

//FOUND ITEMS ROUTE

app.use('/users', require('./routes/users'));

///ADMIN PAGES ROUTE

app.use('/admin/pages', adminpages);

///CATEGORIES ROUTE

app.use('/admin/categories', adminCategories)

//FOUND ITEMS ROUTE

app.use('/admin/foundItems', adminfoundItems)

//STARTING THE SERVER
var port = 3000;
app.listen(port, function(){
    console.log('Server Started on Port: ' + port);
});