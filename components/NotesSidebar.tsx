'use client'

import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Collapse,
  InputAdornment,
  Paper,
} from '@mui/material'
import {
  Search,
  Add,
  Description,
  Folder,
  MoreHoriz,
  ExpandMore,
  ChevronRight,
} from '@mui/icons-material'
import { useNotes } from '@/contexts/NotesContext'
import { NoteTree } from '@/types/note'

interface NotesSidebarProps {
  className?: string
}

export function NotesSidebar({ className }: NotesSidebarProps) {
  const { noteTree, currentNote, setCurrentNote, createNote, deleteNote, searchNotes, getNoteById } = useNotes()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemType, setNewItemType] = useState<'page' | 'folder'>('page')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      const results = searchNotes(query)
      setSearchResults(results)
    } else {
      setIsSearching(false)
      setSearchResults([])
    }
  }

  const handleCreateNote = () => {
    if (newItemTitle.trim()) {
      const note = createNote(newItemTitle, undefined, newItemType)
      setCurrentNote(note)
      setNewItemTitle('')
      setIsCreateDialogOpen(false)
    }
  }

  const handleNoteClick = (noteId: string) => {
    const note = getNoteById(noteId)
    if (note && note.type === 'page') {
      setCurrentNote(note)
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, noteId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedNoteId(noteId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedNoteId(null)
  }

  const renderNoteTree = (nodes: NoteTree[], level: number = 0) => {
    return nodes.map((node) => (
      <Box key={node.id}>
        {node.type === 'folder' ? (
          <Box>
            <ListItemButton
              onClick={() => toggleFolder(node.id)}
              sx={{ 
                pl: level * 2 + 1,
                '&:hover .menu-button': { visibility: 'visible' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {expandedFolders.has(node.id) ? <ExpandMore /> : <ChevronRight />}
              </ListItemIcon>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Folder color="primary" />
              </ListItemIcon>
              <ListItemText primary={node.title} />
              <IconButton
                size="small"
                className="menu-button"
                sx={{ visibility: 'hidden' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMenuClick(e, node.id)
                }}
              >
                <MoreHoriz />
              </IconButton>
            </ListItemButton>
            <Collapse in={expandedFolders.has(node.id)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNoteTree(node.children, level + 1)}
              </List>
            </Collapse>
          </Box>
        ) : (
          <ListItemButton
            selected={currentNote?.id === node.id}
            onClick={() => handleNoteClick(node.id)}
            sx={{ 
              pl: level * 2 + 3,
              '&:hover .menu-button': { visibility: 'visible' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Description />
            </ListItemIcon>
            <ListItemText primary={node.title} />
            <IconButton
              size="small"
              className="menu-button"
              sx={{ visibility: 'hidden' }}
              onClick={(e) => {
                e.stopPropagation()
                handleMenuClick(e, node.id)
              }}
            >
              <MoreHoriz />
            </IconButton>
          </ListItemButton>
        )}
        {node.children.length > 0 && node.type === 'page' && (
          <Box sx={{ ml: 3 }}>
            {renderNoteTree(node.children, level + 1)}
          </Box>
        )}
      </Box>
    ))
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        borderRadius: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Notes
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Add />
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {isSearching ? (
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
              Search Results ({searchResults.length})
            </Typography>
            <List>
              {searchResults.map((note) => (
                <ListItemButton
                  key={note.id}
                  selected={currentNote?.id === note.id}
                  onClick={() => handleNoteClick(note.id)}
                >
                  <ListItemIcon>
                    {note.type === 'folder' ? (
                      <Folder color="primary" />
                    ) : (
                      <Description />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={note.title} />
                </ListItemButton>
              ))}
              {searchResults.length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No notes found matching "{searchQuery}"
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        ) : (
          <List>
            {noteTree.length > 0 ? (
              renderNoteTree(noteTree)
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No notes yet
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click + to create your first note
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Box>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle>Create New Item</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant={newItemType === 'page' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setNewItemType('page')}
              startIcon={<Description />}
            >
              Page
            </Button>
            <Button
              variant={newItemType === 'folder' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setNewItemType('folder')}
              startIcon={<Folder />}
            >
              Folder
            </Button>
          </Box>
          <TextField
            fullWidth
            placeholder={`${newItemType === 'page' ? 'Page' : 'Folder'} title...`}
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateNote} disabled={!newItemTitle.trim()} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedNoteId) {
            createNote('New Page', selectedNoteId, 'page')
          }
          handleMenuClose()
        }}>
          Add Page
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedNoteId) {
            createNote('New Folder', selectedNoteId, 'folder')
          }
          handleMenuClose()
        }}>
          Add Folder
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedNoteId) {
              deleteNote(selectedNoteId)
            }
            handleMenuClose()
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  )
}
