import { prisma } from "@/lib/prisma";
import NavBar from "@/app/components/NavBar";
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Avatar, 
  IconButton,
  Grid
} from "@mui/material";
import { notFound } from "next/navigation";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";

// Helper function to get event type colors
function getEventTypeColor(eventType: string) {
  const colors = {
    SOCCER: "#2563eb",
    CRICKET: "#16a34a", 
    TENNIS: "#ea580c",
    VOLLEYBALL: "#0d9488",
    PICKLEBALL: "#9333ea",
    VIDEO_GAMES: "#dc2626",
    COOKING: "#d97706",
    TECH: "#1976d2",
    WELLNESS: "#7c3aed",
    OTHER: "#6b7280"
  };
  return colors[eventType as keyof typeof colors] || colors.OTHER;
}

// Helper function to get event images by type
function getEventImage(eventType: string): string {
  const typeImages = {
    "SOCCER": "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "CRICKET": "https://images.pexels.com/photos/163452/cricket-ball-cricket-ball-163452.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "TENNIS": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "VOLLEYBALL": "https://images.pexels.com/photos/1666927/pexels-photo-1666927.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "PICKLEBALL": "https://images.pexels.com/photos/17806/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "VIDEO_GAMES": "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "COOKING": "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "TECH": "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "WELLNESS": "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    "OTHER": "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"
  };
  
  return typeImages[eventType as keyof typeof typeImages] || typeImages.OTHER;
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { 
      participants: {
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      }, 
      organizer: {
        include: {
          profile: true
        }
      } 
    },
  });

  if (!event) return notFound();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const spotsLeft = event.maxParticipants - event.participants.length;
  const organizerName = event.organizer.profile 
    ? `${event.organizer.profile.firstName} ${event.organizer.profile.lastName}`
    : 'Event Organizer';

  return (
    <>
      <NavBar />
      
      {/* Hero Image Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 400 },
          backgroundImage: `url(${getEventImage(event.eventType)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Action Buttons */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1
          }}
        >
          <IconButton 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <ShareIcon />
          </IconButton>
          <IconButton 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Event Header Information */}
      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          {/* Event Title */}
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
              color: 'text.primary'
            }}
          >
            {event.title}
          </Typography>

          {/* Location and Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {event.location}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              |
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {formatDate(new Date(event.startTime))}
              </Typography>
            </Box>
          </Box>

          {/* Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {formatTime(new Date(event.startTime))}
            </Typography>
          </Box>

          {/* Organizer */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Organized by: <strong>{organizerName}</strong>
              </Typography>
            </Box>
          </Box>

          {/* Event Type and Free Chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
            <Chip 
              label={event.eventType}
              sx={{ 
                bgcolor: getEventTypeColor(event.eventType),
                color: 'white',
                fontWeight: 600
              }}
            />
            {event.isFree && (
              <Chip 
                label="FREE"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>

        {/* Join Event Section */}
        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Button 
            variant="outlined"
            size="large"
            disabled={spotsLeft === 0}
            sx={{ 
              py: 2,
              px: 6,
              fontSize: '1rem',
              fontWeight: 500,
              borderRadius: 8,
              borderColor: '#000000',
              color: '#000000',
              textTransform: 'none',
              minWidth: 200,
              '&:hover, &:focus': {
                borderColor: '#000000',
                bgcolor: '#000000',
                color: '#ffffff'
              },
              '&:disabled': {
                borderColor: '#cccccc',
                color: '#888888'
              }
            }}
          >
            {spotsLeft > 0 ? 'Join' : 'Event Full'}
          </Button>
        </Box>

        {/* Event Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Event Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CalendarTodayIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(new Date(event.startTime))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(new Date(event.startTime))} - {event.endTime ? formatTime(new Date(event.endTime)) : 'TBD'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LocationOnIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {event.location}
                  </Typography>
                  {event.address && (
                    <Typography variant="body2" color="text.secondary">
                      {event.address}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <PeopleIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Participants
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {event.participants.length} / {event.maxParticipants} joined
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {spotsLeft} spots left
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AttachMoneyIcon sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cost
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {event.isFree ? 'Free' : `$${event.costPerPerson}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per person
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* About This Event Section - Moved to Bottom */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          About this event
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.7,
            color: 'text.secondary',
            fontSize: '1.1rem'
          }}
        >
          {event.description || 'Join us for an amazing experience! This event promises to be fun and engaging for participants of all skill levels.'}
        </Typography>
      </Container>

      {/* Attendees Section */}
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Attendees ({event.participants.length + 1})
          </Typography>
          {event.participants.length > 2 && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'primary.main', 
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              See all
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Host */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    mx: 'auto'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Chip 
                  label="Host"
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: '#8B7355',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {organizerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Event Organizer
              </Typography>
            </Box>
          </Grid>

          {/* Participants */}
          {event.participants.slice(0, 5).map((participant: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={participant.id}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'secondary.main',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {participant.user?.profile?.firstName ? 
                    participant.user.profile.firstName.charAt(0).toUpperCase() : 
                    <PersonIcon sx={{ fontSize: 40 }} />
                  }
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {participant.user?.profile?.firstName || `Participant ${index + 1}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attendee
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}


