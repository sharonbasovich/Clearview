'use client'

import { Box, Container, Paper, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Error } from '@mui/icons-material'

export default function AuthCodeError() {
  const router = useRouter()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" component="h1" fontWeight={700} color="error" mb={2}>
            Authentication Error
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Sorry, there was an error during the authentication process. 
            Please try signing in again.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push('/auth')}
            sx={{ mr: 2 }}
          >
            Try Again
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => router.push('/')}
          >
            Go Home
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}
