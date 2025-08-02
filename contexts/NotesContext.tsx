'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Note, NoteTree } from '@/types/note'

interface NotesContextType {
  notes: Note[]
  currentNote: Note | null
  noteTree: NoteTree[]
  createNote: (title: string, parentId?: string, type?: 'page' | 'folder') => Note
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setCurrentNote: (note: Note | null) => void
  getNoteById: (id: string) => Note | undefined
  searchNotes: (query: string) => Note[]
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return context
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notion-notes')
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
      setNotes(parsedNotes)
      
      // Set the first note as current if no current note
      if (parsedNotes.length > 0 && !currentNote) {
        setCurrentNote(parsedNotes[0])
      }
    } else {
      // Create a welcome note if no notes exist
      const welcomeNote = createWelcomeNote()
      setNotes([welcomeNote])
      setCurrentNote(welcomeNote)
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notion-notes', JSON.stringify(notes))
    }
  }, [notes])

  const createWelcomeNote = (): Note => {
    return {
      id: 'welcome-note',
      title: 'Welcome to Your Notes',
      content: `<h1>Welcome to Your Notion-like Notes App! 📝</h1>

<p>This is your first note. Here's what you can do:</p>

<h2>✨ Features</h2>
<ul>
  <li><strong>Rich Text Editing</strong> - Use formatting like <strong>bold</strong>, <em>italic</em>, and more</li>
  <li><strong>Hierarchical Organization</strong> - Create folders and organize your notes</li>
  <li><strong>Search</strong> - Quickly find any note using the search function</li>
  <li><strong>Auto-save</strong> - Your notes are automatically saved as you type</li>
</ul>

<h2>🚀 Getting Started</h2>
<ol>
  <li>Click the "+" button to create a new note or folder</li>
  <li>Use the sidebar to navigate between notes</li>
  <li>Start typing to edit any note</li>
  <li>Use keyboard shortcuts for faster editing</li>
</ol>

<h2>💡 Tips</h2>
<blockquote>
  <p>Use <code>/</code> to open the command menu for quick formatting options</p>
</blockquote>

<p>Happy note-taking! 🎉</p>`,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: 'page',
      isPublic: false,
      tags: ['welcome', 'getting-started']
    }
  }

  const createNote = (title: string, parentId?: string, type: 'page' | 'folder' = 'page'): Note => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title || 'Untitled',
      content: type === 'page' ? '<p></p>' : '',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId,
      type,
      isPublic: false,
      tags: []
    }

    setNotes(prev => [...prev, newNote])
    return newNote
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ))
    
    // Update current note if it's the one being updated
    if (currentNote?.id === id) {
      setCurrentNote(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null)
    }
  }

  const deleteNote = (id: string) => {
    // Delete the note and all its children
    const deleteNoteAndChildren = (noteId: string) => {
      const childNotes = notes.filter(note => note.parentId === noteId)
      childNotes.forEach(child => deleteNoteAndChildren(child.id))
    }

    deleteNoteAndChildren(id)
    setNotes(prev => prev.filter(note => note.id !== id && note.parentId !== id))
    
    // Clear current note if it was deleted
    if (currentNote?.id === id) {
      const remainingNotes = notes.filter(note => note.id !== id)
      setCurrentNote(remainingNotes.length > 0 ? remainingNotes[0] : null)
    }
  }

  const getNoteById = (id: string): Note | undefined => {
    return notes.find(note => note.id === id)
  }

  const searchNotes = (query: string): Note[] => {
    if (!query.trim()) return notes
    
    const lowercaseQuery = query.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Build note tree for sidebar
  const buildNoteTree = (): NoteTree[] => {
    const rootNotes = notes.filter(note => !note.parentId)
    
    const buildChildren = (parentId: string): NoteTree[] => {
      return notes
        .filter(note => note.parentId === parentId)
        .map(note => ({
          id: note.id,
          title: note.title,
          type: note.type,
          parentId: note.parentId,
          children: buildChildren(note.id)
        }))
    }

    return rootNotes.map(note => ({
      id: note.id,
      title: note.title,
      type: note.type,
      parentId: note.parentId,
      children: buildChildren(note.id)
    }))
  }

  const noteTree = buildNoteTree()

  return (
    <NotesContext.Provider value={{
      notes,
      currentNote,
      noteTree,
      createNote,
      updateNote,
      deleteNote,
      setCurrentNote,
      getNoteById,
      searchNotes
    }}>
      {children}
    </NotesContext.Provider>
  )
}
