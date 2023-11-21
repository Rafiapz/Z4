require("dotenv").config();
const nodemailer = require("nodemailer");


async function makeOTP(emailuser) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "rafikandathuvayal@gmail.com",
      pass: process.env.gmailpsw,
    },
  });

  function generateOTP() {
    let OTP = Math.floor(1000 + Math.random() * 9000).toString();

    let timestamp=Date.now()

    return {OTP,timestamp};
  }

  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Success", success);
    }
  });

  function sendOTPEmail(email, otp) {
    const mailOptions = {
      from: "rafikandathuvayal@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
      } else {
        console.log("OTP sent:", info.response);
      }
    });
  }

  const userEmail = emailuser;
  
  const DATA= generateOTP();
  
  
  sendOTPEmail(userEmail,DATA.OTP);



 
  return DATA
}

module.exports = { makeOTP };
