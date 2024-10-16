"use server";
import nodemailer from "nodemailer";

const sendMail = async (email: string, summary: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Feedback Matters</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; border: 1px solid #e0e0e0; border-spacing: 0; text-align: left;">
                    <tr>
                        <td align="center" style="padding: 30px 0; background-color: #000000;">
                            <h1 style="font-size: 24px; margin: 0; color: #ffffff; font-weight: normal;">Call Summary</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <!-- Call summary section -->
                            <table role="presentation" style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
                                <tr>
                                    <td style="font-size: 16px; padding: 10px 0;"><strong>Summary:</strong></td>
                                    <td style="font-size: 16px; padding: 10px 0;">${summary}</td>
                                </tr>
                            </table>

                            <!-- Buttons to accept or reject booking -->
                            <div style="display:flex; align-items : center; gap : 4px;  text-align: center; margin-bottom: 20px;">
                                <a href="" style="background-color: #28a745; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; margin-right: 10px;">Accept Booking</a>
                                <a href="" style="background-color: #dc3545; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Reject Booking</a>
                            </div>

                            <!-- Feedback input -->
                            <div style="text-align: center;">
                                <label for="feedback" style="font-size: 16px; display: block; margin-bottom: 10px;">Your Feedback:</label>
                                <input type="text" id="feedback" name="feedback" placeholder="Enter your feedback here" style="padding: 10px; width: 100%; max-width: 400px; border: 1px solid #e0e0e0; border-radius: 5px; font-size: 16px;">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #f8f8f8; font-size: 14px; text-align: center; color: #666666;">
                            <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

  const mailOptions = {
    from: `"P101" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "PP:101",
    html: html,
  };

  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return rej();
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return res(true);
    });
  });
};

export default sendMail;
