// const express = require("express");
// const morgan = require("morgan");
// const app = express();

// // sets up a middleware to parse incoming JSON payloads in HTTP requests. The { limit: "5mb" } 
// //option specifies that the size limit for incoming JSON payloads is 5 megabytes. 
// //If a request body exceeds this limit, an error will be thrown.
// app.use(express.json({ limit: "5mb" })); 
// app.use(morgan("dev"));

// app.disable("x-powered-by"); // to disable express server fingerprinting

// const indexRoutes = require("./routes");

// app.use("/api/v1", indexRoutes);

// module.exports = app;

const express = require('express');
const morgan = require('morgan');
const app = express();

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.disable('x-powered-by'); // Disable server fingerprinting

// Importing routes
const indexRoutes = require('./routes');

// Use the imported router
app.use('/api/v1', indexRoutes);

module.exports = app;
