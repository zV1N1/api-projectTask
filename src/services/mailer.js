const nodemailer = require('nodemailer')
const hbs = require("nodemailer-express-handlebars")
const path = require('path')

const { user, pass } = require('../config/mail.json')

const transport = nodemailer.createTransport({ 
    service: "Gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass
    },
})

transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html',
}));

const sendEmail = async function(email, variables) {

  const { name,  token } = variables

  const message = await transport.sendMail({
  to:  `${name} ${email}`,
  subject: 'Redefine Password',
  template: 'forgot_password',
  context: { token },
  from: 'No Reply <example@nodemailer.com>',
  })

  console.log("Message sent: %s", message.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message))
} 

module.exports = sendEmail

