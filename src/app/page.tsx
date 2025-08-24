"use client";
import * as React from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Box, Card, CardContent, CardActions, Typography, Button, Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SportsIcon from "@mui/icons-material/Sports";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
 

type EventDto = {
  id: string;
  title: string;
  location: string;
  gameType: "SOCCER" | "CRICKET" | "COOKING" | "TECH" | "WELLNESS";
  startTime: string;
  maxPlayers: number;
  participants: { id: string }[];
  host?: string; // Added host field
  price?: string; // Added price field
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

  // Use placeholder events when no events are fetched
  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <>
      <NavBar />
      <Box sx={{ pb: 4 }}>
        <Paper elevation={6} sx={{ overflow: 'hidden' }}>
          <Box sx={{ position: "relative", width: "100%", height: { xs: 240, md: 360 }, overflow: "hidden" }}>
            <Box 
              component="img" 
              src={getHeroImage()} 
              alt="hero" 
              sx={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                filter: "brightness(0.65)",
                backgroundColor: "#fff"
              }} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <Box 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                backgroundColor: "#fff",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                fontSize: "1.5rem",
                fontWeight: 500
              }}
            >
              Hero Image
            </Box>
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

      {/* Explore Categories Section */}
      <Box sx={{ px: { xs: 3, sm: 4, md: 6 }, py: 6, bgcolor: '#fff' }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
          Explore top categories
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr", lg: "repeat(6, 1fr)" }, gap: 2 }}>
          {/* Cricket */}
          <Box 
            sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              p: 2, 
              textAlign: 'center', 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ 
              width: 56, 
              height: 56, 
              mx: 'auto', 
              mb: 1.5, 
              bgcolor: 'green.100', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SportsCricketIcon sx={{ fontSize: 40, color: '#16a34a' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Cricket
            </Typography>
          </Box>

          {/* Soccer */}
          <Box 
            sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              p: 2, 
              textAlign: 'center', 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ 
              width: 56, 
              height: 56, 
              mx: 'auto', 
              mb: 1.5, 
              bgcolor: 'blue.100', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SportsSoccerIcon sx={{ fontSize: 40, color: '#2563eb' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Soccer
            </Typography>
          </Box>

          {/* Pickleball */}
          <Box 
            sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              p: 2, 
              textAlign: 'center', 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ 
              width: 56, 
              height: 56, 
              mx: 'auto', 
              mb: 1.5, 
              bgcolor: 'purple.100', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SportsIcon sx={{ fontSize: 40, color: '#9333ea' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Pickleball
            </Typography>
          </Box>

          {/* Tennis */}
          <Box 
            sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              p: 2, 
              textAlign: 'center', 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ 
              width: 56, 
              height: 56, 
              mx: 'auto', 
              mb: 1.5, 
              bgcolor: 'orange.100', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SportsTennisIcon sx={{ fontSize: 40, color: '#ea580c' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Tennis
            </Typography>
          </Box>

          {/* Volleyball */}
          <Box 
            sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              p: 2, 
              textAlign: 'center', 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ 
              width: 56, 
              height: 56, 
              mx: 'auto', 
              mb: 1.5, 
              bgcolor: 'teal.100', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SportsVolleyballIcon sx={{ fontSize: 40, color: '#0d9488' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Volleyball
            </Typography>
          </Box>

          {/* Video Games */}
          <Box 
            sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              p: 2, 
              textAlign: 'center', 
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ 
              width: 56, 
              height: 56, 
              mx: 'auto', 
              mb: 1.5, 
              bgcolor: 'red.100', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SportsEsportsIcon sx={{ fontSize: 40, color: '#dc2626' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Video Games
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 3, sm: 4, md: 6 }, py: 6, bgcolor: '#fff' }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
          {displayEvents.map(ev => (
            <Card key={ev.id} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box
                sx={{
                  height: 200,
                  bgcolor: "grey.200",
                  backgroundImage: `url(${getEventImage(ev.title)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {ev.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5, fontWeight: 600 }}>
                  Hosted by: {ev.host || 'Event Organizer'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {new Date(ev.startTime).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      }).toUpperCase()} · {new Date(ev.startTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })} CDT
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {ev.participants.length} going
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ConfirmationNumberIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'success.main' }}>
                      {ev.price || 'Free'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                <Button 
                  variant="contained" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Join
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
      <Footer />
    </>
  );
}

function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return "TBD";
  }
}

function getEventImage(title: string): string {
  const images = {
    "Outdoor Dinner at Johnny's Kitchen & Tap in Glenview": "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "Tech Conference 2025": "https://images.pexels.com/photos/1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
    "Tech Retreat Weekend": "https://images.pexels.com/photos/1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80",
    "Yoga Retreat": "https://images.pexels.com/photos/1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80"
  };
  
  return images[title as keyof typeof images] || "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
}

function getHeroImage(): string {
  const heroImages = [
    // Outdoor festival/concert crowd
    "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    // People at outdoor event
    "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    // Concert crowd with lights
    "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    // Outdoor gathering
    "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
  ];
  
  // Use a fixed image for consistency, but you can change this index to try different images
  return heroImages[0]; // Using the first image for consistency
}

const defaultEvents: EventDto[] = [
  {
    id: "1",
    title: "Outdoor Dinner at Johnny's Kitchen & Tap in Glenview",
    location: "Glenview, IL",
    gameType: "COOKING",
    startTime: "2025-08-26T18:00:00Z",
    maxPlayers: 50,
    participants: Array.from({ length: 30 }, (_, i) => ({ id: `p${i}` })),
    host: "NW Suburban Fun Club for Singles over 50",
    price: "Free",
  },
  {
    id: "2",
    title: "Tech Conference 2025",
    location: "Chicago, IL",
    gameType: "TECH",
    startTime: "2025-01-16T09:00:00Z",
    maxPlayers: 200,
    participants: Array.from({ length: 45 }, (_, i) => ({ id: `p${i}` })),
    host: "Chicago Tech Meetup",
    price: "$50",
  },
  {
    id: "3",
    title: "Tech Retreat Weekend",
    location: "Lake Geneva, WI",
    gameType: "TECH",
    startTime: "2025-01-17T10:00:00Z",
    maxPlayers: 100,
    participants: Array.from({ length: 28 }, (_, i) => ({ id: `p${i}` })),
    host: "Midwest Developers Association",
    price: "$100",
  },
  {
    id: "4",
    title: "Yoga Retreat",
    location: "Milwaukee, WI",
    gameType: "WELLNESS",
    startTime: "2025-01-18T08:00:00Z",
    maxPlayers: 30,
    participants: Array.from({ length: 15 }, (_, i) => ({ id: `p${i}` })),
    host: "Mindful Living Center",
    price: "Free",
  },
];
