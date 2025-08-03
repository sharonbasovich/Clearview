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

  const termsContent = `# Privacy Policy & Terms of Service

**Last Updated:** August 2nd, 2025

## 1. Introduction

Welcome to Clearview ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our journaling application and related services (the "Service").

By using our Service, you agree to the collection and use of information in accordance with this policy and our terms of service.

## 2. Information We Collect

### Personal Information
- **Account Information**: When you create an account, we collect your Discord username and user ID
- **Journal Entries**: Your personal journal entries, thoughts, and reflections that you choose to record
- **Usage Data**: Information about how you use our Service, including features accessed and time spent

### Automatically Collected Information
- **Device Information**: Device type, operating system, browser type
- **Log Data**: IP address, access times, pages viewed
- **Cookies**: We use cookies to enhance your experience and maintain your session

## 3. How We Use Your Information

We use your information to:
- Provide, maintain, and improve our Service
- Personalize your journaling experience
- Generate AI insights and suggestions for your entries
- Communicate with you about updates and features
- Ensure the security and integrity of our Service
- Comply with legal obligations

## 4. Data Storage and Security

### Security Measures
- All data is encrypted in transit and at rest
- We use industry-standard security protocols
- Regular security audits and updates
- Access controls limit who can view your data

### Data Retention
- Journal entries are stored securely and retained as long as you maintain your account
- You can delete individual entries or your entire account at any time
- Deleted data is permanently removed from our systems within 30 days

## 5. AI and Data Processing

### AI Insights
- We use AI to analyze your journal entries and provide personalized insights
- This processing happens on secure servers and is used solely to enhance your experience
- Your data is never used to train AI models or shared with third parties

### Data Processing
- All processing is done to provide you with better journaling features
- We do not sell, rent, or share your personal data with advertisers
- Anonymous, aggregated data may be used for service improvements

## 6. Your Rights and Choices

You have the right to:
- **Access**: Request a copy of your personal data
- **Correction**: Update or correct inaccurate information
- **Deletion**: Delete your account and all associated data
- **Portability**: Export your journal entries in a standard format
- **Restriction**: Limit how we process your data

## 7. Third-Party Services

### Discord Authentication
- We use Discord for secure authentication
- We only collect your Discord username and user ID
- Discord's privacy policy applies to their services

### Service Providers
- We may use trusted third-party services for hosting, analytics, and security
- These providers are bound by strict data protection agreements
- They cannot access or use your data beyond what's necessary for their services

## 8. Children's Privacy

Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.

## 9. International Data Transfers

Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.

## 10. Changes to This Policy

We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.

## 11. Terms of Service

### Acceptance of Terms
By accessing and using Clearview, you accept and agree to be bound by these Terms of Service.

### Use of Service
- You must be at least 13 years old to use this Service
- You are responsible for maintaining the confidentiality of your account
- You agree not to use the Service for any unlawful purposes
- You retain ownership of your journal entries and personal data

### Service Availability
- We strive to maintain high availability but cannot guarantee uninterrupted service
- We reserve the right to modify or discontinue features with reasonable notice
- Scheduled maintenance will be announced in advance when possible

### Limitation of Liability
- The Service is provided "as is" without warranties of any kind
- We are not liable for any indirect, incidental, or consequential damages
- Our liability is limited to the amount paid for the Service in the past 12 months

### Termination
- You may terminate your account at any time
- We may terminate accounts that violate these terms
- Upon termination, your data will be deleted according to our retention policy

## 12. Contact Information

If you have any questions about this Privacy Policy or Terms of Service, please contact us at:

**Email**: privacy@clearview-journal.com
**Website**: https://clearview-journal.com/contact

---

*This document serves as both our Privacy Policy and Terms of Service. By using Clearview, you acknowledge that you have read, understood, and agree to be bound by these terms.*`;

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
              Sign in to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Terms & Conditions */}
          <Box mt={4}>
            <Stack
              sx={{ paddingBottom: 2 }}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" gutterBottom>
                Terms & Conditions
              </Typography>
              <Button
                variant="outlined"
                href="https://hc-cdn.hel1.your-objectstorage.com/s/v3/b03df1fc032786d3875950dea67548c263c51046_terms_and_conditions.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </Button>
            </Stack>

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
              <ReactMarkdown>{termsContent}</ReactMarkdown>
            </Box>
            <Stack mb={2} direction="row" spacing={1} alignItems="center">
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
                {!accepted
                  ? "Accept terms to continue"
                  : loading
                  ? "Connecting..."
                  : "Continue with Discord"}
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
