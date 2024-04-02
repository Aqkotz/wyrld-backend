import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmail = async ({
  email,
  subject,
  html,
} : {
  email: string,
  subject: string,
  html: string,
}) => {
  const message = {
    to: email,
    from: process.env.SENDGRID_EMAIL as string,
    subject,
    html,
  };
  sgMail
    .send(message)
    .then(() => console.log(`Email sent to ${email}`))
    .catch((e) => {
      throw e;
    });
};