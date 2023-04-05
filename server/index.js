const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const dbConfig = require('./config/database-config');
const authRoute = require('./routes/auth');
const googleRoute = require('./routes/google');
const { userRoute } = require('./routes/user');
const generalRoute = require('./routes/general');
require('./config/passport-config');
const authMiddleware = require('./middleware/auth');

const app = express();

dbConfig.createDb();

const dist = path.join(__dirname, '/../client', 'dist');

app.use(expressStaticGzip(dist));

app.use(dbConfig.getSession());
app.use(express.json());

app.use(
  cors({
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);
app.use('/user', authMiddleware.isAuthenticated, userRoute);
app.use('/general', generalRoute);
app.use('/google', authMiddleware.isAuthenticated, googleRoute);

app.use('*', expressStaticGzip(dist));

app.listen(process.env.PORT || 5000);
