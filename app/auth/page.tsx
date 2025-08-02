'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Stack,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
  Email,
  Lock,
  Person,
  ArrowBack,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AuthPage() {
  const [tabValue, setTabValue] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setError('')
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (tabValue === 1 && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      // For demo purposes, just navigate to the app
      router.push('/app')
    } catch (err) {
      setError('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = (provider: string) => {
    setLoading(true)
    // Simulate social auth
    setTimeout(() => {
      router.push('/app')
    }, 1000)
  }

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
            p: 4,
            borderRadius: 3,
            position: 'relative',
          }}
        >
          {/* Back Button */}
          <IconButton
            onClick={() => router.push('/')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Logo/Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" fontWeight={700} color="primary" mb={1}>
              NoteCraft
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to your digital workspace
            </Typography>
          </Box>

          {/* Auth Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Sign In Form */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Stack>
            </form>
          </TabPanel>

          {/* Sign Up Form */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Stack>
            </form>
          </TabPanel>

          {/* Social Auth */}
          <Box mt={3}>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<Google />}
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                Continue with Google
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<GitHub />}
                onClick={() => handleSocialAuth('github')}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                Continue with GitHub
              </Button>
            </Stack>
          </Box>

          {/* Terms */}
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={3}
          >
            By continuing, you agree to our{' '}
            <Typography component="a" href="#" color="primary" sx={{ textDecoration: 'none' }}>
              Terms of Service
            </Typography>{' '}
            and{' '}
            <Typography component="a" href="#" color="primary" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
