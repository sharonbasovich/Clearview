'use client'

import { useEffect, useState } from 'react'
import { Box, CircularProgress, Container, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { NotesProvider } from '@/contexts/NotesContext'
import { NotesSidebar } from '@/components/NotesSidebar'
import { NoteEditor } from '@/components/NoteEditor'
import { AppHeader } from '@/components/AppHeader'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const DRAWER_WIDTH = 280

export default function NotesApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (!user) {
        router.push('/auth')
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) {
          router.push('/auth')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2 
      }}>
        <CircularProgress />
        <Typography>Loading your workspace...</Typography>
      </Box>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }
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