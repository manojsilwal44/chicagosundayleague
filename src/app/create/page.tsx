"use client";
import * as React from "react";
import NavBar from "../components/NavBar";
import {
  Container,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [gameType, setGameType] = React.useState<"SOCCER" | "CRICKET">("SOCCER");
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [maxPlayers, setMaxPlayers] = React.useState<number>(22);
  const [costPerPlayer, setCostPerPlayer] = React.useState<number>(0);
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          gameType,
          startTime: startTime?.toISOString(),
          maxPlayers,
          costPerPlayer,
          description,
        }),
      });
      if (!res.ok) throw new Error("Failed to create event");
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Create Game</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2, maxWidth: 600 }}>
          <ToggleButtonGroup value={gameType} exclusive onChange={(_e, v) => v && setGameType(v)}>
            <ToggleButton value="SOCCER">Soccer</ToggleButton>
            <ToggleButton value="CRICKET">Cricket</ToggleButton>
          </ToggleButtonGroup>
          <TextField label="Event Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <TextField label="Location" value={location} onChange={e => setLocation(e.target.value)} required />
          <DateTimePicker label="Date & Time" value={startTime} onChange={setStartTime} />
          <TextField label="Maximum Players" type="number" value={maxPlayers} onChange={e => setMaxPlayers(parseInt(e.target.value || "0", 10))} inputProps={{ min: 1 }} />
          <TextField label="Cost Per Player" type="number" value={costPerPlayer} onChange={e => setCostPerPlayer(parseFloat(e.target.value || "0"))} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
          <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} multiline rows={4} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" disabled={loading}>Create</Button>
        </Box>
      </Container>
    </>
  );
}


