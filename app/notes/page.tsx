'use client'

import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { NotesProvider } from '@/contexts/NotesContext'
import { NotesSidebar } from '@/components/NotesSidebar'
import { NoteEditor } from '@/components/NoteEditor'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/ui/navigation'
import type { User } from '@supabase/supabase-js'

const DRAWER_WIDTH = 280

export default function NotesPage() {
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
          <Navigation />
        </div>
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', paddingTop: '64px' }}>
          <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
            <NotesSidebar />
          </Box>
          <NoteEditor />
        </Box>
      </Box>
    </NotesProvider>
  )
}
