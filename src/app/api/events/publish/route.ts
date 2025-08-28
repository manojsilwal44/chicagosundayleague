import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EventService } from "@/lib/eventService";
import { Prisma } from "@/generated/prisma";

const publishEventSchema = z.object({
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Received request body:', body);
    
    const parsed = publishEventSchema.safeParse(body);
    
    if (!parsed.success) {
      console.error('Validation error:', parsed.error.flatten());
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const eventData = parsed.data;
    console.log('Parsed event data:', eventData);
    
    // Use real EventService for production
    const event = await EventService.createEvent({
      ...eventData,
      startTime: new Date(eventData.startTime),
      endTime: eventData.endTime ? new Date(eventData.endTime) : undefined,
      costPerPerson: eventData.costPerPerson || 0,
      isFree: !eventData.costPerPerson || eventData.costPerPerson === 0,
      status: "PUBLISHED",
      customFields: eventData.customFields as Prisma.InputJsonValue | undefined,
    });

    console.log('Event created successfully:', event);

    return NextResponse.json({
      message: "Event published successfully",
      event
    }, { status: 201 });

  } catch (error) {
    console.error("Error publishing event:", error);
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: "Failed to publish event",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
