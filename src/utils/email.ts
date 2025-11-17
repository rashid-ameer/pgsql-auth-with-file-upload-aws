import env from "../config/env.js";
import resend from "../config/resend.js";

const getReceiverEmail = (to: string) => {
  return env.nodeEnv === "development" ? "onboarding@resend.dev" : to;
};

const sendEmail = async (to: string, subject: string, html: string) => {
  return resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [getReceiverEmail(to)],
    subject,
    html,
  });
};

export default sendEmail;
