import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NavBar from "../components/NavBar";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const events = userId
    ? await prisma.event.findMany({ where: { organizerId: userId }, orderBy: { startTime: "desc" } })
    : [];
  return (
    <>
      <NavBar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>My Profile</Typography>
        {!userId ? (
          <Typography>Please sign in to view your profile.</Typography>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>My Created Events</Typography>
            <List>
              {events.map((e: { id: string; title: string; eventType: string; startTime: Date | string }) => (
                <ListItem key={e.id} component={Link} href={`/events/${e.id}`}>
                  <ListItemText primary={e.title} secondary={`${e.eventType} • ${new Date(e.startTime).toLocaleString()}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Container>
    </>
  );
}


