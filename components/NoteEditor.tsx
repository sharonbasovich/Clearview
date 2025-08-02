'use client'

import React, { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import {
  Box,
  TextField,
  Paper,
  Typography,
  IconButton,
  Toolbar,
  Divider,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  StrikethroughS,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Title,
  Undo,
  Redo,
  Description,
  CalendarToday,
  Tag,
} from '@mui/icons-material'
import { useNotes } from '@/contexts/NotesContext'

export function NoteEditor() {
  const { currentNote, updateNote } = useNotes()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: currentNote?.content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] max-w-none',
        style: 'padding: 16px; min-height: 400px; outline: none;',
      },
    },
    onUpdate: ({ editor }) => {
      if (currentNote) {
        const content = editor.getHTML()
        updateNote(currentNote.id, { content })
      }
    },
  })

  // Update editor content when current note changes
  useEffect(() => {
    if (editor && currentNote) {
      const currentContent = editor.getHTML()
      if (currentContent !== currentNote.content) {
        editor.commands.setContent(currentNote.content)
      }
    }
  }, [currentNote, editor])

  const handleTitleChange = useCallback((newTitle: string) => {
    if (currentNote) {
      updateNote(currentNote.id, { title: newTitle })
    }
  }, [currentNote, updateNote])

  const handleTagAdd = (tag: string) => {
    if (currentNote && tag.trim() && !currentNote.tags.includes(tag.trim())) {
      updateNote(currentNote.id, { 
        tags: [...currentNote.tags, tag.trim()] 
      })
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    if (currentNote) {
      updateNote(currentNote.id, { 
        tags: currentNote.tags.filter(tag => tag !== tagToRemove) 
      })
    }
  }

  if (!currentNote) {
    return (
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 3 
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No note selected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a note from the sidebar to start editing
          </Typography>
        </Box>
      </Box>
    )
  }

  const formatCommands = [
    {
      label: 'Bold',
      icon: <FormatBold />,
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: () => editor?.isActive('bold'),
    },
    {
      label: 'Italic',
      icon: <FormatItalic />,
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: () => editor?.isActive('italic'),
    },
    {
      label: 'Strikethrough',
      icon: <StrikethroughS />,
      action: () => editor?.chain().focus().toggleStrike().run(),
      isActive: () => editor?.isActive('strike'),
    },
    {
      label: 'Code',
      icon: <Code />,
      action: () => editor?.chain().focus().toggleCode().run(),
      isActive: () => editor?.isActive('code'),
    },
    {
      label: 'Quote',
      icon: <FormatQuote />,
      action: () => editor?.chain().focus().toggleBlockquote().run(),
      isActive: () => editor?.isActive('blockquote'),
    },
    {
      label: 'Bullet List',
      icon: <FormatListBulleted />,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: () => editor?.isActive('bulletList'),
    },
    {
      label: 'Numbered List',
      icon: <FormatListNumbered />,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: () => editor?.isActive('orderedList'),
    },
  ]

  const headingCommands = [
    {
      label: 'Heading 1',
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor?.isActive('heading', { level: 1 }),
    },
    {
      label: 'Heading 2',
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor?.isActive('heading', { level: 2 }),
    },
    {
      label: 'Heading 3',
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor?.isActive('heading', { level: 3 }),
    },
  ]

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          m: 2, 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        {/* Note Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Note title..."
            value={currentNote.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.5rem',
                fontWeight: 600,
              },
            }}
          />
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {currentNote.updatedAt.toLocaleDateString()}
              </Typography>
            </Box>
            {editor && (
              <Typography variant="body2" color="text.secondary">
                {editor.storage.characterCount.characters()} characters
              </Typography>
            )}
          </Box>
        </Box>

        {/* Toolbar */}
        <Toolbar variant="dense" sx={{ borderBottom: 1, borderColor: 'divider', gap: 0.5 }}>
          <Tooltip title="Undo">
            <IconButton
              size="small"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
            >
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton
              size="small"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
            >
              <Redo />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {headingCommands.map((command) => (
            <Tooltip key={command.label} title={command.label}>
              <IconButton
                size="small"
                onClick={command.action}
                color={command.isActive() ? 'primary' : 'default'}
              >
                <Title />
              </IconButton>
            </Tooltip>
          ))}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {formatCommands.map((command) => (
            <Tooltip key={command.label} title={command.label}>
              <IconButton
                size="small"
                onClick={command.action}
                color={command.isActive() ? 'primary' : 'default'}
              >
                {command.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Toolbar>

        {/* Editor Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <EditorContent editor={editor} />
        </Box>

        {/* Tags Section */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Tag sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Tags
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {currentNote.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onDelete={() => handleTagRemove(tag)}
                sx={{ mb: 0.5 }}
              />
            ))}
            <TextField
              size="small"
              placeholder="Add tag..."
              variant="outlined"
              sx={{ minWidth: 100 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement
                  const tag = target.value.trim()
                  if (tag) {
                    handleTagAdd(tag)
                    target.value = ''
                  }
                }
              }}
              InputProps={{
                sx: { height: 24 }
              }}
            />
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
