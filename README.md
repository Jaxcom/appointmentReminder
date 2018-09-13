<div align="center">

# Simple Appointment Reminder App Using Node.JS and Express

<a href="http://dev.bandwidth.com"><img src="https://s3.amazonaws.com/bwdemos/BW_Messaging.png"/></a>
</div>

A simple appointment reminder app using Bandwidth's Messaging API, Node.JS, and Express

## Table of Contents

## Prereqs

* [Node v.8.12.0+](https://nodejs.org/en/download/)
* [Bandwidth Account](http://dev.bandwidth.com)
* [Heroku Account](https://www.heroku.com/)
* `BANDWIDTH_USER_ID` - Saved to environment variable
* `BANDWIDTH_API_TOKEN` - Saved to environment variable
* `BANDWIDTH_API_SECRET` - Saved to environment variable
* NPM packages:
    * [express](https://www.npmjs.com/package/express)
    * [body-parser](https://www.npmjs.com/package/body-parser)
    * [path](https://www.npmjs.com/package/path)
    * [node-bandwidth](https://www.npmjs.com/package/node-bandwidth)
* Some database set up from which you can pull each day's clients that need an appointment reminder

## How It Works

This app checks your database once a day for clients that need to be reminded of appointments and prompts them for a confirmation of their appointment.

<div align="center">

<img src="readme_images/reminder_image.jpg">

</div>

### Prep

Make sure you have at least one Bandwidth number registered to you app.bandwidth.com account and that it is set up to receive callbacks from messaging events. For more info on this, go [here](https://dev.bandwidth.com/getStartedSetupGuide.html).

### Set Up Your Requirements in server.js

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bandwidth = require("node-bandwidth");
```

### Set Up Express in server.js

```javascript
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));
```

### Initialize Bandwidth Client in server.js

```javascript
const client = new bandwidth({
    userId    : "{{BANDWIDTH_USER_ID}}",
    apiToken  : "{{BANDWIDTH_API_TOKEN}}",
    apiSecret : "{{BANDWIDTH_API_SECRET}}"
});
```

### Create Appointment Reminder Function and Set on a Daily Interval in server.js

```javascript
function sendReminderSMS(){

    //first, pull info about the client
    //(their phone number and the date and time of their appointment)
    //from whatever database you are using
    //and set variables
    //If there are multiple clients, you will
    //have to loop through this code
    let apptDate = "{{DATE}}";
    let apptTime = "{{TIME}}";
    let clientNum = "{{CLIENT_NUMBER}}";
    let BWNum = "{{YOUR_BANDWIDTH_NUM}}";

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
```

### Create Route for Receiving Messaging Callback in routes.js

```javascript
module.exports = app => {

    //listen for callbacks
    app.post("/callback", (req, res) => {

        //check that callback is from incoming SMS event
        if (req.body.eventType == "sms"){

            //check content of message for 'yes' response
            if (req.body.text.toLowerCase() == ("yes" || "y")){
                
                //here put however you want to process a confirmation of appointment
                
                res.end();
            }
        } else {
            res.end();
        }
    });

}
```

### Require routes.js in server.js

```javascript
require("./routes/routes.js")(app);
```

### Define Port and Listen in server.js

```javascript
const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("App listening on PORT " + port);
});
```

## Deploy

You can now deploy your appointment reminder app to Heroku. Click the button below for more information.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)