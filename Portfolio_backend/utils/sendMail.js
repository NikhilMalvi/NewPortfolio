import nodemailer from "nodemailer";

export const sendEmail = async ({ from, subject, message, name }) => {
  try {
    if (!from || !message) {
      throw new Error("Missing required fields");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.ADMIN_EMAIL}>`,
      replyTo: from,
      to: process.env.SEND_TO_EMAIL,
      subject: subject || "New Contact Message",
      html: `
  <h3>📩 New Portfolio Contact</h3>
  <p><strong>Sender:</strong> ${from}</p>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Subject:</strong> ${subject || "No subject"}</p>
  <p><strong>Message:</strong></p>
  <p>${String(message).replace(/\n/g, "<br>")}</p>
`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✔ Email sent successfully!");
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw new Error(error.message);
  }
};
