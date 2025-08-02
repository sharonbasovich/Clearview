# NoteCraft - Notion-like Note Taking App

A powerful, modern note-taking application built with Next.js, featuring rich text editing and hierarchical organization similar to Notion.

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev)

## ✨ Features

- **Rich Text Editing** - Powered by TipTap with full formatting support
- **Hierarchical Organization** - Create folders and organize notes in a tree structure
- **Real-time Search** - Instantly find notes by title, content, or tags
- **Auto-save** - Notes are automatically saved as you type
- **Discord Authentication** - Secure sign-in with Discord
- **Responsive Design** - Works great on desktop and mobile
- **Tag System** - Organize notes with custom tags
- **Character Counter** - Track your writing progress
- **Keyboard Shortcuts** - Efficient editing with keyboard shortcuts

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with Discord provider
- **Editor**: TipTap (rich text editor)
- **UI Components**: Radix UI with Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Local Storage (easily extendable to database)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd terrahacks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage

1. **Sign In**: Use your Discord account to sign in
2. **Create Notes**: Click the "+" button to create new pages or folders
3. **Rich Editing**: Use the toolbar for formatting or keyboard shortcuts
4. **Organization**: Drag and organize notes in the sidebar
5. **Search**: Use the search bar to quickly find any note
6. **Tags**: Add tags to categorize your notes

## ⌨️ Keyboard Shortcuts

- **Bold**: `Ctrl/Cmd + B`
- **Italic**: `Ctrl/Cmd + I`
- **Code**: `Ctrl/Cmd + Shift + M`
- **Heading 1**: `Ctrl/Cmd + Alt + 1`
- **Heading 2**: `Ctrl/Cmd + Alt + 2`
- **Heading 3**: `Ctrl/Cmd + Alt + 3`
- **Bullet List**: `Ctrl/Cmd + Shift + 8`
- **Numbered List**: `Ctrl/Cmd + Shift + 7`

## 🔧 Configuration

### Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to OAuth2 → General
4. Add redirect URL: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret to your `.env.local`

### Extending Storage

The app currently uses localStorage. To extend to a database:

1. Update the `NotesContext.tsx` to use API calls
2. Create API routes in `app/api/notes/`
3. Set up your preferred database (PostgreSQL, MongoDB, etc.)

## 🎨 Customization

- **Themes**: The app supports light/dark modes through Tailwind
- **Colors**: Modify CSS variables in `app/globals.css`
- **Components**: All UI components are in the `components/` directory
- **Editor**: Customize TipTap extensions in `NoteEditor.tsx`

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── AppHeader.tsx     # App header with user menu
│   ├── NoteEditor.tsx    # Rich text editor
│   └── NotesSidebar.tsx  # Sidebar with notes tree
├── contexts/             # React contexts
│   └── NotesContext.tsx  # Notes state management
├── types/                # TypeScript types
│   └── note.ts           # Note-related types
└── lib/                  # Utilities
    └── utils.ts          # Helper functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [v0.dev](https://v0.dev) for rapid UI development
- Inspired by [Notion](https://notion.so) for the user experience
- Uses [TipTap](https://tiptap.dev) for rich text editing
- UI components from [Radix UI](https://radix-ui.com) and [shadcn/ui](https://ui.shadcn.com)