"use client";
import * as React from "react";
import { Box, Typography, Button, Divider, Link } from "@mui/material";
import NextLink from "next/link";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a1a1a",
        color: "white",
        mt: 8,
        pt: 6,
        pb: 4,
      }}
    >
      {/* Call to Action Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create your own PlayOn event.
        </Typography>
        <Button
          variant="outlined"
          component={NextLink}
          href="/create"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Get Started
        </Button>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", mb: 4 }} />

      {/* Main Navigation Links */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 4,
          mb: 4,
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Your Account */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Your Account
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link
              component={NextLink}
              href="/auth/register"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Sign up
            </Link>
            <Link
              component={NextLink}
              href="/auth/login"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Log in
            </Link>
            <Link
              href="#"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Help
            </Link>
          </Box>
        </Box>

        {/* Discover */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Discover
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link
              component={NextLink}
              href="/"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Events
            </Link>
            <Link
              component={NextLink}
              href="/"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Calendar
            </Link>
            <Link
              component={NextLink}
              href="/"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Categories
            </Link>
            <Link
              component={NextLink}
              href="/"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Cities
            </Link>
            <Link
              component={NextLink}
              href="/"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Online Events
            </Link>
          </Box>
        </Box>

        {/* PlayOn */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            PlayOn
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link
              href="#"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              About
            </Link>
            <Link
              href="#"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Blog
            </Link>
            <Link
              href="#"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Careers
            </Link>
            <Link
              href="#"
              sx={{ color: "white", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Apps
            </Link>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", mb: 4 }} />

      {/* Follow Us Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
          px: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Follow us
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link
            href="#"
            sx={{
              color: "white",
              backgroundColor: "#4B5563",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { backgroundColor: "#6B7280" },
            }}
          >
            <FacebookIcon />
          </Link>
          <Link
            href="#"
            sx={{
              color: "white",
              backgroundColor: "#4B5563",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { backgroundColor: "#6B7280" },
            }}
          >
            <TwitterIcon />
          </Link>
          <Link
            href="#"
            sx={{
              color: "white",
              backgroundColor: "#4B5563",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { backgroundColor: "#6B7280" },
            }}
          >
            <YouTubeIcon />
          </Link>
          <Link
            href="#"
            sx={{
              color: "white",
              backgroundColor: "#4B5563",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { backgroundColor: "#6B7280" },
            }}
          >
            <InstagramIcon />
          </Link>
          <Link
            href="#"
            sx={{
              color: "white",
              backgroundColor: "#4B5563",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { backgroundColor: "#6B7280" },
            }}
          >
            <MusicNoteIcon />
          </Link>
        </Box>
      </Box>

      {/* Bottom Legal Links */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          px: { xs: 2, md: 4 },
          pt: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
          © 2025 PlayOn
        </Typography>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Link
            href="#"
            sx={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "0.875rem", "&:hover": { textDecoration: "underline" } }}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            sx={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "0.875rem", "&:hover": { textDecoration: "underline" } }}
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            sx={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "0.875rem", "&:hover": { textDecoration: "underline" } }}
          >
            Cookie Policy
          </Link>
          <Link
            href="#"
            sx={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none", fontSize: "0.875rem", "&:hover": { textDecoration: "underline" } }}
          >
            Help
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
