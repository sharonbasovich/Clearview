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
import { signIn } from "next-auth/react";
import DiscordIcon from '@mui/icons-material/Chat'; // Using Chat icon as a placeholder for Discord

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
  const handleDiscordSignIn = () => {
    signIn("discord", { callbackUrl: "/" });
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
          <Avatar sx={{ m: 1, bgcolor: '#7289DA' }}>
            <DiscordIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in with Discord
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                bgcolor: '#7289DA', 
                '&:hover': { 
                  bgcolor: '#5f73bc' 
                } 
              }}
              onClick={handleDiscordSignIn}
              startIcon={<DiscordIcon />}
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

