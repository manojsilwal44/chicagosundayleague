import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EventService } from "@/lib/eventService";
import { EventType, EventStatus } from "@/generated/prisma";
import { Prisma } from "@/generated/prisma";

const createEventSchema = z.object({
  title: z.string().min(3),
  summary: z.string().max(140).optional(),
  description: z.string().optional(),
  eventType: z.enum(["SOCCER", "CRICKET", "TENNIS", "VOLLEYBALL", "PICKLEBALL", "VIDEO_GAMES", "COOKING", "TECH", "WELLNESS", "OTHER"]),
  startTime: z.string(),
  endTime: z.string().optional(),
  timezone: z.string().optional(),
  location: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  isOnline: z.boolean().optional(),
  onlineUrl: z.string().optional(),
  maxParticipants: z.number().min(1),
  costPerPerson: z.number().min(0).optional(),
  coverImage: z.string().optional(),
  organizerId: z.string(),
  customFields: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const eventType = searchParams.get("eventType") as EventType | null;
    const status = searchParams.get("status") as EventStatus | null;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    // Use real EventService for production
    const events = await EventService.getEvents({
      eventType: eventType || undefined,
      status: status || undefined,
      limit,
      offset,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const parsed = createEventSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const eventData = parsed.data;
    
    // Use real EventService for production
    const event = await EventService.createEvent({
      ...eventData,
      startTime: new Date(eventData.startTime),
      endTime: eventData.endTime ? new Date(eventData.endTime) : undefined,
      costPerPerson: eventData.costPerPerson || 0,
      isFree: !eventData.costPerPerson || eventData.costPerPerson === 0,
      customFields: eventData.customFields as Prisma.InputJsonValue | undefined,
    });

    return NextResponse.json({
      message: "Event created successfully",
      event
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}


