const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const forgotEmail = (email, resetToken) => {
  // styles for all important mail css for forgot-password start
  const emailContent = `
<html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          display:flex;
          align-items: center;
          justify-content: center;
          position: relative;
          top: 1rem;
          width: 50%;
          height: 100%;
          margin: auto;
        }
        .container {
          display:flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          positon: relative;
        }
        .subject{
          display: flex;
          align-items:center;
          flex-direction: column;
          gap: 10px;
          width: auto;
        }
        .subject img{
          width: 20px;
          height: 20px;
          object-fit: cover;
        }
        .subject h1{
          font-size: 2.1vw;
          color: #333;
          letter-spacing: 1px;
          font-weight: normal;
          > span{
            font-weight: bolder;
            letter-spacing: 2px;
            color: red;
          }
        }
        .code{
          border: 0.5px solid grey;
          padding: 10px;
          width: auto;
          height: 300px;
          display: flex;
          align-items:center;
          justify-content: center;
          flex-direction: column;
          gap: 1em;
          border-radius: 5px;
        }
        .code .randomkey{
          width: 100px;
          letter-spacing: 2px;
          background: #eaf5ff;
          color: #24292e!important;
          display: inline-block;
          border-radius: 6px;
          padding: 2px 6px;
        }
        .code button{
          padding: 8px 10px;
          background: lightgreen;
          font-size: 1.1em;
          > a{
             color: black;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="subject">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGcj7nkN12nHlAuuqNnH13kREkvvoRVkxWW7K8_XaHCg&s" alt="Does'nt Show" />
          <h1>Here's your 5 Digit code, <span> ${email}! </span></h1>
        </div>
        <div class="code">
          <div class="randomkey"> ${resetToken} </div>
          <button> <a href="localhost:5173/reset-password">Reset Password</a> </button>
        </div>
        <span>Not able to enter the code? Paste the following link into your browser:</span>
      </div>
    </body>
  </html>
`;
  // styles for all important mail css for forgot-password end

  try {
    // 1. create Email Transporter - SMTP(Simple Mail Trasnfer Protocol)
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    // 2. Configure email content.
    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Password Reset",
      html: `${emailContent}`,
    };

    // 3. Send Mail
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error(error);
      }
      console.log("Email sent: " + info.response);
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = forgotEmail;
