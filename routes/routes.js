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