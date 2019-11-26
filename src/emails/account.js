const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey = ""

sgMail.setApiKey(proces.env.SENDGRID_API_KEY)

sgMail.send({
    to : 'gillahmad@gmail.com',
    from : "gillahmad94@gmail.com",
    subject : "subject",
    text : "I hope you will"
})