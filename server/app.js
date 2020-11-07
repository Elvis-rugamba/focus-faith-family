const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const api = require("./routes/api");
const routes = require("./routes");
const init = require("./nms");
const {
  translate,
  initializeTranslations,
  setFallbackLocale,
} = require("./i18n/i18n");
const catchErrors = require("./utils/catchErrors");
const timeDifference = require("./utils/timeDifference");
const port = 3000 || process.env.PORT;

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  catchErrors(async function (request, response, next) {
    response.locals.baseUrl = `${request.protocol}://${request.headers.host}`;
    // Get enabled locales from Contentful
    response.locals.locales = ["ki-RW", "en-GB", "fr-FR"];
    response.locals.currentLocale = response.locals.locales[0];

    // Initialize translations and include them on templates
    initializeTranslations();
    response.locals.translate = translate;
    response.locals.timeDifference = timeDifference;

    next();
  })
);

// use res.render to load up an ejs view file
app.use("/", routes);
// APIs
app.use("/api", api);

// Catch 404 and forward to error handler
app.use(function (request, response, next) {
  const err = new Error(translate('errorMessage404Route', response.locals.currentLocale))
  err.status = 404
  next(err)
});

// Error handler
app.use(function (err, request, response, next) {
  // Set locals, only providing error in development
  response.locals.error = err
  response.locals.error.status = err.status || 500
  response.locals.title = 'Error'

  console.log(err);
  // Render the error page
  response.status(err.status || 500).json({status: err.status || 500, message: err})
  // response.render('error')
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

init();
