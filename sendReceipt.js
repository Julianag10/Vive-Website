import nodemailer from "nodemailer";

// nodemailer creats a transporter object
// transporter object is  configured to use Mail trap(or SMTP or GMAIL or AWS SES) to send emails
// transporter object is like: “my email sending machine.”
// using using Mailtrap, which is a fake inbox for testing emails.
const transporter = nodemailer.createTransport({
    // host -> Mailtrap’s SMTP server.
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    // auth.user & auth.pass -> your Mailtrap credentials from .env
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

// Takes an object with name, email, and amount.
// THEN Sends an email with that info.
export async function sendConfirmationEmail({ name, email, amount }) {
    const html = `
        <h2>Thank you for your donation!</h2>
        <p>Hi ${name || "friend"},</p>
        <p>We received your donation of <strong>$${amount}</strong>. This email serves as your receipt.</p>
    `;

    // await = wai tuntil it's sent (or fails)
    return transporter.sendMail({
        from: '"Vive Wellness" <donations@vive.org>',
        to: email,
        subject: "Your Donation Receipt",
        html // html: the HTML body we built above.
    });

}