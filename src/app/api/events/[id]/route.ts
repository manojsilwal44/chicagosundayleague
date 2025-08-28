import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EventService } from "@/lib/eventService";
import { Prisma } from "@/generated/prisma";

const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  summary: z.string().max(140).optional(),
  description: z.string().optional(),
  eventType: z.enum(["SOCCER", "CRICKET", "TENNIS", "VOLLEYBALL", "PICKLEBALL", "VIDEO_GAMES", "COOKING", "TECH", "WELLNESS", "OTHER"]).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  timezone: z.string().optional(),
  location: z.string().min(2).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  isOnline: z.boolean().optional(),
  onlineUrl: z.string().optional(),
  maxParticipants: z.number().min(1).optional(),
  costPerPerson: z.number().min(0).optional(),
  coverImage: z.string().optional(),
  organizerId: z.string(),
  customFields: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Use real EventService for production
    const event = await EventService.getEventById(id);
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const parsed = updateEventSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updateData = parsed.data;
    
    // Use real EventService for production
    const event = await EventService.updateEvent({
      id,
      ...updateData,
      startTime: updateData.startTime ? new Date(updateData.startTime) : undefined,
      endTime: updateData.endTime ? new Date(updateData.endTime) : undefined,
      customFields: updateData.customFields as Prisma.InputJsonValue | undefined,
    });

    return NextResponse.json({
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Use real EventService for production
    await EventService.deleteEvent(id);

    return NextResponse.json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
