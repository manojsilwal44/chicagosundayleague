import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, $Enums } from "@/generated/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  location: z.string().min(2),
  gameType: z.enum(["SOCCER", "CRICKET"]),
  startTime: z.string(),
  maxPlayers: z.number().int().min(1),
  costPerPlayer: z.number().min(0),
});

export async function GET(req: NextRequest) {
  try {
    // Check if database is available
    try {
      await prisma.$connect();
    } catch (dbError) {
      console.warn("Database not available, returning empty results:", dbError);
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const gameType = searchParams.get("gameType") as "SOCCER" | "CRICKET" | null;

    const where: Prisma.EventWhereInput = {} as Prisma.EventWhereInput;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }
    if (from || to) {
      const dateFilter: Prisma.DateTimeFilter = {} as Prisma.DateTimeFilter;
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.startTime = dateFilter;
    }
    if (gameType) where.gameType = gameType as $Enums.GameType;

    const events = await prisma.event.findMany({
      where,
      include: { participants: true, organizer: true },
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error("GET /api/events failed", err);
    // Return empty array instead of error to prevent 500
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const created = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      gameType: data.gameType as $Enums.GameType,
      startTime: new Date(data.startTime),
      maxPlayers: data.maxPlayers,
      costPerPlayer: data.costPerPlayer,
      organizerId: session.user.id,
    },
  });
  return NextResponse.json(created, { status: 201 });
}


