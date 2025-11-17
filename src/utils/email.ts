import resend from "../config/resend.js";

const sendEmail =async  (to: string, subject: string, html: string) => {
  return resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
  });
};

export default sendEmail;
