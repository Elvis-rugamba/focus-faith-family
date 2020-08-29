const express =  require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/connect');
const {verifyToken} = require('./middleware/verifyToken');
const routes = require('./routes');
const config =  require('./config/config');
const morgan =  require('./config/morgan');
const logger =  require('./config/logger');
const APIError = require('./utils/APIError');
const { errorConverter, errorHandler } = require('./middleware/error');
const port = 3000

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))

// Force all requests on production to be served over https
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && config.env === 'production') {
    const secureUrl = 'https://' + req.hostname + req.originalUrl
    res.redirect(302, secureUrl)
  }
  next()
})

// use res.render to load up an ejs view file
app.use('/', routes)

// APIs
app.get('/api/users', db.getAllUsers);
app.get('/api/news', db.getAllArticles);
app.get('/api/categories', db.getCategories);
app.get('/api/group-categories', db.getCategoriesByGroup);
app.post('/api/new-article', db.createArticle);
app.post('/api/new-category', db.createCategory);
app.post('/api/new-user', db.createUser);
app.get('/api/news/:newsId', db.getArticle);
app.post('/api/signin', db.signinUser);
app.patch('/api/user/:userId', verifyToken, db.changeRole);
app.patch('/api/edit-article/:articleId', verifyToken, db.editArticle);
app.listen(port, () => {
  logger.info(`App running on port ${port}.`)
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new APIError(404, 'Not found'));
});

// convert error to APIError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);