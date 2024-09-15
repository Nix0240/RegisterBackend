import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const generateVerificationEmail = (verificationLink) => {
  return `
      <!DOCTYPE html>
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
            <h2>Welcome to Our Platform</h2>
            <p>Thank you for registering with us! Please click the link below to verify your account:</p>
            <p><a href="${verificationLink}" style="color: blue; text-decoration: underline;">Verify Your Account</a></p>
          </div>
        </body>
      </html>
    `;
};
