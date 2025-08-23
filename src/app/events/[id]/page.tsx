import { prisma } from "@/lib/prisma";
import NavBar from "@/app/components/NavBar";
import { Container, Typography, Box, Button } from "@mui/material";
import { notFound } from "next/navigation";

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { participants: true, organizer: true },
  });
  if (!event) return notFound();
  return (
    <>
      <NavBar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>{event.title}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{event.description}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {event.gameType} • {new Date(event.startTime).toLocaleString()} • {event.location}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Players: {event.participants.length} / {event.maxPlayers} • Cost: ${event.costPerPlayer.toString()}
        </Typography>
        <Box>
          <form action={`/api/events/${event.id}/join`} method="post">
            <Button type="submit" variant="contained">Join Game</Button>
          </form>
        </Box>
      </Container>
    </>
  );
}


