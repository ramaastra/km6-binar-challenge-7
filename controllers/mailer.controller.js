const { transporter } = require('../libs/nodemailer');

module.exports = {
  sendEmail: async (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  }
};
