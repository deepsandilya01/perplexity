import nodemailer from "nodemailer";

const requiredMailEnvVars = [
  "GOOGLE_USER",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
];

function getMissingMailEnvVars() {
  return requiredMailEnvVars.filter((envVar) => !process.env[envVar]);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send emails");
  })
  .catch((err) => {
    console.error("Email transporter verification failed:", err);
  });

export async function sendEmail({ to, subject, html, text }) {
  const missingMailEnvVars = getMissingMailEnvVars();

  if (missingMailEnvVars.length > 0) {
    throw new Error(
      `Missing mail environment variables: ${missingMailEnvVars.join(", ")}`,
    );
  }

  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };

  try {
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details.response);
    return details;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}
