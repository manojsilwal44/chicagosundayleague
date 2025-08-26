import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Removed next-auth import since we're using custom authentication
// Removed authOptions import since we're using custom authentication

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  try {
    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const eventId = id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.participants.length >= event.maxParticipants) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    const participation = await prisma.participant.create({
      data: { eventId, userId },
    });
    
    return NextResponse.json(participation, { status: 201 });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json({ error: "Failed to join event" }, { status: 500 });
  }
}


