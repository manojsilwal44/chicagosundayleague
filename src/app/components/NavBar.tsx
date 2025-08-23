"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import NextLink from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import MuiLink from "@mui/material/Link";

export default function NavBar() {
  const { data: session } = useSession();
  const linkSx = { color: "text.primary", textDecoration: "none", px: 1, py: 0.75, borderRadius: 1, fontSize: 14 } as const;
  return (
    <AppBar position="sticky" elevation={0} color="transparent" sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fff" }}>
      <Toolbar sx={{ gap: 2, minHeight: 64 }}>
        <Typography variant="h6" sx={{ color: "#111827", fontWeight: 800 }}>
          <NextLink href="/" style={{ color: "inherit", textDecoration: "none" }}>PlayOn</NextLink>
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <MuiLink component={NextLink} href="/" underline="none" sx={linkSx}>Home</MuiLink>
          <MuiLink component={NextLink} href="/" underline="none" sx={linkSx}>Explore</MuiLink>
          <MuiLink component={NextLink} href="/create" underline="none" sx={linkSx}>Create Event</MuiLink>
        </Box>

        <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
          {session ? (
            <>
              <Button color="inherit" component={NextLink} href="/profile" sx={{ textTransform: "none" }}>Profile</Button>
              <Button color="inherit" onClick={() => signOut()} sx={{ textTransform: "none" }}>Log Out</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => signIn()} sx={{ textTransform: "none" }}>Login</Button>
              <Button variant="contained" component={NextLink} href="/auth/register" sx={{ textTransform: "none", borderRadius: 2 }}>Sign Up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}


