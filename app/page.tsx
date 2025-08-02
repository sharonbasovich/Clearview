'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import {
  Description,
  Search,
  Tag,
  Keyboard,
  FlashOn,
  Security,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = ['Features', 'Pricing', 'About', 'Contact']

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        NoteCraft
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <Button variant="outlined" fullWidth>
              Sign In
            </Button>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <Button variant="contained" fullWidth href="/auth">
              Get Started
            </Button>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box>
      {/* Navigation */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            NoteCraft
          </Typography>
          
          {!isMobile && (
            <Stack direction="row" spacing={4} alignItems="center">
              {navItems.map((item) => (
                <Button key={item} color="inherit" sx={{ color: 'text.primary' }}>
                  {item}
                </Button>
              ))}
              <Button variant="outlined" sx={{ ml: 2 }}>
                Sign In
              </Button>
              <Button variant="contained" href="/auth">
                Get Started
              </Button>
            </Stack>
          )}
          
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 3,
              }}
            >
              Your thoughts, beautifully organized
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              NoteCraft is a powerful, Notion-like note-taking app that helps you capture ideas, 
              organize thoughts, and boost productivity with rich text editing and smart organization.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button 
                variant="contained" 
                size="large"
                href="/auth"
                sx={{ 
                  backgroundColor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Watch Demo
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" component="h2" gutterBottom>
            Everything you need to stay organized
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Powerful features designed to help you capture, organize, and share your ideas effortlessly.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <Description sx={{ fontSize: 48 }} />,
              title: 'Rich Text Editing',
              description: 'Powerful TipTap editor with full formatting support, headings, lists, and more.',
              color: 'primary.main',
            },
            {
              icon: <Search sx={{ fontSize: 48 }} />,
              title: 'Smart Search',
              description: 'Find any note instantly with our powerful search that looks through titles, content, and tags.',
              color: 'secondary.main',
            },
            {
              icon: <Tag sx={{ fontSize: 48 }} />,
              title: 'Tag System',
              description: 'Organize notes with custom tags and create your own organizational system.',
              color: 'success.main',
            },
            {
              icon: <Keyboard sx={{ fontSize: 48 }} />,
              title: 'Keyboard Shortcuts',
              description: 'Boost productivity with extensive keyboard shortcuts for formatting and navigation.',
              color: 'warning.main',
            },
            {
              icon: <FlashOn sx={{ fontSize: 48 }} />,
              title: 'Auto-save',
              description: 'Never lose your work. Notes are automatically saved as you type.',
              color: 'info.main',
            },
            {
              icon: <Security sx={{ fontSize: 48 }} />,
              title: 'Secure & Private',
              description: 'Your notes are stored securely with privacy as our top priority.',
              color: 'error.main',
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          backgroundColor: 'grey.900',
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h2" component="h2" gutterBottom>
              Ready to transform your note-taking?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
              Join thousands of users who have already made the switch to smarter note-taking.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              href="/auth"
              sx={{ 
                px: 4,
                py: 1.5,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Start Taking Notes
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
            {/* Footer */}
      <Box 
        sx={{ 
          backgroundColor: 'grey.100',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2025 NoteCraft. Built with Next.js and Material UI.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

