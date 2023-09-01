const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
require("dotenv").config();

const { MAILGUN_API_KEY } = process.env;

const sendEmail = async data => {
    const mg = mailgun.client({
        username: "mikhail.n2004a@gmail.com",
        key: MAILGUN_API_KEY,
    });

    mg.messages
      .create("sandbox75a6d345c101455aa165204978f62d42.mailgun.org", {
        from: "My Mailgun <mikhail.n2004a@gmail.com>",
        to: [data.to],
        subject: "Verify",
        text: "Verify your email",
        html: data.html,
      })
      .then((msg) => console.log(msg)) // logs response data
      .catch((err) => console.log(err)); // logs any error
};

module.exports = sendEmail;