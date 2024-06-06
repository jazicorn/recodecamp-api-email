//const { Request, Response } = require('express');
//const router = require("express-promise-router")();
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
//const { sql } = require('../config/db');
const {
    createTransporter,
    attachmentUpload,
} = require('../middleware/nodemailer');
//const { createEmailHtml } = require('../templates/_email.tsx');
//const { accountValidation, mailOptionsAccountValidation } = require('../templates/accountValidation.tsx');
//const validation = require('../templates/accountValidation.tsx');
require('dotenv').config();

/** Bull Message Queue */
const Queue = require('bull');
const emailQueue = new Queue('queue', process.env.REDIS_URL);

emailQueue.process(async (job, done) => {
    try {
        // Get response from the createTransport
        let emailTransporter = await createTransporter();
        //console.log("emailtrans:", emailTransporter)

        //console.log("job.data:\n", job.data)
        // Send email
        emailTransporter.sendMail(job.data, function (error, info) {
            if (error) {
                // failed block
                console.log(
                    'Error | Email Confirmation Not Sent:\n' + error
                );
            } else {
                // Success block
                console.log('Email sent: ' + info.response);
            }
        });
        done();
    } catch (error) {
        return res.status(500).send({ error: 'Something went wrong' });
    }
});

/** Passcode Routes */
const guestConfirmAccount = async (req, res) => {
    switch (req.method) {
        case 'POST':
            const data = req.body;
            //console.log("data", data);
            let email = data.email;
            let passcode = data.passcode;
            let passcodeConfirmed = data.passcode_confirmed;
            if (email === undefined) {
                email = data._email;
            }
            if (passcode === undefined) {
                passcode = data._passcode;
            }
            if (passcodeConfirmed === undefined) {
                passcodeConfirmed = data._passcode_confirmed;
            }
            if(passcodeConfirmed === true) {
                return res.status(400).send({ error: 'Email Already Confirmed' });
            }
            const url = `${process.env.WEB_URL_ACCOUNT_CONFIRM}/${passcode}`;
            //console.log("url:", url)

            // Mail options
            const mailOptions = {
                from: `Recodecamp ${process.env.OAUTH_SENDER_EMAIL}`,
                to: email,
                subject: 'Account Confirmation',
                // attachments: [{
                //     filename: 'logo',
                //     path: __dirname + '/static/logo.jpg',
                //     cid: 'logo'
                // }],
                html: `<p>Thank You for joining Recodecamp! Please Confirm Your New Account:</p><a href="${url}">Confirm Account</a>`,
            };

            emailQueue.add(mailOptions);

            // try {
            //     // Get response from the createTransport
            //     let emailTransporter = await createTransporter();
            //     //console.log("emailtrans:", emailTransporter)

            //     //console.log("mailoptions:\n", mailOptions)
            //     // Send email
            //     emailTransporter.sendMail(mailOptions, function (error, info) {
            //         if (error) {
            //             // failed block
            //             console.log(
            //                 'Error | Email Confirmation Not Sent:\n' + error
            //             );
            //             return res
            //                 .status(400)
            //                 .send({ error: 'Email Confirmation Error' });
            //         } else {
            //             // Success block
            //             console.log('Email sent: ' + info.response);
            //             return res
            //                 .status(200)
            //                 .send({ data: true });
            //         }
            //     });
            // } catch (error) {
            //     return res.status(500).send({ error: 'Something went wrong' });
            // }
            // This is non blocking
            return res.status(200).send({ data: true });
            break;
        default:
            return res
                .status(400)
                .send({ error: `${req.method} Method Not Allowed` });
    }
};

// /**Public: Guest Confirms Account Validate Passcode*/
// const guestValidateAccount = async (req, res) => {
//     switch (req.method) {
//         case 'POST':
//             try {
//                 const data = req.body;
//                 //console.log("data:", data);
//                 const passcode = data._PASSCODE;
//                 const date = new Date();
//                 //console.log(date);

//                 /**Validate Guest Data */
//                 // Check Guest IP Address
//                 const guestIP = req.socket.remoteAddress;

//                 // complex queries | https://github.com/porsager/postgres
//                 /** Update Confirmed to true */
//                 const updateGuestPasscodeConfirmed = await sql`
//                     UPDATE _GUEST
//                     SET _PASSCODE_CONFIRMED = true
//                     WHERE _PASSCODE = ${passcode};
//                 `;
//                 //console.log("updateGuestPasscode:", updateGuestPasscode);
//                 const updateGuestDate = await sql`
//                     UPDATE _GUEST
//                     SET _UPDATED_AT = ${date}
//                     WHERE _PASSCODE = ${passcode};
//                 `;

//                 const newId = uuidv4();
//                 const updateGuestPasscode = await sql`
//                     UPDATE _GUEST
//                     SET _PASSCODE = ${newId}
//                     WHERE _PASSCODE = ${passcode}
//                     RETURNING *;
//                 `;
//                 const guestResult = updateGuestPasscode[0];
//                 //console.log("guestResult:", guestResult);

//                 if (guestResult !== undefined) {
//                     return res
//                         .status(200)
//                         .send({ message: 'Successful | Account Confirmed' });
//                 }
//             } catch {
//                 return res.status(500).send({ error: 'Database Error' });
//             }
//             break;
//         default:
//             return res
//                 .status(400)
//                 .send({ error: `${req.method} Method Not Allowed` });
//     }
// };

/**Public: Guest Verify Passcode*/
const guestVerifyAccount = async (req, res) => {
    switch (req.method) {
        case 'POST':
            try {
                return res.status(200).send({ message: 'success' });
            } catch (error) {
                return res.status(500).send({ error: 'Something went wrong' });
            }
            break;
        default:
            return res
                .status(400)
                .send({ error: `${req.method} Method Not Allowed` });
    }
};

/**Public: Guest Password Reset*/
const guestPasswordReset = async (req, res) => {
    switch (req.method) {
        case 'POST':
            try {
                return res.status(200).send({ message: 'success' });
            } catch (error) {
                return res.status(500).send({ error: 'Something went wrong' });
            }
            break;
        default:
            return res
                .status(400)
                .send({ error: `${req.method} Method Not Allowed` });
    }
};

module.exports = {
    guestConfirmAccount,
    guestVerifyAccount,
    guestPasswordReset,
};
