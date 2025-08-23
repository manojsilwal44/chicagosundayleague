import nodemailer, { Transporter } from "nodemailer";

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  provider: { server: unknown; from?: string };
}) {
  const { identifier, url } = params;
  const transport: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT || 587),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const result = await transport.sendMail({
    to: identifier,
    from: process.env.EMAIL_FROM,
    subject: "Sign in to PlayOn",
    text: `Sign in by clicking on the link: ${url}`,
    html: `<p>Sign in by clicking on the link below:</p><p><a href="${url}">Sign in</a></p>`
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email (${failed.join(", ")}) could not be sent`);
  }
}


