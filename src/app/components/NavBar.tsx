"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NextLink from "next/link";
// Removed next-auth imports since we're using custom authentication
import MuiLink from "@mui/material/Link";
import StarIcon from "@mui/icons-material/Star";
import SignupModal from "./SignupModal";
import SessionWarningModal from "./SessionWarningModal";
import { useSessionManager } from "../../hooks/useSessionManager";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function NavBar() {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"signup" | "login">("signup");
  const [userData, setUserData] = React.useState<UserData | null>(null);
  
  const linkSx = { 
    color: "text.primary", 
    textDecoration: "none", 
    px: 2, 
    py: 1.5, 
    borderRadius: 1, 
    fontSize: 16,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)"
    }
  } as const;
  
  const handleOpenAuthModal = () => {
    setAuthMode("login"); // Always start with login
    setAuthModalOpen(true);
  };
  
  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleSwitchAuthMode = (newMode: "login" | "signup") => {
    setAuthMode(newMode);
  };

  const handleSignupSuccess = (userData: UserData) => {
    setUserData(userData);
    // Store user data in localStorage for persistence
    localStorage.setItem("playonUserData", JSON.stringify(userData));
    
    // Check if there's a redirect after login
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectPath;
    }
  };

  const handleLoginSuccess = (userData: UserData) => {
    setUserData(userData);
    // Store user data in localStorage for persistence
    localStorage.setItem("playonUserData", JSON.stringify(userData));
    
    // Check if there's a redirect after login
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectPath;
    }
  };

  // Load user data from localStorage on component mount
  React.useEffect(() => {
    const storedUserData = localStorage.getItem("playonUserData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem("playonUserData");
  };

  // Session management
  const { isWarningShown, timeRemaining, extendSession, logout: sessionLogout } = useSessionManager({
    sessionTimeout: 15 * 60 * 1000, // 15 minutes
    warningTimeout: 60 * 1000, // 60 seconds
    onSessionExpired: () => {
      setUserData(null);
      localStorage.removeItem("playonUserData");
    },
    onShowWarning: () => {
      // Warning modal will be shown automatically
    }
  });

  const handleExtendSession = () => {
    extendSession();
  };

  const handleSessionLogout = () => {
    sessionLogout();
  };
  
  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        color="transparent" 
        sx={{ 
          borderBottom: 1, 
          borderColor: "divider", 
          bgcolor: "#fff",
          zIndex: 1100,
          top: 0,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          transition: "box-shadow 0.3s ease, background-color 0.3s ease",
          "&.MuiAppBar-sticky": {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "rgba(255, 255, 255, 0.98)"
          }
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon sx={{ color: "#111827", fontSize: 28 }} />
            <Typography variant="h6" sx={{ color: "#111827", fontWeight: 800 }}>
              <NextLink href="/" style={{ color: "inherit", textDecoration: "none" }}>PlayOn</NextLink>
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <MuiLink component={NextLink} href="/" underline="none" sx={linkSx}>Home</MuiLink>
            <MuiLink component={NextLink} href="/" underline="none" sx={linkSx}>Explore</MuiLink>
            <MuiLink component={NextLink} href="/create" underline="none" sx={linkSx}>Create Event</MuiLink>
          </Box>

          <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
            {userData ? (
              <>
                <Button color="inherit" component={NextLink} href="/profile" sx={{ textTransform: "none", fontSize: 16, fontWeight: 500 }}>Profile</Button>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.2s ease",
                    },
                  }}
                  onClick={() => {
                    // Could show a user menu here
                    console.log("User avatar clicked");
                  }}
                >
                  {userData.firstName.charAt(0).toUpperCase()}
                </Box>
                <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "none", fontSize: 16, fontWeight: 500 }}>Log Out</Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleOpenAuthModal} 
                sx={{ 
                  textTransform: "none", 
                  fontSize: 16,
                  fontWeight: 500,
                  borderRadius: 3,
                  bgcolor: "#1a1a1a",
                  color: "#ffffff",
                  px: 2,
                  py: 1,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#2a2a2a",
                    boxShadow: "none"
                  },
                  "&:active": {
                    bgcolor: "#0a0a0a"
                  }
                }}
              >
                Login / Sign Up
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Render modal outside of AppBar to prevent z-index issues */}
      <SignupModal 
        open={authModalOpen} 
        onClose={handleCloseAuthModal} 
        onSignupSuccess={handleSignupSuccess} 
        onLoginSuccess={handleLoginSuccess} 
        mode={authMode} 
        onSwitchMode={handleSwitchAuthMode}
      />
      
      <SessionWarningModal
        open={isWarningShown && !!userData}
        timeRemaining={timeRemaining}
        onExtendSession={handleExtendSession}
        onLogout={handleSessionLogout}
      />
    </>
  );
}


