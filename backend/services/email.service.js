// SIMPLE PLACE HOLDER 
export const sendEmail = async (email, name , subject, message) => {
  console.log("EMAIL SENT:");
  console.log("To user:", email);
  console.log("Subject:", subject);
  console.log("Message:", message);

  // later: integrate SendGrid / Resend / AWS SES
};