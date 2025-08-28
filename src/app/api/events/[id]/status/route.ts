import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EventService } from "@/lib/eventService";
import { Prisma } from "@/generated/prisma";

const changeStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED", "ARCHIVED"]),
  reason: z.string().optional(), // Optional reason for status change
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const parsed = changeStatusSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { status, reason } = parsed.data;
    
    // Use real EventService for production
    const event = await EventService.updateEvent({
      id,
      status,
      // Add reason to customFields if provided
      customFields: reason ? { statusChangeReason: reason } as Prisma.InputJsonValue : undefined,
    });

    return NextResponse.json({
      message: "Event status updated successfully",
      event
    });
  } catch (error) {
    console.error("Error updating event status:", error);
    return NextResponse.json(
      { error: "Failed to update event status" },
      { status: 500 }
    );
  }
}
