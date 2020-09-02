const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const api = require("./routes/api");
const routes = require("./routes");
const init = require("./nms");
const port = 3000;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

// use res.render to load up an ejs view file
app.use("/", routes);
// APIs
app.use("/api", api);
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

init();
