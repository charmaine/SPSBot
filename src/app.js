'use strict';

var express = require('express');
var app = express();

// Adding the AIP bot
var bot = require('./bot');
bot.setup(app);

// Start our nodejs app
app.listen(process.env.PORT || 3333, function() {
    console.log('App started listening on port 3333');
});
