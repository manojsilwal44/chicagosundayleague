"use client";

import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Event {
  id: string;
  title: string;
  eventType: string;
  startTime: Date | string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem("playonUserData");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      // For now, we'll use mock data since we don't have a real database connection
      setEvents([
        { id: "1", title: "Sample Event", eventType: "SOCCER", startTime: new Date() }
      ]);
    }
    setLoading(false);
  }, []);
  if (loading) {
    return (
      <>
        <NavBar />
        <Container sx={{ py: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>My Profile</Typography>
        {!userData ? (
          <Typography>Please sign in to view your profile.</Typography>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>My Created Events</Typography>
            <List>
              {events.map((e: Event) => (
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


