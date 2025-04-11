require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const hbsHelpers = require('./helpers/hbs');

// Route imports
const indexRouter = require('./routes/index');
const taskRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');

// Init app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// View engine (Handlebars with prototype access + helpers)
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: hbsHelpers
}));
app.set('view engine', 'hbs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Flash and passport
app.use(flash());
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Set global variables for views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/tasks', taskRouter);
app.use('/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
