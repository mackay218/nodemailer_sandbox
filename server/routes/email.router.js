const express = require('express');
// const { rejectUnauthenticated } = require('../modules/authentication-middleware');
// const encryptLib = require('../modules/encryption');
// const pool = require('../modules/pool');

const router = express.Router();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //do I need to change this line?
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.my_gmail_email, 
        clientId: process.env.my_oauth_client_id,
        clientSecret: process.env.my_oauth_client_secret,
        refreshToken: process.env.my_oauth_refresh_token,
        accessToken: process.env.my_oauth_access_token
    }
});

router.post('/', (req, res) => {
    console.log(req.body);

    const mail = {
        from: "Polaris Hockey <polarishockey@gmail.com>",
        to: req.body.emailAddress,
        subject: "testing nodemailer eh",
        text: 'we invite you so join us' + req.body.emailAddress,
        html: `<p>testing again eh ${req.body.emailAddress}</p>`
    }

    transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log('error sending mail:', error);
        }
        else {
            //see https://nodemailer.com/usage
            console.log("info.messageId: " + info.messageId);
            console.log("info.envelope: " + info.envelope);
            console.log("info.accepted: " + info.accepted);
            console.log("info.rejected: " + info.rejected);
            console.log("info.pending: " + info.pending);
            console.log("info.response: " + info.response);
        }
        transporter.close();
    });

});





module.exports = router;