import nodemailer from "nodemailer";
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      port: 587,
      host: "smtp.gmail.com",
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text: text || "",
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(` Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(" Email sending failed:", error.message);
    return { success: false, error: error.message };
  }
};

const sentCandidateEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: "Your login verification code",
    html: `<h2>Your OTP: ${otp}</h2><p>Valid for 2 minutes</p>`,
  });
};
