# NoteCraft - Discord-Powered Note Taking App

A Notion-like note-taking application built with Next.js, Material UI, and Supabase with Discord authentication.

## Features

- 🎨 Beautiful Material UI interface
- 📝 Rich text editing with TipTap
- 🔐 Discord OAuth authentication via Supabase
- 📱 Responsive design
- 🏷️ Tag system for organization
- 🔍 Smart search functionality
- ⚡ Real-time auto-save
- 🗂️ Hierarchical note organization

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd terrahacks
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings > API
3. Copy your project URL and anon key

### 3. Configure Discord OAuth

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Discord provider
3. Go to Discord Developer Portal (https://discord.com/developers/applications)
4. Create a new application
5. Go to OAuth2 settings
6. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
7. For local development, also add: `http://localhost:54321/auth/v1/callback`
8. Copy the Client ID and Client Secret to your Supabase Discord provider settings

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
```

### 5. Run the application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Authentication Flow

1. User clicks "Sign In" on the landing page
2. Redirected to `/auth` with Discord authentication
3. After successful authentication, redirected to `/app` (main notes interface)
4. User data and avatar fetched from Discord profile

## Project Structure

```
app/
├── page.tsx              # Landing page
├── auth/
│   ├── page.tsx         # Discord authentication page
│   ├── callback/        # OAuth callback handler
│   └── auth-code-error/ # Error handling
├── app/
│   └── page.tsx         # Main notes application
components/
├── AppHeader.tsx        # App header with user menu
├── NoteEditor.tsx       # Rich text editor
├── NotesSidebar.tsx     # Navigation sidebar
└── ThemeProvider.tsx    # Material UI theme
lib/
└── supabase/           # Supabase client configuration
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: Material UI 6
- **Authentication**: Supabase Auth with Discord OAuth
- **Database**: Supabase (PostgreSQL)
- **Rich Text**: TipTap 3
- **Styling**: Material UI with Emotion
- **TypeScript**: Full type safety

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
