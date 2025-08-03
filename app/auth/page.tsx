"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  IconButton,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PixelTrail from "@/components/ui/PixelTrail";
export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [termsMd, setTermsMd] = useState<string>("");

  useEffect(() => {
    fetch("/terms_and_conditions.md")
      .then((res) => res.text())
      .then(setTermsMd)
      .catch(() => {});
  }, []);
  const router = useRouter();

  const handleDiscordAuth = async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e4ce48 0%, #fb7442 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      {/* Pixel Trail Background Effect */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <PixelTrail
          gridSize={50}
          trailSize={0.1}
          maxAge={250}
          interpolate={5}
          color="#fff"
          gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
        />
      </Box>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            position: "relative",
            zIndex: 3,
          }}
        >
          {/* Header Row with Back Button and Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              mb: 1,
            }}
          >
            {/* Back Button */}
            <IconButton
              onClick={() => router.push("/")}
              sx={{
                position: "absolute",
                left: 0,
              }}
            >
              <ArrowBack />
            </IconButton>

            {/* Logo/Header */}
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="#8b59fb"
            >
              Clearview
            </Typography>
          </Box>

          {/* Subtitle and Sign in text */}
          <Box textAlign="center" mb={4}>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Journaling made easy
            </Typography>
            <Typography variant="h5" component="h2" fontWeight={600} mb={2}>
              Sign in to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Discord Auth Button */}
          <Stack spacing={3} alignItems="center">
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={
                <Box
                  component="svg"
                  sx={{ width: 24, height: 24 }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                </Box>
              }
              onClick={handleDiscordAuth}
              disabled={loading || !accepted}
              sx={{
                py: 2,
                backgroundColor: "#5865F2",
                "&:hover": {
                  backgroundColor: "#4752C4",
                },
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#FFFFFF",
              }}
            >
              {!accepted ? "Accept terms to continue" : loading ? "Connecting..." : "Continue with Discord"}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              We use Discord for secure, one-click authentication.
              <br />
              Your Discord profile will be used to create your account.
            </Typography>
          </Stack>

          {/* Terms & Conditions */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Terms & Conditions
            </Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                backgroundColor: "#f9f9f9",
                p: 2,
                borderRadius: 1,
                whiteSpace: "pre-wrap",
                mb: 2,
              }}
            >
              <ReactMarkdown>{termsMd || "Loading terms..."}</ReactMarkdown>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                href="/terms_and_conditions.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </Button>
              <Stack direction="row" spacing={1} alignItems="center">
                <input
                  type="checkbox"
                  id="accept_terms"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <label htmlFor="accept_terms">
                  I accept the Terms & Conditions
                </label>
              </Stack>
            </Stack>
          </Box>

          {/* Original optional terms comment */}
          {/*
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={4}
          >
            By continuing, you agree to our{' '}
            <Typography component="a" href="#" color="primary" sx={{ textDecoration: 'none' }}>
              Terms of Service
            </Typography>{' '}
            and{' '}
            <Typography component="a" href="#" color="primary" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </Typography>
          </Typography> */}
        </Paper>
      </Container>
    </Box>
  );
}
