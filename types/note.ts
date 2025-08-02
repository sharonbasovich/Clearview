export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  parentId?: string
  type: 'page' | 'folder'
  isPublic: boolean
  tags: string[]
}

export interface NoteTree {
  id: string
  title: string
  type: 'page' | 'folder'
  children: NoteTree[]
  parentId?: string
}

export interface Block {
  id: string
  type: 'text' | 'heading' | 'bullet' | 'numbered' | 'quote' | 'code' | 'divider'
  content: string
  level?: number // for headings
}
