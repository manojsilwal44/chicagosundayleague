"use client";
import * as React from "react";
import NavBar from "@/app/components/NavBar";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error("Registration failed");
      await signIn("credentials", { email, password, callbackUrl: "/" });
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
        <Typography variant="h5" sx={{ mb: 2 }}>Sign Up</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2, maxWidth: 400 }}>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} required />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
          <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} required type="password" />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" disabled={loading}>Create account</Button>
          <Button onClick={() => signIn("google")} variant="outlined">Continue with Google</Button>
          <Button onClick={() => signIn("facebook")} variant="outlined">Continue with Facebook</Button>
        </Box>
      </Container>
    </>
  );
}


