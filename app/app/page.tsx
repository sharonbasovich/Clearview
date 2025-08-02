'use client'

import { Box } from '@mui/material'
import { NotesProvider } from '@/contexts/NotesContext'
import { NotesSidebar } from '@/components/NotesSidebar'
import { NoteEditor } from '@/components/NoteEditor'
import { AppHeader } from '@/components/AppHeader'

const DRAWER_WIDTH = 280

export default function NotesApp() {
  return (
    <NotesProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
            <NotesSidebar />
          </Box>
          <NoteEditor />
        </Box>
      </Box>
    </NotesProvider>
  )
}