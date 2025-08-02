'use client'

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
} from '@mui/material'
import {
  AccountCircle,
  Settings,
  Logout,
} from '@mui/icons-material'
import { useState } from 'react'

export function AppHeader() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    // For now, just reload the page to go back to landing
    window.location.reload()
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
          NoteCraft
        </Typography>
        
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          onClick={handleMenuClick}
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            <AccountCircle />
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
              <strong>Guest User</strong><br />
              <span style={{ color: 'text.secondary' }}>guest@notecraft.app</span>
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
            <ListItemText>Back to Landing</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
