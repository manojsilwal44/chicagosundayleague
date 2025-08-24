import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
  maxParticipants: z.number().int().min(1),
  minParticipants: z.number().int().min(1).optional(),
  costPerPerson: z.number().min(0).optional(),
  isFree: z.boolean().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  
  // Event-specific details
  sportType: z.string().optional(),
  skillLevel: z.string().optional(),
  equipment: z.string().optional(),
  rules: z.string().optional(),
  format: z.string().optional(),
  duration: z.number().int().min(1).optional(),
  materials: z.string().optional(),
  intensity: z.string().optional(),
  ageGroup: z.string().optional(),
  customFields: z.any().optional(),
});

export async function GET(req: NextRequest) {
  try {
    // For development without database, return mock data
    const mockEvents = [
      {
        id: "1",
        title: "Summer Soccer Tournament",
        summary: "Join us for an exciting summer soccer tournament!",
        eventType: "SOCCER",
        status: "PUBLISHED",
        startTime: new Date("2025-06-15T10:00:00Z"),
        location: "Central Park, Chicago",
        maxParticipants: 22,
        isFree: true,
        organizer: {
          profile: {
            firstName: "John",
            lastName: "Doe"
          }
        },
        _count: {
          participants: 15,
          reviews: 3
        }
      },
      {
        id: "2",
        title: "Cricket Championship",
        summary: "Annual cricket championship for all skill levels",
        eventType: "CRICKET",
        status: "PUBLISHED",
        startTime: new Date("2025-06-20T14:00:00Z"),
        location: "Lincoln Park, Chicago",
        maxParticipants: 30,
        isFree: false,
        organizer: {
          profile: {
            firstName: "Jane",
            lastName: "Smith"
          }
        },
        _count: {
          participants: 25,
          reviews: 5
        }
      }
    ];

    return NextResponse.json({
      events: mockEvents,
      total: mockEvents.length,
      hasMore: false,
      page: 1,
      totalPages: 1
    });
  } catch (err) {
    console.error("GET /api/events failed", err);
    return NextResponse.json({ events: [], total: 0, hasMore: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // For now, we'll accept organizerId in the request body
    // In a production app, this should be validated via JWT or session
    if (!body.organizerId) {
      return NextResponse.json({ error: "Unauthorized - organizerId required" }, { status: 401 });
    }

    const parsed = createEventSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    
    // For development without database, return mock success response
    const mockCreatedEvent = {
      id: "mock-" + Date.now(),
      title: data.title,
      summary: data.summary,
      eventType: data.eventType,
      status: "DRAFT",
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      location: data.location,
      maxParticipants: data.maxParticipants,
      costPerPerson: data.costPerPerson,
      organizerId: body.organizerId,
      isFree: data.isFree ?? (data.costPerPerson === 0 || !data.costPerPerson),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Mock event created:", mockCreatedEvent);
    return NextResponse.json(mockCreatedEvent, { status: 201 });
  } catch (error) {
    console.error("POST /api/events failed", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}


