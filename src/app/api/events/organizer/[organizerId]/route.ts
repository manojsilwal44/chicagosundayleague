import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@/lib/eventService";
import { EventStatus } from "@/generated/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizerId: string }> }
) {
  try {
    const { organizerId } = await params;
    const { searchParams } = new URL(req.url);
    
    const status = searchParams.get("status") as EventStatus | null;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    // Use real EventService for production
    const events = await EventService.getEventsByOrganizer(organizerId, status || undefined);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizer events" },
      { status: 500 }
    );
  }
}
