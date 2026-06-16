import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      ticketId: params.id,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true } },
      attachments: true,
    },
  });

  await prisma.activity.create({
    data: {
      action: "added a comment",
      ticketId: params.id,
      userId: session.user.id,
    },
  });

  // Email notifications for comment -- notify assignee and ticket creator (excluding commenter)
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (ticket) {
      const { sendEmail, commentEmail } = await import("@/lib/email");
      const notify = new Map<string, { name: string; email: string }>();

      if (ticket.assignee && ticket.assignee.id !== session.user.id) {
        notify.set(ticket.assignee.id, ticket.assignee);
      }
      if (ticket.createdBy.id !== session.user.id) {
        notify.set(ticket.createdBy.id, ticket.createdBy);
      }

      for (const recipient of notify.values()) {
        const emailData = commentEmail(
          ticket.title,
          ticket.id,
          recipient.name,
          session.user.name ?? "Someone",
          content.trim()
        );
        await sendEmail({ to: recipient.email, ...emailData });
      }
    }
  } catch (e) {
    // Don't fail the request if email errors
    console.error("Comment email error:", e);
  }

  return NextResponse.json(comment, { status: 201 });
}
