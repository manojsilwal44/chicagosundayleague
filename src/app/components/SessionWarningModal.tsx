"use client";
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";

interface SessionWarningModalProps {
  open: boolean;
  timeRemaining: number;
  onExtendSession: () => void;
  onLogout: () => void;
}

export default function SessionWarningModal({
  open,
  timeRemaining,
  onExtendSession,
  onLogout
}: SessionWarningModalProps) {
  const progressValue = (timeRemaining / 60) * 100; // 60 seconds total

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)"
        }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1,
        color: "warning.main",
        pb: 1
      }}>
        <WarningIcon color="warning" />
        Session Expiring Soon
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your session will expire due to inactivity. Please choose an action to continue.
        </Alert>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <AccessTimeIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Time remaining: {timeRemaining} seconds
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={progressValue}
            color="warning"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          After {timeRemaining} seconds, you will be automatically logged out for security.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onLogout}
          color="error"
          sx={{ minWidth: 100 }}
        >
          Logout Now
        </Button>
        <Button
          variant="contained"
          onClick={onExtendSession}
          color="primary"
          sx={{ minWidth: 100 }}
        >
          Keep Session
        </Button>
      </DialogActions>
    </Dialog>
  );
}
