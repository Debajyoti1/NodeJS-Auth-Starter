const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.gmail_oauth_id, // ClientID
    process.env.gmail_oauth_secret, // Client Secret
    process.env.gmail_oauth_redirect_url // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.gmail_oauth_refresh_token
});
const accessToken = oauth2Client.getAccessToken()


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: "OAuth2",
        user: process.env.gmail_oauth_gmailid,
        clientId: process.env.gmail_oauth_id,
        clientSecret: process.env.gmail_oauth_secret,
        refreshToken: process.env.gmail_oauth_refresh_token,
        accessToken: accessToken
    },
});




module.exports =async function sendMail(output,email){
    // send mail with defined transport object
    const mailOptions = {
        from: '"Auth Admin" <nodejsa@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Account Verification: NodeJS Auth ✔", // Subject line
        generateTextFromHTML: true,
        html: output, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return true
        }
        else {
            return false
        }
    })
}