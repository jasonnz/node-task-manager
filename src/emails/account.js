const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jasonnz@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app ${name} let us know how you get along with the app!`
    })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jasonnz@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Sorry to see you leave ${name} let us know what we can do better with the app?`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}