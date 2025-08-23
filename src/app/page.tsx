"use client";
import * as React from "react";
import NavBar from "./components/NavBar";
import EventSummary from "./components/EventSummary";
import { Box, Container, Card, CardContent, CardActions, Typography, Button, Paper, InputBase, IconButton, CardMedia } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
 

type EventDto = {
  id: string;
  title: string;
  location: string;
  gameType: "SOCCER" | "CRICKET";
  startTime: string;
  maxPlayers: number;
  participants: { id: string }[];
};

export default function Home() {
  const [events, setEvents] = React.useState<EventDto[]>([]);
  const [q, setQ] = React.useState("");
  

  const fetchEvents = React.useCallback(async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    
    const res = await fetch(`/api/events?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) {
      console.error("/api/events returned", res.status);
      setEvents([]);
      return;
    }
    const text = await res.text();
    if (!text) {
      setEvents([]);
      return;
    }
    const data = JSON.parse(text);
    setEvents(Array.isArray(data) ? data : []);
  }, [q]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      <NavBar />
      <Box sx={{ bgcolor: '#f3f4f6', py: 4 }}>
        <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ position: "relative", width: "100%", height: { xs: 240, md: 360 }, overflow: "hidden" }}>
            <Box component="img" src="https://images.unsplash.com/photo-1514517210722-6b38559d5c05?q=80&w=1920&auto=format&fit=crop" alt="hero" sx={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Paper elevation={3} sx={{ display: "flex", alignItems: "center", width: { xs: '90%', sm: 560 }, borderRadius: 999, px: 2 }}>
                <InputBase placeholder="Search for events by name, date, or location." value={q} onChange={(e) => setQ(e.target.value)} sx={{ flex: 1, py: 1.2, color: "#111" }} />
                <IconButton onClick={fetchEvents} sx={{ bgcolor: "#fff", color: "#111", border: 1, borderColor: "divider" }}>
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>

      <EventSummary events={events} />

      <Box sx={{ px: { xs: 2, sm: 3 }, py: 4, bgcolor: '#fff' }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
          {events.map(ev => (
            <Card key={ev.id} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent>
                <Typography variant="h6">{ev.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {ev.gameType} • {new Date(ev.startTime).toLocaleString()} • {ev.location}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Players: {ev.participants.length} / {ev.maxPlayers}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                <Button href={`/events/${ev.id}`} size="small">View</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
}
