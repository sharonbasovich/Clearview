'use client'

import { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
} from '@mui/material'
import {
  AccountCircle,
  Settings,
  Logout,
  Notes,
  Mic,
} from '@mui/icons-material'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export function AppHeader() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navigateToNotes = () => {
    router.push('/app')
  }

  const navigateToVoiceChat = () => {
    router.push('/voice-chat')
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Clearviewe
        </Typography>
        
        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
          <Button
            startIcon={<Notes />}
            onClick={navigateToNotes}
            variant="outlined"
            size="small"
            sx={{ 
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              }
            }}
          >
            Notes
          </Button>
          <Button
            startIcon={<Mic />}
            onClick={navigateToVoiceChat}
            variant="outlined"
            size="small"
            sx={{ 
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'secondary.main',
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText',
              }
            }}
          >
            Voice Chat
          </Button>
        </Box>
        
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          onClick={handleMenuClick}
          color="inherit"
        >
          <Avatar 
            sx={{ width: 32, height: 32 }}
            src={user?.user_metadata?.avatar_url}
          >
            {user?.user_metadata?.full_name?.[0] || <AccountCircle />}
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <MenuItem>
            <Typography variant="body2" sx={{ px: 1, py: 0.5 }}>
              <strong>{user?.user_metadata?.full_name || 'Discord User'}</strong><br />
              <span style={{ color: 'text.secondary' }}>{user?.email || 'No email'}</span>
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
