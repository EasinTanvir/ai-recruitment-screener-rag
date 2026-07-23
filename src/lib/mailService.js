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

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || "",
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export async function sendCandidateEmail({
  email,
  firstName,
  jobTitle,
  message,
}) {
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#333">
    
      <h2>Interview Invitation</h2>

      <p>Hi ${firstName || "Candidate"},</p>

      <p>
        Thank you for applying for the <strong>${jobTitle}</strong> position at
        <strong>HireFlow</strong>.
      </p>

      <p>
        We have reviewed your application and would like to invite you to the
        next stage of our recruitment process.
      </p>

      <div
        style="
            margin:24px 0;
            padding:16px;
            background:#f8fafc;
            border-left:4px solid #2563eb;
        "
      >
        ${message.replace(/\n/g, "<br/>")}
      </div>

      <p>
        If you have any questions, simply reply to this email.
      </p>

      <br/>

      <p>
        Best Regards,<br/>
        Hiring Team<br/>
        HireFlow
      </p>

    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Interview Invitation - ${jobTitle}`,
    html,
  });
}
