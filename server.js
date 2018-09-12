//requirements
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bandwidth = require("node-bandwidth");

//initialize app
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));

require("./routes/routes.js")(app);

//initialize Bandiwdth client
var client = new Bandwidth({
    userId    : "{{USER_ID}}",
    apiToken  : "{{TOKEN}}",
    apiSecret : "{{SECRET}}"
});

//SMS reminder function
function sendReminderSMS(){

    //first, pull info about the client
    //(their phone number and the date and time of their appointment)
    //from whatever database you are using
    //and set variables
    var apptDate = "{{DATE}}";
    var apptTime = "{{TIME}}";
    var clientNum = "{{CLIENT_NUMBER}}";
    var BWNum = "{{YOUR_BANDWIDTH_NUM}}}";

    //create outgoing SMS
    client.Message.send({
        from: BWNum,
        to: clientNum,
        text: "This is a reminder that you have an appointment at {{OFFICE NAME}} on " + apptDate + " at " + apptTime + ". Text YES to confirm your appointment."
    }).then(message => {
        console.log(message);
    });
}

//set SMS reminder function
//to run once a day
setInterval(sendReminderSMS, 86400000);

//listen
app.listen(port, function() {
    console.log("App listening on PORT " + port);
});