type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmail({ to, subject, body }: EmailPayload) {
  if (process.env.NODE_ENV !== "production" || !process.env.RESEND_API_KEY) {
    console.log("\n📧 [EMAIL — not sent, add RESEND_API_KEY to enable]");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("──────────────────────────────\n");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Cirage Paris Tickets <tickets@cirageparis.com>",
    to,
    subject,
    html: body,
  });
}

const base = (content: string) => `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111">
    <div style="padding:24px 0 8px">
      <span style="font-size:13px;font-weight:600;letter-spacing:.5px;color:#6366f1">CIRAGE PARIS · TICKETS</span>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px"/>
    ${content}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px"/>
    <p style="font-size:12px;color:#9ca3af">You're receiving this because you're a member of the Cirage Paris team.</p>
  </div>
`;

export function assignedEmail(ticketTitle: string, ticketId: string, assigneeName: string) {
  return {
    subject: `You've been assigned: ${ticketTitle}`,
    body: base(`
      <p style="margin:0 0 8px">Hi ${assigneeName},</p>
      <p style="margin:0 0 20px;color:#374151">You've been assigned to a ticket:</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0;font-weight:600">${ticketTitle}</p>
      </div>
      <a href="${process.env.NEXTAUTH_URL}/tickets/${ticketId}"
         style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px">
        View ticket →
      </a>
    `),
  };
}

export function overdueEmail(ticketTitle: string, ticketId: string, assigneeName: string) {
  return {
    subject: `Overdue: ${ticketTitle}`,
    body: base(`
      <p style="margin:0 0 8px">Hi ${assigneeName},</p>
      <p style="margin:0 0 20px;color:#374151">This ticket is past its due date:</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0;font-weight:600;color:#dc2626">⚠ ${ticketTitle}</p>
      </div>
      <a href="${process.env.NEXTAUTH_URL}/tickets/${ticketId}"
         style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px">
        View ticket →
      </a>
    `),
  };
}

export function commentEmail(
  ticketTitle: string,
  ticketId: string,
  recipientName: string,
  commenterName: string,
  commentText: string
) {
  return {
    subject: `New comment on: ${ticketTitle}`,
    body: base(`
      <p style="margin:0 0 8px">Hi ${recipientName},</p>
      <p style="margin:0 0 20px;color:#374151"><strong>${commenterName}</strong> left a comment on a ticket you're involved in:</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:8px">
        <p style="margin:0 0 8px;font-size:12px;color:#6b7280;font-weight:600">${ticketTitle}</p>
        <p style="margin:0;font-size:14px;color:#111827;white-space:pre-wrap">${commentText.slice(0, 300)}${commentText.length > 300 ? "…" : ""}</p>
      </div>
      <div style="margin-bottom:20px"/>
      <a href="${process.env.NEXTAUTH_URL}/tickets/${ticketId}"
         style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px">
        View ticket →
      </a>
    `),
  };
}

export function passwordResetEmail(recipientName: string, resetUrl: string) {
  return {
    subject: "Reset your Cirage Paris Tickets password",
    body: base(`
      <p style="margin:0 0 8px">Hi ${recipientName},</p>
      <p style="margin:0 0 20px;color:#374151">We received a request to reset your password. Click the button below — this link expires in 1 hour.</p>
      <a href="${resetUrl}"
         style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px">
        Reset password →
      </a>
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af">If you didn't request this, you can safely ignore this email.</p>
    `),
  };
}
