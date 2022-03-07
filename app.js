require("dotenv").config();
const express = require("express");
const postRoute = require("./routes/post-route");

const app = express();

app.use(express.json());
app.use(postRoute.router);
app.use(errorHandler);

// Define a custom error handler TODO
function errorHandler(err, req, res, next) {
  console.log(err.stack);
  if (err.statusCode) {
    res.status(err.statusCode);
  } else {
    res.status(500);
  }
  res.send({ error: err.message });
}



// Start Express server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Igenda listening on port ${port}`);
});
