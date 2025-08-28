"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Alert,
  Snackbar,
  Divider,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  mode: "signup" | "login";
  onSignupSuccess: (userData: UserData) => void;
  onLoginSuccess: (userData: UserData) => void;
  onSwitchMode: (mode: "signup" | "login") => void;
}

export default function SignupModal({ open, onClose, mode, onSignupSuccess, onLoginSuccess, onSwitchMode }: SignupModalProps) {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleModeSwitch = (newMode: "login" | "signup") => {
    // Clear form data and errors when switching modes
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    onSwitchMode(newMode);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (mode === "signup") {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (mode === "login") {
      if (!formData.password) newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isSignup) {
        // Handle signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Signup failed');
        }

        const result = await response.json();
        
        // Call the success callback with user data
        onSignupSuccess({
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
        });
      } else {
        // Handle login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }

        const result = await response.json();
        
        // Call the success callback with user data
        onLoginSuccess({
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
        });
      }

      setShowSuccess(true);
      
      // Close modal after showing success
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      }, 2000);

    } catch (error: unknown) {
      console.error('Authentication error:', error);
      // Show error in the UI (you can add error state handling here)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignup = mode === "signup";
  const title = isSignup ? "Sign up" : "Login";
  const continueText = isSignup ? "Continue" : "Login";
  const successMessage = isSignup ? "Account created successfully! Welcome to PlayOn!" : "Login successful! Welcome back!";

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            mx: 2,
          },
        }}
        sx={{
          "& .MuiDialog-paper": {
            margin: "16px",
          },
        }}
      >
        <DialogTitle sx={{ pb: 2, position: "relative", px: 3, pt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            {/* PlayOn logo with star icon */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <StarIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", fontSize: "1.5rem" }}>
              {title}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 4, px: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            {/* Name Fields - Only show for signup */}
            {isSignup && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="First name"
                  placeholder="Your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#9c27b0",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "0.875rem",
                      "&.Mui-focused": {
                        color: "#9c27b0",
                        transform: "translate(14px, -9px) scale(0.75)",
                        backgroundColor: "white",
                        padding: "0 4px",
                        zIndex: 1,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "16.5px 14px",
                      fontSize: "1rem",
                      "&::selection": {
                        backgroundColor: "#000",
                        color: "#fff",
                      },
                      "&::-moz-selection": {
                        backgroundColor: "#000",
                        color: "#fff",
                      },
                    },
                  }}
                />
                <TextField
                  label="Last name"
                  placeholder="Your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "0.875rem",
                      "&.Mui-focused": {
                        color: "#1976d2",
                        transform: "translate(14px, -9px) scale(0.75)",
                        backgroundColor: "white",
                        padding: "0 4px",
                        zIndex: 1,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "16.5px 14px",
                      fontSize: "1rem",
                      "&::selection": {
                        backgroundColor: "#000",
                        color: "#fff",
                      },
                      "&::-moz-selection": {
                        backgroundColor: "#000",
                        color: "#fff",
                      },
                    },
                  }}
                />
              </Box>
            )}

            {/* Email Field */}
            <TextField
              label="Email"
              placeholder="Your email address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "0.875rem",
                  "&.Mui-focused": {
                    color: "#1976d2",
                    transform: "translate(14px, -9px) scale(0.75)",
                    backgroundColor: "white",
                    padding: "0 4px",
                    zIndex: 1,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "16.5px 14px",
                  fontSize: "1rem",
                  "&::selection": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                  "&::-moz-selection": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "0.875rem",
                  "&.Mui-focused": {
                    color: "#1976d2",
                    transform: "translate(14px, -9px) scale(0.75)",
                    backgroundColor: "white",
                    padding: "0 4px",
                    zIndex: 1,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "16.5px 14px",
                  fontSize: "1rem",
                  "&::selection": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                  "&::-moz-selection": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                },
              }}
            />

            {/* Confirm Password Field - Only show for signup */}
            {isSignup && (
              <TextField
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "0.875rem",
                    "&.Mui-focused": {
                      color: "#1976d2",
                      transform: "translate(14px, -9px) scale(0.75)",
                      backgroundColor: "white",
                      padding: "0 4px",
                      zIndex: 1,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "16.5px 14px",
                    fontSize: "1rem",
                    "&::selection": {
                      backgroundColor: "#000",
                      color: "#fff",
                      },
                    "&::-moz-selection": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                  },
                }}
              />
            )}

            {/* Continue/Login Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleContinue}
              disabled={isLoading}
              sx={{
                py: 2,
                bgcolor: "#fff",
                color: "#000",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 1.5,
                mt: 2,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
                "&:disabled": {
                  bgcolor: "#f5f5f5",
                  color: "#999",
                },
              }}
            >
              {isLoading ? (isSignup ? "Creating Account..." : "Logging in...") : continueText}
            </Button>

            {/* Mode Switch Section */}
            <Box sx={{ mt: 3, pt: 3 }}>
              <Divider sx={{ mb: 3, bgcolor: "rgba(0, 0, 0, 0.08)" }} />
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.6)", mb: 1 }}>
                  {isSignup ? "Already have an account?" : "Don't have an account?"}
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => handleModeSwitch(isSignup ? "login" : "signup")}
                  sx={{
                    color: "#1976d2",
                    fontWeight: 600,
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {isSignup ? "Sign in" : "Sign up"}
                </Link>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
