"use client";
import * as React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

type EventItem = {
  id: string;
  title: string;
  location: string;
  startTime: string;
  gameType: string;
  participants: { id: string }[];
  maxPlayers: number;
};

export default function EventSummary({ events }: { events: EventItem[] }) {
  const featured = events.slice(0, 8);
  const items = featured.length > 0 ? featured : defaultPlaceholders;

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: { xs: "80%", sm: "calc(50% - 12px)", md: "calc(25% - 16px)" },
          overflowX: "auto",
          gap: 2,
          pb: 1,
          px: 1,
          scrollSnapType: "x mandatory",
        }}
      >
        {items.map((ev) => (
          <Card key={ev.id} elevation={4} sx={{ borderRadius: 2, overflow: "hidden", scrollSnapAlign: "start" }}>
            <Box
              sx={{
                height: 180,
                bgcolor: "grey.200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              {ev.title}
            </Box>
            <CardContent>
              <Typography variant="h6">{ev.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(ev.startTime).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ev.location}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

const defaultPlaceholders: EventItem[] = [
  {
    id: "ph-1",
    title: "Cooking Class",
    location: "Downtown",
    startTime: "2025-01-15T10:00:00.000Z",
    gameType: "SOCCER",
    participants: [],
    maxPlayers: 20,
  },
  {
    id: "ph-2",
    title: "Tech Conference",
    location: "Riverside",
    startTime: "2025-01-16T14:00:00.000Z",
    gameType: "CRICKET",
    participants: [],
    maxPlayers: 20,
  },
  {
    id: "ph-3",
    title: "Tech Retreat",
    location: "West Park",
    startTime: "2025-01-17T09:00:00.000Z",
    gameType: "SOCCER",
    participants: [],
    maxPlayers: 20,
  },
  {
    id: "ph-4",
    title: "Yoga Retreat",
    location: "Seaside",
    startTime: "2025-01-18T16:00:00.000Z",
    gameType: "CRICKET",
    participants: [],
    maxPlayers: 20,
  },
];


