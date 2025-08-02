"use client";

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { DiscIcon as Discord } from 'lucide-react';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        EcoFind
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const router = useRouter();

  const handleDiscordSignIn = () => {
    // Replace with your Discord OAuth2 authorization URL
    const DISCORD_AUTH_URL = 'https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=identify%20email';
    
    window.location.href = DISCORD_AUTH_URL;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <Discord />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in with Discord
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#7289da', '&:hover': { bgcolor: '#5f73bc' } }}
              onClick={handleDiscordSignIn}
              startIcon={<Discord />}
            >
              Sign In with Discord
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

