import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const eventId = id;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { participants: true },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (event.participants.length >= event.maxParticipants) {
    return NextResponse.json({ error: "Event is full" }, { status: 400 });
  }

  const participation = await prisma.participant.create({
    data: { eventId, userId: session.user.id },
  });
  return NextResponse.json(participation, { status: 201 });
}


