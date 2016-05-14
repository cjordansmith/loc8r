// require mongo to use mongoose
var mongoose = require( 'mongoose' );
// creating mongoose connection
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);

// Emulate disconnection events on Windows
var readLine = require("readline");
if (process.platform === "win32"){
  var rl = readLine.createInterface ({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ("SIGINT", function (){
    process.emit ("SIGINT");
  });
}

// Monitoring for successful connection through Mongoose
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
// Checking for connectin error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
// Checking for disconnection event
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

// Reuseable function to close Mongoose connection
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

/* Listen to Node processes for termination or restart signals
   Call gracefulShutdown function when appropriate, passing a continuation callback */

// For nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});

// import location.js into the application
require('./locations');
