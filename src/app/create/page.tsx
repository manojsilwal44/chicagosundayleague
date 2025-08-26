"use client";
import * as React from "react";
import NavBar from "../components/NavBar";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [eventType, setEventType] = React.useState<string>("");
  const [location, setLocation] = React.useState("");
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [maxPlayers, setMaxPlayers] = React.useState<number>(22);
  const [costPerPlayer, setCostPerPlayer] = React.useState<number>(0);
  const [description, setDescription] = React.useState("");
  const [coverImage, setCoverImage] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<{id: string; email: string; firstName: string; lastName: string} | null>(null);

  // Get user data from localStorage on component mount
  React.useEffect(() => {
    const storedUserData = localStorage.getItem("playonUserData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if user is authenticated
    if (!userData?.id) {
      setError("Please sign in to create an event");
      setLoading(false);
      return;
    }

    // Basic validation
    if (!title.trim() || !eventType || !location.trim() || !startTime) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        title: title.trim(),
        summary: summary.trim() || undefined,
        eventType,
        location: location.trim(),
        startTime: startTime?.toISOString(),
        maxParticipants: maxPlayers,
        costPerPerson: costPerPlayer > 0 ? costPerPlayer : undefined,
        description: description.trim() || undefined,
        coverImage: coverImage ? coverImage.name : undefined,
        organizerId: userData.id,
        isFree: costPerPlayer === 0,
      };

      console.log("Publishing event with data:", eventData);

      const res = await fetch("/api/events/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to publish event");
      }
      
      const result = await res.json();
      console.log("Event published successfully:", result);
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setError(null);
    setLoading(true);

    // Check if user is authenticated
    if (!userData?.id) {
      setError("Please sign in to save an event");
      setLoading(false);
      return;
    }

    // Basic validation for draft (can be less strict)
    if (!title.trim()) {
      setError("Please provide at least a title for the draft");
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        title: title.trim(),
        summary: summary.trim() || undefined,
        eventType: eventType || undefined,
        location: location.trim() || undefined,
        startTime: startTime?.toISOString(),
        maxParticipants: maxPlayers,
        costPerPerson: costPerPlayer > 0 ? costPerPlayer : undefined,
        description: description.trim() || undefined,
        coverImage: coverImage ? coverImage.name : undefined,
        organizerId: userData.id,
        isFree: costPerPlayer === 0,
      };

      console.log("Saving draft with data:", eventData);

      const res = await fetch("/api/events/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save event as draft");
      }
      
      const result = await res.json();
      console.log("Event saved as draft successfully:", result);
      // Optionally redirect to profile page or show success message
      router.push("/profile");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: "#1976d2", 
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            Create Your Event
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "text.secondary",
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto"
            }}
          >
            Bring your vision to life. Fill in the details below.
          </Typography>
        </Box>

        {!userData ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "text.secondary" }}>
              Please Sign In
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              You need to be signed in to create an event.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={() => router.push("/")}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 4,
                  py: 1.5,
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: "#1565c0",
                    backgroundColor: "rgba(25, 118, 210, 0.04)"
                  }
                }}
              >
                Go to Home Page
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  // Store the current page to redirect back after login
                  localStorage.setItem("redirectAfterLogin", "/create");
                  router.push("/");
                }}
                sx={{
                  bgcolor: "#1976d2",
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 4,
                  py: 1.5,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#1565c0"
                  }
                }}
              >
                Sign In / Sign Up
              </Button>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={onSubmit}>
          {/* Top Row - Date & Time and Location */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Date & Time *
              </Typography>
              <DateTimePicker 
                value={startTime} 
                onChange={setStartTime}
                sx={{ width: "100%" }}
                slotProps={{
                  textField: {
                    placeholder: "mm/dd/yyyy, --:-- --",
                    InputProps: {
                      endAdornment: <CalendarTodayIcon sx={{ color: "text.secondary", mr: 1 }} />
                    }
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Location *
              </Typography>
              <TextField
                fullWidth
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., Online or City, State"
                required
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ color: "text.secondary", mr: 1 }} />
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }
                }}
              />
            </Box>
          </Box>

          {/* Cover Image Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
              Cover Image
            </Typography>
            <Paper
              sx={{
                border: "2px dashed #e0e0e0",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                backgroundColor: "#fafafa",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#1976d2",
                  backgroundColor: "#f0f8ff"
                }
              }}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <CloudUploadIcon sx={{ fontSize: 64, color: "#9e9e9e", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, color: "text.secondary" }}>
                Upload a file or drag and drop
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                PNG, JPG, GIF up to 10MB
              </Typography>
              {coverImage && (
                <Typography variant="body2" sx={{ color: "success.main", fontWeight: 500 }}>
                  ✓ {coverImage.name} uploaded
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Event Details Section */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Event Title *
              </Typography>
              <TextField
                fullWidth
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Summer Tech Conference 2025"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Event Type *
              </Typography>
              <FormControl fullWidth required>
                <Select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }}
                >
                  <MenuItem value="" disabled>
                    Select event type
                  </MenuItem>
                  <MenuItem value="SOCCER">Soccer</MenuItem>
                  <MenuItem value="CRICKET">Cricket</MenuItem>
                  <MenuItem value="TENNIS">Tennis</MenuItem>
                  <MenuItem value="VOLLEYBALL">Volleyball</MenuItem>
                  <MenuItem value="PICKLEBALL">Pickleball</MenuItem>
                  <MenuItem value="VIDEO_GAMES">Video Games</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Summary Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                Summary *
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {summary.length}/140
              </Typography>
            </Box>
            <TextField
              fullWidth
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="A short, catchy description of your event."
              multiline
              rows={3}
              required
              inputProps={{ maxLength: 140 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1
                }
              }}
            />
          </Box>

          {/* Additional Fields */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Maximum Players
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={maxPlayers}
                onChange={e => setMaxPlayers(parseInt(e.target.value || "0", 10))}
                inputProps={{ min: 1 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Cost Per Player
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={costPerPlayer}
                onChange={e => setCostPerPlayer(parseFloat(e.target.value || "0"))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }
                }}
              />
            </Box>
          </Box>

          {/* Description Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
              Description
            </Typography>
            <TextField
              fullWidth
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide detailed information about your event..."
              multiline
              rows={4}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1
                }
              }}
            />
          </Box>

          {/* Error Display */}
          {error && (
            <Typography color="error" sx={{ mb: 3, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="text"
              onClick={handleSaveAsDraft}
              disabled={loading}
              type="button"
              sx={{ 
                color: "text.secondary",
                textTransform: "none",
                fontSize: "1rem"
              }}
            >
              {loading ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#1976d2",
                textTransform: "none",
                fontSize: "1rem",
                px: 4,
                py: 1.5,
                borderRadius: 1
              }}
            >
              {loading ? "Publishing..." : "Publish Event"}
            </Button>
          </Box>
        </Box>
        )}
      </Container>
    </>
  );
}


